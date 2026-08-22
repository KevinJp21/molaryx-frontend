export * from './types';
export * from './core';
// IMPORTANT: Do not export 'serverApi' from here to avoid 'next/headers' issues in client components.
// Import 'serverApi' directly from './server' in server-only files.
// Import 'clientApi' directly from './client' in client files.

// For backward compatibility only if strictly needed, but better to avoid.
import { clientApi } from './client';
import { serverApi } from './server';

// This might still cause issues if bundled for client. 
// Ideally, consumers should import from specific files.
// However, if we MUST provide a unified export:
export { clientApi } from './client';
// We intentionally do NOT export serverApi or api (hybrid) from here to encourage specific imports.