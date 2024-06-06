"use client"
import React, { useEffect } from 'react'

import { Upload } from "lucide-react"
import { Button } from '@/components/ui/button'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

type Props = {
    type: number
}

const DocumentUploader = ({type}: Props) => {

  return (
    <div>
        <Dialog>
            <DialogTrigger asChild>
                <Button className='w-fit h-fit' >
                <Upload className="h-5 w-5"/>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Upload file</DialogTitle>
                <DialogDescription>
                    Upload files to the document center
                </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                <Button type="submit">Upload</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default DocumentUploader