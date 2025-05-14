import { MovieForm } from "@/components/admin/movie-form"

export default function AddMoviePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add New Movie</h1>
      <MovieForm />
    </div>
  )
}
