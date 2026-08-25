"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { apiGetNotificationHubConnectionAction } from "../actions/get-notification-hub-connection-action";

type TUseSignalROptions = {
  autoConnect?: boolean;
};

type TSignalRHandler = (...args: unknown[]) => void;

export const useSignalR = (options: TUseSignalROptions = {}) => {
  const { autoConnect = true } = options;
  const connectionRef = useRef<HubConnection | null>(null);
  const startingRef = useRef(false);
  const [connectionState, setConnectionState] = useState<HubConnectionState>(
    HubConnectionState.Disconnected,
  );

  const syncState = useCallback((connection: HubConnection | null) => {
    setConnectionState(connection?.state ?? HubConnectionState.Disconnected);
  }, []);

  const stop = useCallback(async () => {
    const connection = connectionRef.current;

    if (!connection) {
      syncState(null);
      return;
    }

    connectionRef.current = null;

    try {
      if (connection.state !== HubConnectionState.Disconnected) {
        await connection.stop();
      }
    } finally {
      syncState(null);
    }
  }, [syncState]);

  const start = useCallback(async () => {
    if (
      connectionRef.current?.state === HubConnectionState.Connected ||
      startingRef.current
    ) {
      return;
    }

    startingRef.current = true;
    let connection: HubConnection | null = null;

    try {
      const result = await apiGetNotificationHubConnectionAction();
      if (!result.success || !result.hubUrl || !result.accessToken) {
        throw new Error(
          result.message ?? "No se pudo obtener la conexión al hub.",
        );
      }

      await stop();

      connection = new HubConnectionBuilder()
        .withUrl(result.hubUrl, {
          accessTokenFactory: async () => {
            const refreshed = await apiGetNotificationHubConnectionAction();
            if (!refreshed.success || !refreshed.accessToken) {
              throw new Error(
                refreshed.message ??
                  "No se pudo renovar el token del hub.",
              );
            }
            return refreshed.accessToken;
          },
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Warning)
        .build();

      connection.onreconnecting(() => syncState(connection));
      connection.onreconnected(() => syncState(connection));
      connection.onclose(() => {
        if (connectionRef.current !== connection) {
          return;
        }

        connectionRef.current = null;
        syncState(null);
      });

      connectionRef.current = connection;
      await connection.start();
      syncState(connection);
    } catch (error) {
      if (connectionRef.current === connection) {
        connectionRef.current = null;
        syncState(null);
      }
      throw error;
    } finally {
      startingRef.current = false;
    }
  }, [stop, syncState]);

  const invoke = useCallback(
    async <T = unknown>(methodName: string, ...args: unknown[]) => {
      const connection = connectionRef.current;
      if (!connection || connection.state !== HubConnectionState.Connected) {
        throw new Error("La conexión SignalR no está activa.");
      }
      return connection.invoke<T>(methodName, ...args);
    },
    [],
  );

  const on = useCallback((methodName: string, callback: TSignalRHandler) => {
    const connection = connectionRef.current;
    if (!connection) {
      throw new Error("La conexión SignalR no está inicializada.");
    }
    connection.on(methodName, callback);
  }, []);

  const off = useCallback(
    (methodName: string, callback?: TSignalRHandler) => {
      const connection = connectionRef.current;
      if (!connection) return;
      if (callback) {
        connection.off(methodName, callback);
        return;
      }
      connection.off(methodName);
    },
    [],
  );

  useEffect(() => {
    if (!autoConnect) return;

    void start().catch((error) => {
      console.error("[SignalR]", error);
    });

    return () => {
      void stop();
    };
  }, [autoConnect, start, stop]);

  return {
    connectionState,
    isConnected: connectionState === HubConnectionState.Connected,
    start,
    stop,
    invoke,
    on,
    off,
  };
};
