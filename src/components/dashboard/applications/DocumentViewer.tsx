'use client'

import React from 'react'
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

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = fileName
    link.click()
  }

  const handleOpenInNewTab = () => {
    window.open(dataUrl, '_blank')
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
          src={dataUrl}
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
            <Button onClick={handleDownload} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
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
              <Button onClick={handleDownload} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
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