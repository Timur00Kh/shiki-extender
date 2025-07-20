/**
 * Color utilities and ColorPicker logic
 */

/**
 * Color representation interface
 */
export interface Color {
  r: number
  g: number
  b: number
  a?: number
}

/**
 * HSL color representation
 */
export interface HSL {
  h: number
  s: number
  l: number
  a?: number
}

/**
 * HSV color representation
 */
export interface HSV {
  h: number
  s: number
  v: number
  a?: number
}

/**
 * Default color palette
 */
export const DEFAULT_COLORS = [
  '#FF0000', '#FF4500', '#FF8C00', '#FFD700', '#FFFF00',
  '#ADFF2F', '#00FF00', '#00FA9A', '#00FFFF', '#00BFFF',
  '#0000FF', '#8A2BE2', '#FF00FF', '#FF1493', '#FF69B4',
  '#FFFFFF', '#F5F5F5', '#D3D3D3', '#A9A9A9', '#808080',
  '#696969', '#404040', '#2F2F2F', '#1C1C1C', '#000000'
]

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): Color | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return null
  
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  }
}

/**
 * Convert RGB to hex color
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = n.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(h: number, s: number, l: number): Color {
  h /= 360
  s /= 100
  l /= 100

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1/6) return p + (q - p) * 6 * t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
  }

  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}

/**
 * Convert RGB to HSV
 */
export function rgbToHsv(r: number, g: number, b: number): HSV {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  const s = max === 0 ? 0 : d / max
  const v = max

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  }
}

/**
 * Convert HSV to RGB
 */
export function hsvToRgb(h: number, s: number, v: number): Color {
  h /= 360
  s /= 100
  v /= 100

  const i = Math.floor(h * 6)
  const f = h * 6 - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)

  let r, g, b

  switch (i % 6) {
    case 0:
      r = v; g = t; b = p
      break
    case 1:
      r = q; g = v; b = p
      break
    case 2:
      r = p; g = v; b = t
      break
    case 3:
      r = p; g = q; b = v
      break
    case 4:
      r = t; g = p; b = v
      break
    case 5:
      r = v; g = p; b = q
      break
    default:
      r = g = b = v
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}

/**
 * Validate hex color format
 */
export function isValidHexColor(hex: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)
}

/**
 * Generate random color
 */
export function generateRandomColor(): string {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

/**
 * Get contrast color (black or white) for given background color
 */
export function getContrastColor(hexColor: string): string {
  const rgb = hexToRgb(hexColor)
  if (!rgb) return '#000000'
  
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
  return brightness > 128 ? '#000000' : '#FFFFFF'
}

/**
 * Lighten color by percentage
 */
export function lightenColor(hexColor: string, percent: number): string {
  const rgb = hexToRgb(hexColor)
  if (!rgb) return hexColor
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  hsl.l = Math.min(100, hsl.l + percent)
  
  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l)
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b)
}

/**
 * Darken color by percentage
 */
export function darkenColor(hexColor: string, percent: number): string {
  const rgb = hexToRgb(hexColor)
  if (!rgb) return hexColor
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  hsl.l = Math.max(0, hsl.l - percent)
  
  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l)
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b)
}

/**
 * Generate color palette from base color
 */
export function generateColorPalette(baseColor: string, count: number = 5): string[] {
  const palette: string[] = []
  const step = 100 / (count - 1)
  
  for (let i = 0; i < count; i++) {
    const lightness = i * step
    const rgb = hexToRgb(baseColor)
    if (!rgb) continue
    
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    hsl.l = lightness
    
    const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l)
    palette.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
  }
  
  return palette
}

/**
 * Color picker state management
 */
export class ColorPicker {
  private currentColor: string
  private onChange: (color: string) => void

  constructor(initialColor: string = '#000000', onChange?: (color: string) => void) {
    this.currentColor = initialColor
    this.onChange = onChange || (() => {})
  }

  /**
   * Set current color
   */
  setColor(color: string): void {
    if (isValidHexColor(color)) {
      this.currentColor = color
      this.onChange(color)
    }
  }

  /**
   * Get current color
   */
  getColor(): string {
    return this.currentColor
  }

  /**
   * Update color from RGB values
   */
  updateFromRgb(r: number, g: number, b: number): void {
    const hex = rgbToHex(r, g, b)
    this.setColor(hex)
  }

  /**
   * Update color from HSL values
   */
  updateFromHsl(h: number, s: number, l: number): void {
    const rgb = hslToRgb(h, s, l)
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
    this.setColor(hex)
  }

  /**
   * Update color from HSV values
   */
  updateFromHsv(h: number, s: number, v: number): void {
    const rgb = hsvToRgb(h, s, v)
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
    this.setColor(hex)
  }
}