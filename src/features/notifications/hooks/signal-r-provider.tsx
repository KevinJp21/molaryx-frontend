"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useSignalR } from "./use-signal-r";

type TSignalRContextValue = ReturnType<typeof useSignalR>;

const SignalRContext = createContext<TSignalRContextValue | null>(null);

type TSignalRProviderProps = {
  children: ReactNode;
  autoConnect?: boolean;
};

export const SignalRProvider = ({
  children,
  autoConnect = true,
}: TSignalRProviderProps) => {
  const signalR = useSignalR({ autoConnect });

  return (
    <SignalRContext.Provider value={signalR}>{children}</SignalRContext.Provider>
  );
};

export const useSignalRContext = () => {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error(
      "useSignalRContext debe usarse dentro de SignalRProvider.",
    );
  }
  return context;
};
