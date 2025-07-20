/**
 * Storage utilities for localStorage and IndexedDB
 */

/**
 * LocalStorage wrapper with error handling
 */
export class LocalStorage {
  /**
   * Set item in localStorage
   */
  static setItem(key: string, value: any): boolean {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(key, serializedValue)
      return true
    } catch (error) {
      console.error('Failed to set localStorage item:', error)
      return false
    }
  }

  /**
   * Get item from localStorage
   */
  static getItem<T = any>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key)
      if (item === null) {
        return defaultValue || null
      }
      return JSON.parse(item)
    } catch (error) {
      console.error('Failed to get localStorage item:', error)
      return defaultValue || null
    }
  }

  /**
   * Remove item from localStorage
   */
  static removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Failed to remove localStorage item:', error)
      return false
    }
  }

  /**
   * Clear all localStorage items
   */
  static clear(): boolean {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
      return false
    }
  }

  /**
   * Check if localStorage is available
   */
  static isAvailable(): boolean {
    try {
      const test = '__localStorage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }
}

/**
 * IndexedDB wrapper for more complex data storage
 */
export class IndexedDB {
  private dbName: string
  private version: number
  private db: IDBDatabase | null = null

  constructor(dbName: string, version: number = 1) {
    this.dbName = dbName
    this.version = version
  }

  /**
   * Initialize database
   */
  async init(): Promise<boolean> {
    return new Promise((resolve) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error)
        resolve(false)
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve(true)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        // Create object stores here if needed
        if (!db.objectStoreNames.contains('links')) {
          const linksStore = db.createObjectStore('links', { keyPath: 'id', autoIncrement: true })
          linksStore.createIndex('hash_id', 'hash_id', { unique: true })
        }
      }
    })
  }

  /**
   * Add item to store
   */
  async add(storeName: string, item: any): Promise<boolean> {
    if (!this.db) {
      console.error('Database not initialized')
      return false
    }

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.add(item)

      request.onsuccess = () => resolve(true)
      request.onerror = () => {
        console.error('Failed to add item to IndexedDB:', request.error)
        resolve(false)
      }
    })
  }

  /**
   * Get item from store
   */
  async get<T = any>(storeName: string, key: any): Promise<T | null> {
    if (!this.db) {
      console.error('Database not initialized')
      return null
    }

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(key)

      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => {
        console.error('Failed to get item from IndexedDB:', request.error)
        resolve(null)
      }
    })
  }

  /**
   * Update item in store
   */
  async update(storeName: string, item: any): Promise<boolean> {
    if (!this.db) {
      console.error('Database not initialized')
      return false
    }

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.put(item)

      request.onsuccess = () => resolve(true)
      request.onerror = () => {
        console.error('Failed to update item in IndexedDB:', request.error)
        resolve(false)
      }
    })
  }

  /**
   * Delete item from store
   */
  async delete(storeName: string, key: any): Promise<boolean> {
    if (!this.db) {
      console.error('Database not initialized')
      return false
    }

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(key)

      request.onsuccess = () => resolve(true)
      request.onerror = () => {
        console.error('Failed to delete item from IndexedDB:', request.error)
        resolve(false)
      }
    })
  }

  /**
   * Get all items from store
   */
  async getAll<T = any>(storeName: string): Promise<T[]> {
    if (!this.db) {
      console.error('Database not initialized')
      return []
    }

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => {
        console.error('Failed to get all items from IndexedDB:', request.error)
        resolve([])
      }
    })
  }

  /**
   * Clear all items from store
   */
  async clear(storeName: string): Promise<boolean> {
    if (!this.db) {
      console.error('Database not initialized')
      return false
    }

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.clear()

      request.onsuccess = () => resolve(true)
      request.onerror = () => {
        console.error('Failed to clear store in IndexedDB:', request.error)
        resolve(false)
      }
    })
  }

  /**
   * Close database connection
   */
  close(): void {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }
}

/**
 * Chrome extension storage wrapper
 */
export class ChromeStorage {
  /**
   * Set item in Chrome storage
   */
  static async setItem(key: string, value: any): Promise<boolean> {
    try {
      await chrome.storage.local.set({ [key]: value })
      return true
    } catch (error) {
      console.error('Failed to set Chrome storage item:', error)
      return false
    }
  }

  /**
   * Get item from Chrome storage
   */
  static async getItem<T = any>(key: string, defaultValue?: T): Promise<T | null> {
    try {
      const result = await chrome.storage.local.get([key])
      return result[key] !== undefined ? result[key] : (defaultValue || null)
    } catch (error) {
      console.error('Failed to get Chrome storage item:', error)
      return defaultValue || null
    }
  }

  /**
   * Remove item from Chrome storage
   */
  static async removeItem(key: string): Promise<boolean> {
    try {
      await chrome.storage.local.remove([key])
      return true
    } catch (error) {
      console.error('Failed to remove Chrome storage item:', error)
      return false
    }
  }

  /**
   * Clear all Chrome storage items
   */
  static async clear(): Promise<boolean> {
    try {
      await chrome.storage.local.clear()
      return true
    } catch (error) {
      console.error('Failed to clear Chrome storage:', error)
      return false
    }
  }
}