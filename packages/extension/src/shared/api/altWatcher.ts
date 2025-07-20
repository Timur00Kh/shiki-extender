/**
 * AltWatcher API methods for Chrome extension
 */

import type { 
  ApiConfig, 
  ApiResponse, 
  SearchParams, 
  AnimeMangaItem, 
  UserProfile,
  ApiError,
  RequestOptions
} from './config'
import { ConfigManager } from './config'

/**
 * HTTP client for API requests
 */
export class HttpClient {
  private config: ApiConfig

  constructor(config?: Partial<ApiConfig>) {
    const configManager = ConfigManager.getInstance()
    this.config = { ...configManager.getApiConfig(), ...config }
  }

  /**
   * Make HTTP request
   */
  async request<T = any>(
    url: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.config.timeout,
      retries = this.config.retries
    } = options

    const requestHeaders = {
      ...this.config.headers,
      ...headers
    }

    let lastError: ApiError

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        const response = await fetch(url, {
          method,
          headers: requestHeaders,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw this.createApiError(response)
        }

        const data = await response.json()

        return {
          data,
          status: response.status
        }
      } catch (error) {
        lastError = this.handleRequestError(error)
        
        if (attempt === retries) {
          throw lastError
        }

        // Wait before retry (exponential backoff)
        await this.delay(Math.pow(2, attempt) * 1000)
      }
    }

    throw lastError!
  }

  /**
   * Create API error from response
   */
  private createApiError(response: Response): ApiError {
    let type: ApiError['type']
    
    switch (response.status) {
      case 401:
        type = 'UNAUTHORIZED'
        break
      case 403:
        type = 'FORBIDDEN'
        break
      case 404:
        type = 'NOT_FOUND'
        break
      case 422:
        type = 'VALIDATION_ERROR'
        break
      case 500:
        type = 'SERVER_ERROR'
        break
      default:
        type = 'SERVER_ERROR'
    }

    return {
      type,
      message: `HTTP ${response.status}: ${response.statusText}`,
      status: response.status
    }
  }

  /**
   * Handle request error
   */
  private handleRequestError(error: any): ApiError {
    if (error.name === 'AbortError') {
      return {
        type: 'TIMEOUT_ERROR',
        message: 'Request timeout'
      }
    }

    if (error instanceof TypeError) {
      return {
        type: 'NETWORK_ERROR',
        message: 'Network error'
      }
    }

    if (error.type) {
      return error
    }

    return {
      type: 'NETWORK_ERROR',
      message: error.message || 'Unknown error'
    }
  }

  /**
   * Delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

/**
 * AltWatcher API client
 */
export class AltWatcherApi {
  private httpClient: HttpClient
  private baseUrl: string

  constructor(config?: Partial<ApiConfig>) {
    this.httpClient = new HttpClient(config)
    this.baseUrl = config?.baseUrl || 'https://shikimori.one'
  }

  /**
   * Search anime
   */
  async searchAnime(params: SearchParams): Promise<ApiResponse<AnimeMangaItem[]>> {
    const queryParams = new URLSearchParams()
    
    if (params.query) queryParams.append('search', params.query)
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.limit) queryParams.append('limit', params.limit.toString())
    if (params.order) queryParams.append('order', params.order)
    if (params.kind) queryParams.append('kind', params.kind)
    if (params.status) queryParams.append('status', params.status)
    if (params.genre) queryParams.append('genre', params.genre)
    if (params.rating) queryParams.append('rating', params.rating)
    if (params.score) queryParams.append('score', params.score.toString())
    if (params.duration) queryParams.append('duration', params.duration)
    if (params.censored !== undefined) queryParams.append('censored', params.censored.toString())

