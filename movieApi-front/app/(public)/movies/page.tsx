import { getMovies } from "@/lib/api"
import { MovieGrid } from "@/components/movies/movie-grid"

export default async function MoviesPage() {
  let initialMovies

  try {
    initialMovies = await getMovies(0, 12, "title", "asc")
  } catch (error) {
    console.error("Failed to fetch movies:", error)
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Movie Catalog</h1>
      <MovieGrid initialMovies={initialMovies} />
    </div>
  )
}
