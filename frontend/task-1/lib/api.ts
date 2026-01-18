import type { GitHubRepo, GitHubOrg, GitHubApiError } from '@/types/github';

const GITHUB_API_BASE = 'https://api.github.com';

async function fetchWithAuth(url: string, token?: string): Promise<Response> {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };

  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    const error: GitHubApiError = {
      message: await response.text().catch(() => 'Unknown error'),
      status: response.status,
      statusText: response.statusText,
    };
    throw error;
  }

  return response;
}

export async function fetchOrgRepos(
  org: string,
  page: number = 1,
  perPage: number = 10,
  token?: string
): Promise<GitHubRepo[]> {
  const url = `${GITHUB_API_BASE}/orgs/${encodeURIComponent(org)}/repos?page=${page}&per_page=${perPage}&sort=updated`;
  
  try {
    const response = await fetchWithAuth(url, token);
    const repos: GitHubRepo[] = await response.json();
    return repos;
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) {
      throw error as GitHubApiError;
    }
    throw {
      message: error instanceof Error ? error.message : 'Network error',
      status: 0,
      statusText: 'Network Error',
    } as GitHubApiError;
  }
}

export async function fetchOrgMetadata(
  org: string,
  token?: string
): Promise<GitHubOrg> {
  const url = `${GITHUB_API_BASE}/orgs/${encodeURIComponent(org)}`;
  
  try {
    const response = await fetchWithAuth(url, token);
    const orgData: GitHubOrg = await response.json();
    return orgData;
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) {
      throw error as GitHubApiError;
    }
    throw {
      message: error instanceof Error ? error.message : 'Network error',
      status: 0,
      statusText: 'Network Error',
    } as GitHubApiError;
  }
}
