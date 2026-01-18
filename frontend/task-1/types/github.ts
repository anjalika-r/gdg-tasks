export type SortOption = 'stars' | 'forks' | 'updated';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  created_at: string;
  private: boolean;
  default_branch: string;
}

export interface GitHubOrg {
  login: string;
  id: number;
  avatar_url: string;
  description: string | null;
  name: string | null;
  public_repos: number;
  html_url: string;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export interface GitHubApiError {
  message: string;
  status: number;
  statusText: string;
}
