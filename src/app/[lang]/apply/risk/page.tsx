import RiskForm from '@/components/apply/risk/RiskForm'
import { FormHeader } from '@/components/Header'
import { ScrollArea } from '@/components/ui/scroll-area'
import React from 'react'

const page = () => {
  return (
    <div className='w-full flex flex-col h-full'>
      <FormHeader />
      <div className="w-full max-w-4xl gap-y-20 flex flex-col mx-auto px-4 py-6">
        <div>
          <h2 className="text-5xl font-semibold text-center mb-4">Risk Assessment Questionnaire</h2>
          <p className="text-center text-muted-foreground">
            Please complete this form to help us understand your risk tolerance and investment preferences.
          </p>
        </div>
        <RiskForm/>
      </div>
    </div>
  )
}

export default page