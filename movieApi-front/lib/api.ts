import { type AuthResponse, getAuthFromCookies, isTokenExpired, setAuthCookies } from "./auth"

const API_BASE_URL = "http://localhost:8080"

// API client with automatic token refresh
export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const { accessToken, refreshToken } = getAuthFromCookies()

  // Add authorization header if we have a token
  const headers = { ...options.headers } as Record<string, string>

  if (accessToken) {
    // Check if token is expired and refresh if needed
    if (isTokenExpired(accessToken) && refreshToken) {
      const newTokens = await refreshAccessToken(refreshToken)
      if (newTokens) {
        headers["Authorization"] = `Bearer ${newTokens.tokens.accessToken}`
      }
    } else {
      headers["Authorization"] = `Bearer ${accessToken}`
    }
  }

  // Add content type if not multipart form data
  if (!options.body || !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json"
  }

  const config: RequestInit = {
    ...options,
    headers,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `API error: ${response.status}`)
  }

  // Check if response is empty
  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return await response.json()
  }

  return {} as T
}

// Auth API functions
export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await apiClient<AuthResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })

  setAuthCookies(response)
  return response
}

export async function register(name: string, email: string, username: string, password: string): Promise<AuthResponse> {
  const response = await apiClient<AuthResponse>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, username, password }),
  })

  setAuthCookies(response)
  return response
}

export async function refreshAccessToken(refreshToken: string): Promise<AuthResponse | null> {
  try {
    const response = await apiClient<AuthResponse>("/api/v1/auth/refresh-token", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    })

    setAuthCookies(response)
    return response
  } catch (error) {
    console.error("Failed to refresh token:", error)
    return null
  }
}

// Movie API functions
export async function getMovies(pageNumber = 0, pageSize = 10, sortBy = "movieId", dir = "asc") {
  return apiClient(
    `/api/v1/movie/allMoviesPageSort?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&dir=${dir}`,
  )
}

export async function getMovie(id: string) {
  return apiClient(`/api/v1/movie/${id}`)
}

export async function addMovie(movieData: FormData) {
  return apiClient("/api/v1/movie/add-movie", {
    method: "POST",
    body: movieData,
  })
}

export async function updateMovie(id: string, movieData: FormData) {
  return apiClient(`/api/v1/movie/update/${id}`, {
    method: "PUT",
    body: movieData,
  })
}

export async function deleteMovie(id: string) {
  return apiClient(`/api/v1/movie/delete/${id}`, {
    method: "DELETE",
  })
}

// File API functions
export function getFileUrl(fileName: string) {
  return `${API_BASE_URL}/file/${fileName}`
}