    const url = `${this.baseUrl}/api/animes?${queryParams.toString()}`
    return this.httpClient.request<AnimeMangaItem[]>(url)
  }

  /**
   * Search manga
   */
  async searchManga(params: SearchParams): Promise<ApiResponse<AnimeMangaItem[]>> {
    const queryParams = new URLSearchParams()
    
    if (params.query) queryParams.append('search', params.query)
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.limit) queryParams.append('limit', params.limit.toString())
    if (params.order) queryParams.append('order', params.order)
    if (params.kind) queryParams.append('kind', params.kind)
    if (params.status) queryParams.append('status', params.status)
    if (params.genre) queryParams.append('genre', params.genre)
    if (params.rating) queryParams.append('rating', params.rating)
    if (params.score) queryParams.append('score', params.score.toString())
    if (params.censored !== undefined) queryParams.append('censored', params.censored.toString())

    const url = `${this.baseUrl}/api/mangas?${queryParams.toString()}`
    return this.httpClient.request<AnimeMangaItem[]>(url)
  }

  /**
   * Get anime by ID
   */
  async getAnime(id: number): Promise<ApiResponse<AnimeMangaItem>> {
    const url = `${this.baseUrl}/api/animes/${id}`
    return this.httpClient.request<AnimeMangaItem>(url)
  }

  /**
   * Get manga by ID
   */
  async getManga(id: number): Promise<ApiResponse<AnimeMangaItem>> {
    const url = `${this.baseUrl}/api/mangas/${id}`
    return this.httpClient.request<AnimeMangaItem>(url)
  }

  /**
   * Get random anime
   */
  async getRandomAnime(): Promise<ApiResponse<AnimeMangaItem>> {
    const url = `${this.baseUrl}/api/animes/random`
    return this.httpClient.request<AnimeMangaItem>(url)
  }

  /**
   * Get random manga
   */
  async getRandomManga(): Promise<ApiResponse<AnimeMangaItem>> {
    const url = `${this.baseUrl}/api/mangas/random`
    return this.httpClient.request<AnimeMangaItem>(url)
  }

  /**
   * Get top anime
   */
  async getTopAnime(limit: number = 50): Promise<ApiResponse<AnimeMangaItem[]>> {
    const url = `${this.baseUrl}/api/animes/top?limit=${limit}`
    return this.httpClient.request<AnimeMangaItem[]>(url)
  }

  /**
   * Get top manga
   */
  async getTopManga(limit: number = 50): Promise<ApiResponse<AnimeMangaItem[]>> {
    const url = `${this.baseUrl}/api/mangas/top?limit=${limit}`
    return this.httpClient.request<AnimeMangaItem[]>(url)
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId: number | string): Promise<ApiResponse<UserProfile>> {
    const url = `${this.baseUrl}/api/users/${userId}`
    return this.httpClient.request<UserProfile>(url)
  }

  /**
   * Get user anime list
   */
  async getUserAnimeList(userId: number | string, params?: SearchParams): Promise<ApiResponse<AnimeMangaItem[]>> {
    const queryParams = new URLSearchParams()
    
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.status) queryParams.append('status', params.status)

    const url = `${this.baseUrl}/api/users/${userId}/anime_rates?${queryParams.toString()}`
    return this.httpClient.request<AnimeMangaItem[]>(url)
  }

  /**
   * Get user manga list
   */
  async getUserMangaList(userId: number | string, params?: SearchParams): Promise<ApiResponse<AnimeMangaItem[]>> {
    const queryParams = new URLSearchParams()
    
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.status) queryParams.append('status', params.status)

    const url = `${this.baseUrl}/api/users/${userId}/manga_rates?${queryParams.toString()}`
    return this.httpClient.request<AnimeMangaItem[]>(url)
  }

  /**
   * Search characters
   */
  async searchCharacters(query: string, limit: number = 20): Promise<ApiResponse<any[]>> {
    const url = `${this.baseUrl}/api/characters/search?search=${encodeURIComponent(query)}&limit=${limit}`
    return this.httpClient.request<any[]>(url)
  }

  /**
   * Search people
   */
  async searchPeople(query: string, limit: number = 20): Promise<ApiResponse<any[]>> {
    const url = `${this.baseUrl}/api/people/search?search=${encodeURIComponent(query)}&limit=${limit}`
    return this.httpClient.request<any[]>(url)
  }

  /**
   * Get anime genres
   */
  async getAnimeGenres(): Promise<ApiResponse<any[]>> {
    const url = `${this.baseUrl}/api/genres?type=anime`
    return this.httpClient.request<any[]>(url)
  }

  /**
   * Get manga genres
   */
  async getMangaGenres(): Promise<ApiResponse<any[]>> {
    const url = `${this.baseUrl}/api/genres?type=manga`
    return this.httpClient.request<any[]>(url)
  }

  /**
   * Get studios
   */
  async getStudios(): Promise<ApiResponse<any[]>> {
    const url = `${this.baseUrl}/api/studios`
    return this.httpClient.request<any[]>(url)
  }

  /**
   * Get publishers
   */
  async getPublishers(): Promise<ApiResponse<any[]>> {
    const url = `${this.baseUrl}/api/publishers`
    return this.httpClient.request<any[]>(url)
  }
}

/**
 * API service factory
 */
export class ApiServiceFactory {
  private static instance: AltWatcherApi

  /**
   * Get API service instance
   */
  static getInstance(config?: Partial<ApiConfig>): AltWatcherApi {
    if (!ApiServiceFactory.instance) {
      ApiServiceFactory.instance = new AltWatcherApi(config)
    }
    return ApiServiceFactory.instance
  }

  /**
   * Create new API service instance
   */
  static create(config?: Partial<ApiConfig>): AltWatcherApi {
    return new AltWatcherApi(config)
  }
}

/**
 * Export default API service
 */
export const apiService = ApiServiceFactory.getInstance()