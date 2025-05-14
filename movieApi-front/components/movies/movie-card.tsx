import Image from "next/image"
import Link from "next/link"
import type { Movie } from "@/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { getFileUrl } from "@/lib/api"

interface MovieCardProps {
  movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/movies/${movie.movieId}`}>
        <div className="aspect-[2/3] relative overflow-hidden">
          <Image
            src={movie.posterUrl || getFileUrl(movie.poster) || "/placeholder.svg?height=450&width=300"}
            alt={movie.title}
            fill
            className="object-cover transition-transform hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-1">{movie.title}</h3>
          <p className="text-sm text-muted-foreground">{movie.releaseYear}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between text-xs text-muted-foreground">
          <span>{movie.director}</span>
          <span>{movie.studio}</span>
        </CardFooter>
      </Link>
    </Card>
  )
}
