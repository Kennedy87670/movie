// Movie types
export interface Movie {
  movieId: number
  title: string
  director: string
  studio: string
  movieCast: string[]
  releaseYear: number
  poster: string
  posterUrl: string
}

export interface MovieFormData {
  title: string
  director: string
  studio: string
  movieCast: string[]
  releaseYear: number
}

export interface PaginatedResponse<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      sorted: boolean
      unsorted: boolean
      empty: boolean
    }
    offset: number
    paged: boolean
    unpaged: boolean
  }
  last: boolean
  totalElements: number
  totalPages: number
  size: number
  number: number
  sort: {
    sorted: boolean
    unsorted: boolean
    empty: boolean
  }
  first: boolean
  numberOfElements: number
  empty: boolean
}
