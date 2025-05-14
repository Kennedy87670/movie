"use client"

import { useState, useEffect } from "react"
import type { Movie, PaginatedResponse } from "@/types"
import { MovieCard } from "./movie-card"
import { getMovies } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

interface MovieGridProps {
  initialMovies?: PaginatedResponse<Movie>
}

export function MovieGrid({ initialMovies }: MovieGridProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies?.content || [])
  const [loading, setLoading] = useState(!initialMovies)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(initialMovies?.totalPages || 1)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("movieId")
  const [sortDir, setSortDir] = useState("asc")

  const fetchMoviesData = async () => {
    setLoading(true)
    try {
      const response = await getMovies(page, 12, sortBy, sortDir)
      setMovies(response.content)
      setTotalPages(response.totalPages)
    } catch (error) {
      console.error("Failed to fetch movies:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!initialMovies) {
      fetchMoviesData()
    }
  }, [page, sortBy, sortDir, initialMovies])

  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.studio.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Input
          placeholder="Search movies..."
          className="max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="releaseYear">Release Year</SelectItem>
              <SelectItem value="director">Director</SelectItem>
              <SelectItem value="studio">Studio</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortDir} onValueChange={setSortDir}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredMovies.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.movieId} movie={movie} />
            ))}
          </div>

          <div className="flex justify-center gap-2 pt-4">
            <Button variant="outline" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
              Previous
            </Button>
            <Button variant="outline" onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages - 1}>
              Next
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No movies found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
