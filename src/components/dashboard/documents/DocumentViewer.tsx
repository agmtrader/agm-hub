import React from 'react'

type Props = {
  fileId: string
}

const DocumentViewer = ({fileId}: Props) => {
  const viewerUrl = `https://drive.google.com/file/d/${fileId}/preview`
  
  return (
    <div className="w-full h-full min-h-[60vh]">
      <iframe 
        src={viewerUrl}
        width="100%" 
        height="100%" 
        style={{ border: 'none' }}
        allow="autoplay"
      />
    </div>
  )
}

export default DocumentViewer