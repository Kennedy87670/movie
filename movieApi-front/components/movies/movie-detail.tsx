"use client"

import Image from "next/image"
import type { Movie } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/components/auth/auth-context"
import Link from "next/link"

interface MovieDetailProps {
  movie: Movie
}

export function MovieDetail({ movie }: MovieDetailProps) {
  const { isAdmin } = useAuth()

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
          <Image
            src={movie.posterUrl || "/placeholder.svg?height=450&width=300"}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 300px"
            priority
          />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">{movie.title}</h1>
              {isAdmin && (
                <Button asChild variant="outline">
                  <Link href={`/admin/movies/${movie.movieId}/edit`}>Edit Movie</Link>
                </Button>
              )}
            </div>
            <p className="text-xl text-muted-foreground">{movie.releaseYear}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Director</h3>
                <p>{movie.director}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Studio</h3>
                <p>{movie.studio}</p>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Cast</h3>
            <div className="flex flex-wrap gap-2">
              {movie.movieCast.map((actor, index) => (
                <Badge key={index} variant="secondary">
                  {actor}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">
              {/* Placeholder for movie description - not in the API */}A captivating film directed by {movie.director}{" "}
              and produced by {movie.studio}. Released in {movie.releaseYear}, this movie features an ensemble cast
              including {movie.movieCast.join(", ")}.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
