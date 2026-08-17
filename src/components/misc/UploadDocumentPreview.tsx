'use client'

import React, { useEffect, useRef, useState } from 'react'
import { FileText, Loader2, Maximize2, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import {
  canRotateDocument,
  isPdfFile,
  isPreviewableImage,
  rotateDocumentClockwise,
} from '@/utils/clients/document-file'

type UploadDocumentPreviewProps = {
  file: File
  onFileChange: (file: File) => void
  onBusyChange?: (busy: boolean) => void
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const shortenFileName = (fileName: string, maxLength = 42) => {
  if (fileName.length <= maxLength) return fileName

  const extensionStart = fileName.lastIndexOf('.')
  const hasExtension = extensionStart > 0 && extensionStart < fileName.length - 1
  const extension = hasExtension ? fileName.slice(extensionStart) : ''
  const baseName = hasExtension ? fileName.slice(0, extensionStart) : fileName
  const visibleBaseLength = Math.max(1, maxLength - extension.length - 3)

  return `${baseName.slice(0, visibleBaseLength)}...${extension}`
}

const UploadDocumentPreview = ({ file, onFileChange, onBusyChange }: UploadDocumentPreviewProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const [objectUrl, setObjectUrl] = useState('')
  const isMounted = useRef(true)

  const isPdf = isPdfFile(file)
  const isImage = isPreviewableImage(file)
  const isPreviewable = isPdf || isImage
  const isRotatable = canRotateDocument(file)

  useEffect(() => {
    const url = URL.createObjectURL(file)
    setObjectUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
      onBusyChange?.(false)
    }
  }, [onBusyChange])

  const handleRotate = async () => {
    if (!isRotatable || isRotating) return

    try {
      setIsRotating(true)
      onBusyChange?.(true)
      const rotatedFile = await rotateDocumentClockwise(file)
      if (!isMounted.current) return
      onFileChange(rotatedFile)
    } catch (error) {
      toast({
        title: 'Unable to rotate document',
        description: error instanceof Error ? error.message : 'The document could not be edited.',
        variant: 'destructive',
      })
    } finally {
      if (isMounted.current) {
        setIsRotating(false)
        onBusyChange?.(false)
      }
    }
  }

  const renderPreview = (fullSize: boolean) => {
    if (!objectUrl) {
      return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    }

    if (isImage) {
      return (
        <img
          src={objectUrl}
          alt={`Preview of ${file.name}`}
          className={fullSize ? 'max-h-[68vh] max-w-full object-contain' : 'h-full w-full bg-white object-contain'}
        />
      )
    }

    if (isPdf) {
      return (
        <iframe
          src={`${objectUrl}#page=1&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
          title={`Preview of ${file.name}`}
          className={fullSize ? 'h-[68vh] w-full border-0 bg-white' : 'pointer-events-none h-[360px] w-[250px] origin-top-left scale-[0.42] border-0 bg-white'}
        />
      )
    }

    return (
      <div className="flex flex-col items-center justify-center gap-2 text-center text-muted-foreground">
        <FileText className={fullSize ? 'h-16 w-16' : 'h-8 w-8'} />
        {fullSize && <p>A browser preview is not available for this file type.</p>}
      </div>
    )
  }

  return (
    <>
      <div className="flex w-full min-w-0 max-w-full items-center gap-3 overflow-hidden pr-7">
        <div className="group relative flex h-24 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted/40 shadow-sm">
          <div className="flex h-full w-full items-center justify-center overflow-hidden">
            {renderPreview(false)}
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              setIsOpen(true)
            }}
            className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors hover:bg-black/35 focus:bg-black/35 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring"
            aria-label={`Open preview of ${file.name}`}
          >
            <Maximize2 className="h-5 w-5 text-white opacity-0 drop-shadow transition-opacity group-hover:opacity-100 group-focus-within:opacity-100" />
          </button>
        </div>
        <div className="min-w-0 flex-1 overflow-hidden text-left">
          <p className="truncate text-sm font-medium" title={file.name}>{shortenFileName(file.name)}</p>
          <p className="mt-1 truncate text-xs font-normal text-muted-foreground">
            {formatFileSize(file.size)} · {isPreviewable ? 'Click the preview to inspect or rotate' : 'Preview unavailable'}
          </p>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[92vh] max-w-5xl overflow-hidden">
          <DialogHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
            <div className="min-w-0">
              <DialogTitle className="truncate pr-8" title={file.name}>{shortenFileName(file.name, 64)}</DialogTitle>
              <DialogDescription className="mt-1 text-muted-foreground">
                Review the document before uploading it. Rotation updates the file that will be uploaded.
              </DialogDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRotate}
              disabled={!isRotatable || isRotating}
              className="shrink-0 gap-2"
              title={isRotatable ? 'Rotate every page 90° clockwise' : 'This file type cannot be rotated'}
            >
              {isRotating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCw className="h-4 w-4" />}
              {isRotating ? 'Rotating…' : 'Rotate 90°'}
            </Button>
          </DialogHeader>
          <div className="flex min-h-64 items-center justify-center overflow-auto rounded-lg border bg-muted/30 p-2">
            {renderPreview(true)}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default UploadDocumentPreview
