const ROTATABLE_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
])

export const isPdfFile = (file: File) => file.type === 'application/pdf'

export const isPreviewableImage = (file: File) => file.type.startsWith('image/')

export const canRotateDocument = (file: File) =>
  isPdfFile(file) || ROTATABLE_IMAGE_TYPES.has(file.type)

const rotateImageClockwise = async (file: File): Promise<File> => {
  const sourceUrl = URL.createObjectURL(file)

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image()
      element.onload = () => resolve(element)
      element.onerror = () => reject(new Error('The image could not be opened.'))
      element.src = sourceUrl
    })

    const canvas = window.document.createElement('canvas')
    canvas.width = image.naturalHeight
    canvas.height = image.naturalWidth

    const context = canvas.getContext('2d')
    if (!context) throw new Error('Image editing is not supported in this browser.')

    context.translate(canvas.width, 0)
    context.rotate(Math.PI / 2)
    context.drawImage(image, 0, 0)

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => result ? resolve(result) : reject(new Error('The rotated image could not be saved.')),
        file.type,
        file.type === 'image/jpeg' || file.type === 'image/webp' ? 0.95 : undefined,
      )
    })

    return new File([blob], file.name, {
      type: file.type,
      lastModified: Date.now(),
    })
  } finally {
    URL.revokeObjectURL(sourceUrl)
  }
}

const rotatePdfClockwise = async (file: File): Promise<File> => {
  const { degrees, PDFDocument } = await import('pdf-lib')
  const pdf = await PDFDocument.load(await file.arrayBuffer())

  for (const page of pdf.getPages()) {
    const currentAngle = page.getRotation().angle
    page.setRotation(degrees((currentAngle + 90) % 360))
  }

  const editedBytes = await pdf.save()
  const editedBuffer = new ArrayBuffer(editedBytes.byteLength)
  new Uint8Array(editedBuffer).set(editedBytes)

  return new File([editedBuffer], file.name, {
    type: 'application/pdf',
    lastModified: Date.now(),
  })
}

export const rotateDocumentClockwise = async (file: File): Promise<File> => {
  if (isPdfFile(file)) return rotatePdfClockwise(file)
  if (ROTATABLE_IMAGE_TYPES.has(file.type)) return rotateImageClockwise(file)
  throw new Error('Rotation is only available for PDF, JPEG, PNG, and WebP files.')
}
