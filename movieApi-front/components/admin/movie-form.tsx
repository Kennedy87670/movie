"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import type { Movie, MovieFormData } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { addMovie, updateMovie } from "@/lib/api"
import { AlertCircle, Loader2, Upload } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface MovieFormProps {
  movie?: Movie
  isEdit?: boolean
}

export function MovieForm({ movie, isEdit = false }: MovieFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [posterFile, setPosterFile] = useState<File | null>(null)
  const [posterPreview, setPosterPreview] = useState<string | null>(movie?.posterUrl || null)
  const [formData, setFormData] = useState<MovieFormData>({
    title: movie?.title || "",
    director: movie?.director || "",
    studio: movie?.studio || "",
    movieCast: movie?.movieCast || [""],
    releaseYear: movie?.releaseYear || new Date().getFullYear(),
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCastChange = (index: number, value: string) => {
    const newCast = [...formData.movieCast]
    newCast[index] = value
    setFormData((prev) => ({ ...prev, movieCast: newCast }))
  }

  const addCastMember = () => {
    setFormData((prev) => ({
      ...prev,
      movieCast: [...prev.movieCast, ""],
    }))
  }

  const removeCastMember = (index: number) => {
    if (formData.movieCast.length > 1) {
      const newCast = [...formData.movieCast]
      newCast.splice(index, 1)
      setFormData((prev) => ({ ...prev, movieCast: newCast }))
    }
  }

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setPosterFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setPosterPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validate form
      if (!formData.title || !formData.director || !formData.studio || formData.movieCast.some((cast) => !cast)) {
        throw new Error("Please fill in all required fields")
      }

      // Create FormData object for API
      const apiFormData = new FormData()

      if (posterFile) {
        apiFormData.append("file", posterFile)
      }

      // For add movie
      if (!isEdit) {
        apiFormData.append("movieDto", JSON.stringify(formData))
        await addMovie(apiFormData)
      }
      // For edit movie
      else if (movie) {
        apiFormData.append("movieDtoObj", JSON.stringify(formData))
        await updateMovie(movie.movieId.toString(), apiFormData)
      }

      router.push("/admin/movies")
      router.refresh()
    } catch (err) {
      console.error("Failed to save movie:", err)
      setError(err instanceof Error ? err.message : "Failed to save movie")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Movie Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="director">Director</Label>
              <Input id="director" name="director" value={formData.director} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studio">Studio</Label>
              <Input id="studio" name="studio" value={formData.studio} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="releaseYear">Release Year</Label>
            <Input
              id="releaseYear"
              name="releaseYear"
              type="number"
              min="1900"
              max={new Date().getFullYear() + 5}
              value={formData.releaseYear}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Cast</Label>
              <Button type="button" variant="outline" size="sm" onClick={addCastMember}>
                Add Cast Member
              </Button>
            </div>
            <div className="space-y-2">
              {formData.movieCast.map((cast, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={cast}
                    onChange={(e) => handleCastChange(index, e.target.value)}
                    placeholder="Actor name"
                    required
                  />
                  {formData.movieCast.length > 1 && (
                    <Button type="button" variant="outline" size="icon" onClick={() => removeCastMember(index)}>
                      &times;
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="poster">Movie Poster</Label>
              <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-4 h-64">
                {posterPreview ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={posterPreview || "/placeholder.svg"}
                      alt="Poster preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Upload className="h-8 w-8 mb-2" />
                    <p className="text-sm">Upload poster image</p>
                  </div>
                )}
              </div>
              <Input id="poster" type="file" accept="image/*" onChange={handlePosterChange} className="mt-2" />
              <p className="text-xs text-muted-foreground">Recommended size: 300x450 pixels</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Update Movie" : "Add Movie"}
        </Button>
      </div>
    </form>
  )
}
