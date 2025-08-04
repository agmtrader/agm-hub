'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import type { InternalDocument } from '@/lib/entities/account'

interface DocumentViewerProps {
  /**
   * Whether the dialog is open
   */
  isOpen: boolean
  /**
   * Callback fired when the open state changes
   */
  onOpenChange: (open: boolean) => void
  /**
   * The document record fetched from the database. If `null` nothing is rendered.
   */
  document: InternalDocument | null
  /**
   * Human-readable name for the document shown in the dialog header
   */
  documentName: string
}

/**
 * A viewer component for account documents stored in the database. Supports inline
 * rendering for images and PDFs (via `iframe`). Other MIME types provide a button
 * to open the file in a new tab.
 */
const DocumentViewer = ({ isOpen, onOpenChange, document, documentName }: DocumentViewerProps) => {
  // Guard – nothing to render if no document or the record doesn't have binary data
  if (!document || !document.data) return null

  const mimeType = document.mime_type
  const data = document.data
  const fileName = document.file_name || 'document'

  // Build data URL from base-64 string
  const dataUrl = `data:${mimeType};base64,${data}`

  /*
   * For large PDF files some browsers (Safari, Firefox) have trouble rendering
   * them with very long data URLs. Creating a Blob URL is much more reliable
   * and avoids the inherent length limit. We only create the object URL for
   * PDFs – images are typically smaller and work fine as data URLs.
   */
  const [blobUrl, setBlobUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!document) {
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

        // Clean up the URL when the component unmounts or the document changes
        return () => URL.revokeObjectURL(url)
      } catch {
        // Fall back to the data URL if anything goes wrong
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
    }

    if (mimeType === 'application/pdf') {
      return (
        <iframe
          src={blobUrl || dataUrl}
          className="w-full h-[70vh] border-0"
          title={documentName}
        />
      )
    }

    // Fallback for unsupported formats
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <p className="text-muted-foreground mb-4">
          Preview not available for this file type ({mimeType})
        </p>
        <p className="text-sm text-subtitle mb-4">File: {fileName}</p>
        <div className="flex gap-2">
          <Button onClick={handleOpenInNewTab} variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in New Tab
          </Button>
        </div>
      </div>
    )
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
        <div className="mt-4 overflow-auto">{renderDocument()}</div>
      </DialogContent>
    </Dialog>
  )
}

export default DocumentViewer
