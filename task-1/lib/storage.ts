const TOKEN_KEY = 'github_token';
const LAST_ORG_KEY = 'last_org_search';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

export function getLastOrgSearch(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LAST_ORG_KEY);
}

export function setLastOrgSearch(org: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LAST_ORG_KEY, org);
}
