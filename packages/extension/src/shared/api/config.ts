/**
 * API configuration for Chrome extension
 */

/**
 * API configuration interface
 */
export interface ApiConfig {
  baseUrl: string
  timeout: number
  retries: number
  headers: Record<string, string>
}

/**
 * Default API configuration
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  baseUrl: 'https://shikimori.one',
  timeout: 10000,
  retries: 3,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  // Anime endpoints
  ANIME: {
    SEARCH: '/api/animes',
    GET_BY_ID: '/api/animes/:id',
    GET_RANDOM: '/api/animes/random',
    GET_TOP: '/api/animes/top'
  },

  // Manga endpoints
  MANGA: {
    SEARCH: '/api/mangas',
    GET_BY_ID: '/api/mangas/:id',
    GET_RANDOM: '/api/mangas/random',
    GET_TOP: '/api/mangas/top'
  },

  // User endpoints
  USER: {
    GET_PROFILE: '/api/users/:id',
    GET_ANIME_LIST: '/api/users/:id/anime_rates',
    GET_MANGA_LIST: '/api/users/:id/manga_rates'
  },

  // Search endpoints
  SEARCH: {
    ANIME: '/api/animes/search',
    MANGA: '/api/mangas/search',
    CHARACTERS: '/api/characters/search',
    PEOPLE: '/api/people/search'
  }
}

/**
 * API response types
 */
export interface ApiResponse<T = any> {
  data: T
  status: number
  message?: string
  errors?: string[]
}

/**
 * Search parameters interface
 */
export interface SearchParams {
  query?: string
  page?: number
  limit?: number
  order?: string
  kind?: string
  status?: string
  genre?: string
  rating?: string
  score?: number
  duration?: string
  censored?: boolean
}

/**
 * Anime/Manga item interface
 */
export interface AnimeMangaItem {
  id: number
  name: string
  russian?: string
  image: {
    original: string
    preview: string
    x96: string
    x48: string
  }
  url: string
  kind: string
  score: number
  status: string
  episodes: number
  episodes_aired: number
  aired_on?: string
  released_on?: string
  rating: string
  english: string[]
  japanese: string[]
  synonyms: string[]
  license_name_ru?: string
  duration: number
  description: string
  description_html: string
  franchise?: string
  favoured: boolean
  anons: boolean
  ongoing: boolean
  thread_id: number
  topic_id: number
  myanimelist_id: number
  rates_scores_stats: Array<{
    name: number
    value: number
  }>
  rates_statuses_stats: Array<{
    name: string
    value: number
  }>
  updated_at: string
  next_episode_at?: string
  fansubbers: string[]
  fandubbers: string[]
  licensors: string[]
  genres: Array<{
    id: number
    name: string
    russian: string
    kind: string
  }>
  studios: Array<{
    id: number
    name: string
    filtered_name: string
    real: boolean
    image: string
  }>
  videos: Array<{
    id: number
    url: string
    image_url: string
    player_url: string
    name: string
    kind: string
    hosting: string
  }>
  screenshots: Array<{
    original: string
    preview: string
  }>
  user_rate?: {
    id: number
    score: number
    status: string
    text: string
    episodes: number
    chapters: number
    volumes: number
    text_html: string
    rewatches: number
    created_at: string
    updated_at: string
  }
}

/**
 * User profile interface
 */
export interface UserProfile {
  id: number
  nickname: string
  avatar: string
  image: {
    x160: string
    x148: string
    x80: string
    x64: string
    x48: string
    x32: string
    x16: string
  }
  last_online_at: string
  url: string
  name?: string
  sex?: string
  full_years?: number
  website?: string
  location?: string
  banned: boolean
  about?: string
  about_html?: string
  common_info: string[]
  show_comments: boolean
  in_friends: boolean
  is_ignored: boolean
  stats: {
    statuses: Record<string, number>
    full_statuses: Record<string, number>
    scores: Record<string, number>
    types: Record<string, number>
    ratings: Record<string, number>
    has_anime?: boolean
    has_manga?: boolean
    genres: Array<{
      id: number
      name: string
      size: number
      type: string
    }>
    studios: Array<{
      id: number
      name: string
      size: number
    }>
    publishers: Array<{
      id: number
      name: string
      size: number
    }>
    activity: Array<{
      date: string
      value: number
    }>
  }
  style_id?: number
}

/**
 * API error types
 */
export enum ApiErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  PARSE_ERROR = 'PARSE_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND'
}

/**
 * API error interface
 */
export interface ApiError {
  type: ApiErrorType
  message: string
  status?: number
  data?: any
}

/**
 * Request options interface
 */
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
  timeout?: number
  retries?: number
}

/**
 * Cache configuration
 */
export interface CacheConfig {
  enabled: boolean
  ttl: number // Time to live in milliseconds
  maxSize: number // Maximum number of cached items
}

/**
 * Extension configuration
 */
export interface ExtensionConfig {
  api: ApiConfig
  cache: CacheConfig
  features: {
    autoSync: boolean
    notifications: boolean
    analytics: boolean
  }
  ui: {
    theme: 'light' | 'dark' | 'auto'
    language: string
    compactMode: boolean
  }
}

/**
 * Default extension configuration
 */
export const DEFAULT_EXTENSION_CONFIG: ExtensionConfig = {
  api: DEFAULT_API_CONFIG,
  cache: {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 100
  },
  features: {
    autoSync: true,
    notifications: true,
    analytics: false
  },
  ui: {
    theme: 'auto',
    language: 'en',
    compactMode: false
  }
}

/**
 * Configuration manager
 */
export class ConfigManager {
  private static instance: ConfigManager
  private config: ExtensionConfig

  private constructor() {
    this.config = { ...DEFAULT_EXTENSION_CONFIG }
  }

  /**
   * Get singleton instance
   */
  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager()
    }
    return ConfigManager.instance
  }

  /**
   * Get current configuration
   */
  getConfig(): ExtensionConfig {
    return { ...this.config }
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<ExtensionConfig>): void {
    this.config = { ...this.config, ...updates }
  }

  /**
   * Get API configuration
   */
  getApiConfig(): ApiConfig {
    return { ...this.config.api }
  }

  /**
   * Get cache configuration
   */
  getCacheConfig(): CacheConfig {
    return { ...this.config.cache }
  }

  /**
   * Reset to default configuration
   */
  resetToDefault(): void {
    this.config = { ...DEFAULT_EXTENSION_CONFIG }
  }
}