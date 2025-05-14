"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import type { Movie, PaginatedResponse } from "@/types"
import { getMovies, deleteMovie } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { useRouter } from "next/navigation"

interface MovieTableProps {
  initialMovies: PaginatedResponse<Movie>
}

export function MovieTable({ initialMovies }: MovieTableProps) {
  const router = useRouter()
  const [movies, setMovies] = useState<Movie[]>(initialMovies.content)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(initialMovies.totalPages)
  const [sortBy, setSortBy] = useState("title")
  const [sortDir, setSortDir] = useState("asc")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null)

  const fetchMovies = async () => {
    try {
      const response = await getMovies(page, 10, sortBy, sortDir)
      setMovies(response.content)
      setTotalPages(response.totalPages)
    } catch (error) {
      console.error("Failed to fetch movies:", error)
    }
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortDir("asc")
    }
  }

  const handleDeleteClick = (movie: Movie) => {
    setMovieToDelete(movie)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!movieToDelete) return

    try {
      await deleteMovie(movieToDelete.movieId.toString())
      setMovies(movies.filter((m) => m.movieId !== movieToDelete.movieId))
      router.refresh()
    } catch (error) {
      console.error("Failed to delete movie:", error)
    } finally {
      setDeleteDialogOpen(false)
      setMovieToDelete(null)
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Poster</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("title")}>
                Title {sortBy === "title" && (sortDir === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("director")}>
                Director {sortBy === "director" && (sortDir === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("studio")}>
                Studio {sortBy === "studio" && (sortDir === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("releaseYear")}>
                Year {sortBy === "releaseYear" && (sortDir === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movies.map((movie) => (
              <TableRow key={movie.movieId}>
                <TableCell>
                  <div className="relative h-12 w-8 overflow-hidden rounded">
                    <Image
                      src={movie.posterUrl || "/placeholder.svg?height=48&width=32"}
                      alt={movie.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{movie.title}</TableCell>
                <TableCell>{movie.director}</TableCell>
                <TableCell>{movie.studio}</TableCell>
                <TableCell>{movie.releaseYear}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/movies/${movie.movieId}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClick(movie)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Showing {movies.length} of {initialMovies.totalElements} movies
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPage(Math.max(0, page - 1))
              fetchMovies()
            }}
            disabled={page === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPage(page + 1)
              fetchMovies()
            }}
            disabled={page >= totalPages - 1}
          >
            Next
          </Button>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the movie &quot;{movieToDelete?.title}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
