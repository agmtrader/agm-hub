'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Download, ExternalLink } from 'lucide-react'

interface DocumentViewerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  document: {
    attachedFile?: {
      fileName: string
      fileLength: number
    }
    payload?: {
      mimeType: string
      data: string
    }
    formNumber: number
  } | null
  documentName: string
}

const DocumentViewer = ({ isOpen, onOpenChange, document, documentName }: DocumentViewerProps) => {
  if (!document || !document.payload) return null

  const { mimeType, data } = document.payload
  const fileName = document.attachedFile?.fileName || 'document'

  // Create data URL from base64
  const dataUrl = `data:${mimeType};base64,${data}`

  /*
   * For large PDF files some browsers (Safari, Firefox) have trouble rendering
   * them through a long data URL.  Creating a Blob URL is far more reliable
   * and avoids any inherent length limitations.  We only create the object
   * URL for PDFs – images are typically smaller and work fine as data URLs.
   */
  const [blobUrl, setBlobUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!document?.payload) {
      setBlobUrl(null)
      return
    }

    if (mimeType === 'application/pdf') {
      try {
        // Decode base-64 into binary data and build a Blob
        const byteCharacters = atob(data)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: mimeType })
        const url = URL.createObjectURL(blob)
        setBlobUrl(url)

        // Clean up the URL on unmount / change
        return () => URL.revokeObjectURL(url)
      } catch {
        // Fallback to data URL if anything goes wrong
        setBlobUrl(null)
      }
    } else {
      setBlobUrl(null)
    }
  }, [document, mimeType, data])

  const handleOpenInNewTab = () => {
    window.open(blobUrl || dataUrl, '_blank')
  }

  const renderDocument = () => {
    if (mimeType.startsWith('image/')) {
      return (
        <img 
          src={dataUrl} 
          alt={documentName}
          className="max-w-full max-h-[70vh] object-contain mx-auto"
        />
      )
    } else if (mimeType === 'application/pdf') {
      return (
        <iframe
          src={blobUrl || dataUrl}
          className="w-full h-[70vh] border-0"
          title={documentName}
        />
      )
    } else {
      return (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center">
          <p className="text-muted-foreground mb-4">
            Preview not available for this file type ({mimeType})
          </p>
          <p className="text-sm text-subtitle mb-4">
            File: {fileName}
          </p>
          <div className="flex gap-2">
            <Button onClick={handleOpenInNewTab} variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
          </div>
        </div>
      )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{documentName}</span>
            <div className="flex gap-2">
              <Button onClick={handleOpenInNewTab} variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 overflow-auto">
          {renderDocument()}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DocumentViewer 