import { notFound } from "next/navigation"
import { getMovie } from "@/lib/api"
import { MovieForm } from "@/components/admin/movie-form"

interface EditMoviePageProps {
  params: {
    id: string
  }
}

export default async function EditMoviePage({ params }: EditMoviePageProps) {
  try {
    const movie = await getMovie(params.id)

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Edit Movie</h1>
        <MovieForm movie={movie} isEdit />
      </div>
    )
  } catch (error) {
    console.error("Failed to fetch movie:", error)
    notFound()
  }
}
