import { notFound } from "next/navigation"
import { getMovie } from "@/lib/api"
import { MovieDetail } from "@/components/movies/movie-detail"

interface MoviePageProps {
  params: {
    id: string
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  try {
    const movie = await getMovie(params.id)
    return <MovieDetail movie={movie} />
  } catch (error) {
    console.error("Failed to fetch movie:", error)
    notFound()
  }
}
