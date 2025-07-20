/**
 * DOM utilities for Chrome extension
 */

/**
 * Element selector types
 */
export type ElementSelector = string | Element | Element[] | NodeList

/**
 * DOM utility class
 */
export class DOMUtils {
  /**
   * Get element by selector
   */
  static getElement(selector: string): Element | null {
    return document.querySelector(selector)
  }

  /**
   * Get elements by selector
   */
  static getElements(selector: string): Element[] {
    return Array.from(document.querySelectorAll(selector))
  }

  /**
   * Check if element exists
   */
  static exists(selector: string): boolean {
    return document.querySelector(selector) !== null
  }

  /**
   * Wait for element to appear
   */
  static waitForElement(selector: string, timeout: number = 5000): Promise<Element> {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector)
      if (element) {
        resolve(element)
        return
      }

      const observer = new MutationObserver((mutations) => {
        const element = document.querySelector(selector)
        if (element) {
          observer.disconnect()
          resolve(element)
        }
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true
      })

      setTimeout(() => {
        observer.disconnect()
        reject(new Error(`Element ${selector} not found within ${timeout}ms`))
      }, timeout)
    })
  }

  /**
   * Create element with attributes
   */
  static createElement<T extends HTMLElement>(
    tagName: string,
    attributes: Record<string, string> = {},
    children: (string | Element)[] = []
  ): T {
    const element = document.createElement(tagName) as T
    
    // Set attributes
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value)
    }

    // Add children
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child))
      } else {
        element.appendChild(child)
      }
    })

    return element
  }

  /**
   * Add CSS styles to element
   */
  static addStyles(element: Element, styles: Record<string, string>): void {
    for (const [property, value] of Object.entries(styles)) {
      (element as HTMLElement).style[property as any] = value
    }
  }

  /**
   * Add CSS class to element
   */
  static addClass(element: Element, className: string): void {
    element.classList.add(className)
  }

  /**
   * Remove CSS class from element
   */
  static removeClass(element: Element, className: string): void {
    element.classList.remove(className)
  }

  /**
   * Toggle CSS class on element
   */
  static toggleClass(element: Element, className: string): void {
    element.classList.toggle(className)
  }

  /**
   * Check if element has CSS class
   */
  static hasClass(element: Element, className: string): boolean {
    return element.classList.contains(className)
  }

  /**
   * Get computed styles of element
   */
  static getComputedStyles(element: Element): CSSStyleDeclaration {
    return window.getComputedStyle(element)
  }

  /**
   * Get element position relative to viewport
   */
  static getElementPosition(element: Element): { x: number; y: number; width: number; height: number } {
    const rect = element.getBoundingClientRect()
    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height
    }
  }

  /**
   * Check if element is visible
   */
  static isVisible(element: Element): boolean {
    const styles = this.getComputedStyles(element)
    return styles.display !== 'none' && 
           styles.visibility !== 'hidden' && 
           styles.opacity !== '0'
  }

  /**
   * Show element
   */
  static show(element: Element): void {
    (element as HTMLElement).style.display = ''
  }

  /**
   * Hide element
   */
  static hide(element: Element): void {
    (element as HTMLElement).style.display = 'none'
  }

  /**
   * Remove element from DOM
   */
  static remove(element: Element): void {
    element.remove()
  }

  /**
   * Insert element after target
   */
  static insertAfter(element: Element, target: Element): void {
    target.parentNode?.insertBefore(element, target.nextSibling)
  }

  /**
   * Insert element before target
   */
  static insertBefore(element: Element, target: Element): void {
    target.parentNode?.insertBefore(element, target)
  }

  /**
   * Replace element with new element
   */
  static replace(oldElement: Element, newElement: Element): void {
    oldElement.parentNode?.replaceChild(newElement, oldElement)
  }

  /**
   * Add event listener with options
   */
  static addEventListener(
    element: Element,
    event: string,
    handler: EventListener,
    options?: AddEventListenerOptions
  ): void {
    element.addEventListener(event, handler, options)
  }

  /**
   * Remove event listener
   */
  static removeEventListener(
    element: Element,
    event: string,
    handler: EventListener,
    options?: EventListenerOptions
  ): void {
    element.removeEventListener(event, handler, options)
  }

  /**
   * Dispatch custom event
   */
  static dispatchEvent(element: Element, eventName: string, detail?: any): boolean {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      cancelable: true
    })
    return element.dispatchEvent(event)
  }

  /**
   * Get element text content
   */
  static getTextContent(element: Element): string {
    return element.textContent || ''
  }

  /**
   * Set element text content
   */
  static setTextContent(element: Element, text: string): void {
    element.textContent = text
  }

  /**
   * Get element inner HTML
   */
  static getInnerHTML(element: Element): string {
    return element.innerHTML
  }

  /**
   * Set element inner HTML
   */
  static setInnerHTML(element: Element, html: string): void {
    element.innerHTML = html
  }

  /**
   * Get element attribute
   */
  static getAttribute(element: Element, name: string): string | null {
    return element.getAttribute(name)
  }

  /**
   * Set element attribute
   */
  static setAttribute(element: Element, name: string, value: string): void {
    element.setAttribute(name, value)
  }

  /**
   * Remove element attribute
   */
  static removeAttribute(element: Element, name: string): void {
    element.removeAttribute(name)
  }

  /**
   * Check if element has attribute
   */
  static hasAttribute(element: Element, name: string): boolean {
    return element.hasAttribute(name)
  }

  /**
   * Get parent element
   */
  static getParent(element: Element): Element | null {
    return element.parentElement
  }

  /**
   * Get child elements
   */
  static getChildren(element: Element): Element[] {
    return Array.from(element.children)
  }

  /**
   * Get next sibling element
   */
  static getNextSibling(element: Element): Element | null {
    return element.nextElementSibling
  }

  /**
   * Get previous sibling element
   */
  static getPreviousSibling(element: Element): Element | null {
    return element.previousElementSibling
  }

  /**
   * Find closest parent matching selector
   */
  static findClosest(element: Element, selector: string): Element | null {
    return element.closest(selector)
  }

  /**
   * Find child elements matching selector
   */
  static findChildren(element: Element, selector: string): Element[] {
    return Array.from(element.querySelectorAll(selector))
  }

  /**
   * Find child element matching selector
   */
  static findChild(element: Element, selector: string): Element | null {
    return element.querySelector(selector)
  }

  /**
   * Scroll element into view
   */
  static scrollIntoView(element: Element, options?: ScrollIntoViewOptions): void {
    element.scrollIntoView(options)
  }

  /**
   * Focus element
   */
  static focus(element: Element): void {
    (element as HTMLElement).focus()
  }

  /**
   * Blur element
   */
  static blur(element: Element): void {
    (element as HTMLElement).blur()
  }

  /**
   * Check if element is focused
   */
  static isFocused(element: Element): boolean {
    return document.activeElement === element
  }

  /**
   * Get element value (for form elements)
   */
  static getValue(element: Element): string {
    return (element as HTMLInputElement).value || ''
  }

  /**
   * Set element value (for form elements)
   */
  static setValue(element: Element, value: string): void {
    (element as HTMLInputElement).value = value
  }

  /**
   * Check if element is checked (for checkboxes/radio buttons)
   */
  static isChecked(element: Element): boolean {
    return (element as HTMLInputElement).checked || false
  }

  /**
   * Set element checked state
   */
  static setChecked(element: Element, checked: boolean): void {
    (element as HTMLInputElement).checked = checked
  }
}

/**
 * Mutation observer utilities
 */
export class MutationObserverUtils {
  /**
   * Watch for DOM changes
   */
  static watch(
    target: Node,
    callback: (mutations: MutationRecord[]) => void,
    options: MutationObserverInit = { childList: true, subtree: true }
  ): MutationObserver {
    const observer = new MutationObserver(callback)
    observer.observe(target, options)
    return observer
  }

  /**
   * Watch for element appearance
   */
  static watchForElement(
    selector: string,
    callback: (element: Element) => void,
    timeout: number = 5000
  ): MutationObserver {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element
            if (element.matches(selector)) {
              callback(element)
              return
            }
            const child = element.querySelector(selector)
            if (child) {
              callback(child)
              return
            }
          }
        }
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    // Set timeout
    setTimeout(() => {
      observer.disconnect()
    }, timeout)

    return observer
  }
}

/**
 * Intersection observer utilities
 */
export class IntersectionObserverUtils {
  /**
   * Watch element visibility
   */
  static watchVisibility(
    element: Element,
    callback: (isVisible: boolean) => void,
    options: IntersectionObserverInit = {}
  ): IntersectionObserver {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        callback(entry.isIntersecting)
      })
    }, options)

    observer.observe(element)
    return observer
  }
}