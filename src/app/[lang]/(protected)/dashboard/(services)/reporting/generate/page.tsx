'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ReloadIcon } from "@radix-ui/react-icons"
import { accessAPI } from '@/utils/api'
import { CheckCircle2, ChevronDownIcon, ChevronUpIcon, XCircle } from 'lucide-react'
import { DataTable } from '@/components/misc/DataTable'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

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

export default function ReportingDashboard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [stepStatus, setStepStatus] = useState('pending')
  const [batchFiles, setBatchFiles] = useState<any[] | null>(null)
  const [resourcesFiles, setResourcesFiles] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('extract')

  const [showDetails, setShowDetails] = useState(false)

  const { toast } = useToast()

  const handleError = (message: string) => {
    setError(message)
    setStepStatus('error')
    toast({
      title: 'Error',
      description: message,
      variant: 'destructive',
    })
  }

  async function generateReports() {
    setStepStatus('loading')
    setError(null)
    try {
      const response = await accessAPI('/reporting/extract', 'GET')
      if (response['status'] === 'error' || !response['content']) {
        throw new Error(response['message'] || 'Failed to fetch reports')
      }
      setBatchFiles(response['content'])
      setStepStatus('complete')
      setCurrentStep(2)
      setStepStatus('pending')
    } catch (err: any) {
      handleError(err.message || 'An error occurred while fetching reports')
    }
  }

  async function transformReports() {
    setStepStatus('loading')
    setError(null)
    try {
      const response = await accessAPI('/reporting/transform', 'GET')
      if (response['status'] === 'error' || !response['content']) {
        throw new Error(response['message'] || 'Failed to transform reports')
      }
      setResourcesFiles(response['content'])
      setStepStatus('complete')
      setCurrentStep(3)
      setStepStatus('pending')
    } catch (err: any) {
      handleError(err.message || 'An error occurred while transforming reports')
    }
  }

  async function loadReports() {
    setStepStatus('loading')
    setError(null)
    try {
      const response = await accessAPI('/reporting/load', 'GET')
      if (response['status'] === 'error' || !response['content']) {
        throw new Error(response['message'] || 'Failed to load reports')
      }
      console.log(response['content'])
      setStepStatus('complete')
    } catch (err: any) {
      handleError(err.message || 'An error occurred while loading reports')
    }
  }

  const handleStepClick = (step: number) => {
    if ((step === currentStep && stepStatus === 'pending') || stepStatus === 'error') {
      switch (step) {
        case 1:
          generateReports()
          break
        case 2:
          transformReports()
          setActiveTab('transform')
          break
        case 3:
          loadReports()
          setActiveTab('load')
          break
      }
    }
  }

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
          <PipelineStep name='Extract' step={1} currentStep={currentStep} status={stepStatus} onClick={() => handleStepClick(1)} disabled={currentStep !== 1} />
          <PipelineStep name='Transform' step={2} currentStep={currentStep} status={stepStatus} onClick={() => handleStepClick(2)} disabled={currentStep !== 2} />
        </motion.div>
      </motion.div>


      {!showDetails ? 
        <motion.div variants={fadeIn} className='w-full max-w-6xl gap-2 flex justify-center items-center'>
          <p className='text-xs text-subtitle'>Show more details</p>
          <Button variant='ghost' size='icon' onClick={() => setShowDetails(!showDetails)}>
            <ChevronDownIcon className='w-4 h-4' />
          </Button>
        </motion.div>
        :
        <motion.div variants={fadeIn} className='w-full max-w-6xl gap-2 flex justify-center items-center'>
          <p className='text-xs text-subtitle'>Show less details</p>
          <Button variant='ghost' size='icon' onClick={() => setShowDetails(!showDetails)}>
            <ChevronUpIcon className='w-4 h-4' />
          </Button>
        </motion.div>
      }

      {showDetails &&
        <motion.div variants={fadeIn} className='w-full max-w-6xl'>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="extract">Extract</TabsTrigger>
            <TabsTrigger value="transform">Transform</TabsTrigger>
          </TabsList>
          <TabsContent value="extract">
            {batchFiles && (
              <motion.div variants={slideUp} className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Extracted Reports</h2>
                <DataTable data={batchFiles} />
              </motion.div>
            )}
          </TabsContent>
          <TabsContent value="transform">
            {resourcesFiles && (
              <motion.div variants={slideUp} className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Transformed Reports</h2>
                <DataTable data={resourcesFiles} />
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
        </motion.div>
      }

    </motion.div>
  )
}
