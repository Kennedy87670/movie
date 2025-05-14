import Link from "next/link"
import { Film } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getMovies } from "@/lib/api"
import { MovieGrid } from "@/components/movies/movie-grid"

export default async function HomePage() {
  let featuredMovies = null

  try {
    // Get the latest movies for the featured section
    featuredMovies = await getMovies(0, 4, "releaseYear", "desc")
  } catch (error) {
    console.error("Failed to fetch featured movies:", error)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Welcome to MovieFlix
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Your ultimate movie catalog for discovering and managing your favorite films.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/movies">Browse Movies</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Featured Movies</h2>
          <Button asChild variant="ghost">
            <Link href="/movies">View all</Link>
          </Button>
        </div>

        {featuredMovies ? (
          <MovieGrid initialMovies={featuredMovies} />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Film className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No movies available</h3>
            <p className="text-muted-foreground">Check back later for our featured selection</p>
          </div>
        )}
      </section>

      <section className="container py-12 space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Why Choose MovieFlix?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="p-6 bg-muted rounded-lg">
            <h3 className="text-lg font-medium mb-2">Extensive Catalog</h3>
            <p className="text-muted-foreground">
              Access thousands of movies from various genres, directors, and studios.
            </p>
          </div>
          <div className="p-6 bg-muted rounded-lg">
            <h3 className="text-lg font-medium mb-2">Personalized Experience</h3>
            <p className="text-muted-foreground">
              Create your own watchlist and get recommendations based on your preferences.
            </p>
          </div>
          <div className="p-6 bg-muted rounded-lg">
            <h3 className="text-lg font-medium mb-2">Advanced Search</h3>
            <p className="text-muted-foreground">
              Find movies by title, director, cast, studio, or release year with our powerful search.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
