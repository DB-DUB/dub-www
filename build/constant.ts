/**
 * @name Config
 * @description Project Config
 */

// local development port
export const VITE_PORT = 5000

// serve
export const API_BASE_URL = '/api'
export const API_TARGET_URL = 'https://api.demo.com/api'

// mock
export const VITE_USE_MOCK = false
export const MOCK_API_BASE_URL = '/mock/api'
export const MOCK_API_TARGET_URL = `http://localhost:${VITE_PORT}`

export const VITE_PROXY = [
  [API_BASE_URL, API_TARGET_URL],
  [MOCK_API_BASE_URL, MOCK_API_TARGET_URL]
]

// if need gzip compression
export const COMPRESSION = false
