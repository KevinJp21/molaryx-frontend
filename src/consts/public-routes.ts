export const PUBLIC_AUTH_ROUTES = [
  '/sign-in',
  '/sign-up',
  '/forgot-password',
  '/reset-password',
] as const;

export const PROTECTED_ROUTE_PREFIXES = [
  '/dashboard',
  '/platform',
] as const;
