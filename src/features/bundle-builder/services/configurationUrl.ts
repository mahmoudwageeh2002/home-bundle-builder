import type { BundleConfiguration } from '../types/bundle'

const PARAM_NAME = 'config'

export function encodeConfiguration(configuration: BundleConfiguration) {
  return window.btoa(JSON.stringify(configuration))
}

export function decodeConfiguration(value: string | null) {
  if (!value) {
    return null
  }

  try {
    return JSON.parse(window.atob(value)) as BundleConfiguration
  } catch {
    return null
  }
}

export function getConfigurationFromUrl() {
  return decodeConfiguration(new URLSearchParams(window.location.search).get(PARAM_NAME))
}

export function getShareUrl(configuration: BundleConfiguration) {
  const url = new URL(window.location.href)
  url.searchParams.set(PARAM_NAME, encodeConfiguration(configuration))
  return url.toString()
}
