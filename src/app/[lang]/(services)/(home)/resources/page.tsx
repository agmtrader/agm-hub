'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { chapters } from '@/lib/resource-center'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Image from 'next/image'
import { formatURL } from '@/utils/lang'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

const ResourceCenterPage = () => {

  const { lang } = useTranslationProvider()

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='h-full my-20 justify-start items-center gap-5 flex flex-col w-full'
    >
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-5xl font-bold'
      >
        Resource Center
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className='text-lg text-subtitle'
      >
        Check out our videos to learn about international markets and trading.
      </motion.p>
      {chapters.map((chapter) => (
        <Link href={formatURL(`/resources/${chapter.id}`, lang)}>
          <Card key={chapter.id}>
            <CardContent>
              <Image src={chapter.image || ''} alt={chapter.title} width={200} height={200} />
          </CardContent>
          <CardHeader>
           <p>{chapter.title}</p>
            </CardHeader>
          </Card>
        </Link>
        ))
      }
    </motion.div>
  )
}

export default ResourceCenterPage
