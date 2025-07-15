'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ReloadIcon } from "@radix-ui/react-icons"
import { accessAPI } from '@/utils/api'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'

const PipelineStep = ({ name, step, currentStep, status, onClick, disabled }: { name: string, step: number, currentStep: number, status: string, onClick: () => void, disabled: boolean }) => {
  const getStepStatus = () => {
    if (step < currentStep) return 'complete'
    if (step === currentStep) return status
    return 'pending'
  }

  const stepStatus = getStepStatus()

  const isDisabled = disabled && status !== 'error'

  return (
    <div className='flex flex-col items-center justify-center gap-5'>
      <motion.div
        className={`flex items-center justify-center w-32 h-32 rounded-full border-4 ${
          stepStatus === 'complete' ? 'border-success bg-success/10' :
          stepStatus === 'error' ? 'border-error bg-error/10' :
          stepStatus === 'loading' ? 'border-primary bg-primary/10' :
          'border-muted bg-muted'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onClick}
          disabled={isDisabled}
          className="w-full h-full rounded-full"
        >
          {stepStatus === 'complete' && <CheckCircle2 className="w-16 h-16 text-success" />}
          {stepStatus === 'error' && <XCircle className="w-16 h-16 text-error" />}
          {stepStatus === 'loading' && <ReloadIcon className="w-16 h-16 text-primary animate-spin" />}
          {stepStatus === 'pending' && <span className="text-4xl font-bold text-subtitle">{step}</span>}

        </Button>
      </motion.div>
      <p className='text-base text-subtitle font-semibold'>{name}</p>
    </div>
  )
}

const GenerateReportsPage = () => {
    
  const [extractStatus, setExtractStatus] = useState<'pending' | 'loading' | 'complete' | 'error'>('pending')
  const [transformStatus, setTransformStatus] = useState<'pending' | 'loading' | 'complete' | 'error'>('pending')

  const { toast } = useToast()

  const handleError = (message: string, step: 'extract' | 'transform') => {
    if (step === 'extract') setExtractStatus('error')
    if (step === 'transform') setTransformStatus('error')
    toast({
      title: 'Error',
      description: message,
      variant: 'destructive',
    })
  }

  async function extract() {
    setExtractStatus('loading')
    try {
      const response = await accessAPI('/reporting/extract', 'GET')
      setExtractStatus('complete')
    } catch (err: any) {
      handleError(err.message || 'An error occurred while fetching reports', 'extract')
    }
  }

  async function transformReports() {
    setTransformStatus('loading')
    try {
      const response = await accessAPI('/reporting/transform', 'GET')
      if (response['status'] === 'error' || !response['content']) {
        throw new Error(response['message'] || 'Failed to transform reports')
      }
      setTransformStatus('complete')
    } catch (err: any) {
      handleError(err.message || 'An error occurred while transforming reports', 'transform')
    }
  }

  // Remove loadReports and currentStep logic for now, as only Extract and Transform are shown

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  }

  const springIn = {
    hidden: { scale: 0 },
    visible: { scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } }
  }

  const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { delay: 0.2 } }
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className='w-full h-fit gap-5 flex flex-col justify-center items-center'
    >

      <motion.div 
        variants={fadeIn}
        className="flex flex-col gap-10 text-foreground w-full justify-center items-center"
      >
        <motion.h1 
          variants={springIn}
          className="text-7xl font-bold text-foreground"
        >
          Generate Reports
        </motion.h1>
        <motion.p className='text-2xl text-subtitle' variants={fadeIn}>
          Generate reports for various pipelines and upload them to the cloud.
        </motion.p>
        
        <motion.div 
          variants={slideUp}
          className="flex justify-center items-center gap-20"
        >
          <PipelineStep 
            name='Extract' 
            step={1} 
            currentStep={1} // not used anymore, but required by PipelineStep signature
            status={extractStatus} 
            onClick={extract} 
            disabled={extractStatus === 'loading'} 
          />
          <PipelineStep 
            name='Transform' 
            step={2} 
            currentStep={2} // not used anymore, but required by PipelineStep signature
            status={transformStatus} 
            onClick={transformReports} 
            disabled={transformStatus === 'loading'} 
          />
        </motion.div>
      </motion.div>

    </motion.div>
  )
}

export default GenerateReportsPage