"use client"

import { useEffect, useState, use } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ImageEditor from "@/components/image-editor"
import { getImageById, updateImage } from "@/utils/local-storage-utils"
import type { StoredImage } from "@/types/image"

export default function EditorPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [image, setImage] = useState<StoredImage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadImage = () => {
      try {
        const foundImage = getImageById(id)
        if (foundImage) {
          setImage(foundImage)
        } else {
          setError("Image not found")
        }
      } catch (e) {
        setError("Failed to load image")
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }

    loadImage()
  }, [id])

  const handleSave = async (editedImage: StoredImage) => {
    try {
      await updateImage(editedImage)
      router.push("/gallery")
    } catch (e) {
      console.error("falha ao salvar imagem editada:", e)
    }
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Carregando...</div>
  }

  if (error || !image) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/gallery">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Gallery
            </Button>
          </Link>
        </div>
        <div className="p-4 bg-red-50 text-red-700 rounded-md">{error || "imagem não encontrada"}</div>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/gallery">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar à galeria
          </Button>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Editar imagem</h1>
        <ImageEditor image={image} onSave={handleSave} />
      </div>
    </main>
  )
}
