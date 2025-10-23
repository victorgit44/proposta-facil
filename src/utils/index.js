import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function createPageUrl(pageName, params = {}) {
  const searchParams = new URLSearchParams(params)
  const query = searchParams.toString()
  return `/${pageName}${query ? `?${query}` : ''}`
}