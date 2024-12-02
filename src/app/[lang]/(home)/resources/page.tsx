'use client'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import React from 'react'
import { CaretRight } from 'react-bootstrap-icons'

const ResourceCenterPage = () => {

  const videos = [
      {
          title: 'Introducción al Balance General',
          url: "https://www.youtube.com/embed/Af25tdzojb8" 
      },
      {
        title: 'Métodos Fundamentales de Negociación',
        url: "https://www.youtube.com/embed/x_RZmQzWIng" 
      }
  ]

  const [showList, setShowList] = useState(true)
  const [selected, setSelected] = useState<any | null>(videos[0])
  
  return (
    <div className='h-full my-32 justify-center items-center gap-10 flex flex-col w-full'>

      <h1 className='text-7xl font-bold'>Resource Center</h1>
      <p className='text-lg'>En esta sección encontrarás una variedad de recursos para aprender sobre negociación y gestión de negocios.</p>

      {selected && (
        <div className='w-full h-full flex items-start justify-center p-4'>
          <div className='flex flex-col gap-2 p-4'>
            {showList && (
              <div className='flex flex-col gap-5'>
                {videos.map((video) => (
                  <Button
                    key={video.url}
                    onClick={() => setSelected(video)}
                    className='text-sm p-2'
                    variant='ghost'
                  >
                    {video.title}
                  </Button>
                ))}
              </div>
            )}
            <Button
              onClick={() => setShowList(!showList)}
              className='text-sm p-2'
              variant='ghost'
            >
              <CaretRight className='w-6 h-6'/>
            </Button>
          </div>
          <iframe 
            width="100%" 
            height="100%" 
            src={selected.url} 
            title={selected.title}
            style={{ aspectRatio: '16/9' }}
          />
        </div>
      )}

    </div>
  )
}

export default ResourceCenterPage
