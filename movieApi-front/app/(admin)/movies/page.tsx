import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getMovies } from "@/lib/api"
import { MovieTable } from "@/components/admin/movie-table"
import { Plus } from "lucide-react"

export default async function AdminMoviesPage() {
  let initialMovies

  try {
    initialMovies = await getMovies(0, 10, "title", "asc")
  } catch (error) {
    console.error("Failed to fetch movies:", error)
    initialMovies = { content: [], totalPages: 0, totalElements: 0 }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Movies</h1>
        <Button asChild>
          <Link href="/admin/movies/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Movie
          </Link>
        </Button>
      </div>

      <MovieTable initialMovies={initialMovies} />
    </div>
  )
}
