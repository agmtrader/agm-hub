'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card } from '@/components/ui/card'
import { Application } from '@/lib/entities/application'
import { getDefaultRegulatoryInformation, getDefaultW8Ben } from '@/utils/form'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

interface AccountTypeStepProps {
  form: UseFormReturn<Application>
}

const AccountTypeStep = ({ form }: AccountTypeStepProps) => {
  const { t } = useTranslationProvider();
  const handleAccountTypeChange = (value: string) => {
    const defaultRegulatoryInformation = getDefaultRegulatoryInformation()
    const defaultW8Ben = getDefaultW8Ben()
    
    // Build the customer object based on the account type
    const accountType = value as 'INDIVIDUAL' | 'JOINT' | 'ORG'
    
    // Get current customer values to preserve basic info
    const currentCustomer = form.getValues('customer')
    
    // Create a clean customer object with only the basic properties
    const cleanCustomer: any = {
      type: accountType,
      externalId: currentCustomer?.externalId,
      prefix: currentCustomer?.prefix,
      email: currentCustomer?.email,
      mdStatusNonPro: currentCustomer?.mdStatusNonPro ?? true,
      meetAmlStandard: currentCustomer?.meetAmlStandard ?? 'true',
      directTradingAccess: currentCustomer?.directTradingAccess ?? true,
      legalResidenceCountry: currentCustomer?.legalResidenceCountry,
    }
    
    // Add the appropriate nested structure based on account type
    if (accountType === 'INDIVIDUAL') {
      cleanCustomer.accountHolder = {
        accountHolderDetails: [{
          w8Ben: { ...defaultW8Ben }
        }],
        regulatoryInformation: defaultRegulatoryInformation
      }
    } else if (accountType === 'JOINT') {
      cleanCustomer.jointHolders = {
        firstHolderDetails: [{
          w8Ben: { ...defaultW8Ben }
        }],
        secondHolderDetails: [{
          w8Ben: { ...defaultW8Ben }
        }],
        regulatoryInformation: defaultRegulatoryInformation
      }
    } else if (accountType === 'ORG') {
      cleanCustomer.organization = {
        associatedEntities: {
          associatedIndividuals: [{
            w8Ben: { ...defaultW8Ben }
          }]
        },
        regulatoryInformation: defaultRegulatoryInformation
      }
    }
    
    // Reset the customer object completely
    form.setValue('customer', cleanCustomer)
    
    // Clear documents array - W8 forms will be generated when names are provided
    form.setValue('documents', [])
  }

  return (
    <div className="space-y-6">

      <FormField
        control={form.control}
        name="customer.type"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormControl>
              <RadioGroup
                onValueChange={(val) => { field.onChange(val); handleAccountTypeChange(val); }}
                value={field.value}
                className="grid gap-4"
              >
                <Card className="p-6 hover:border-primary transition-colors">
                  <FormItem className="flex flex-row items-center justify-start gap-10">
                      <FormControl>
                        <RadioGroupItem value="INDIVIDUAL" />
                      </FormControl>
                      <div> 
                        <FormLabel className="text-lg font-medium text-foreground cursor-pointer">
                          {t('apply.account.account_type.individual')}
                        </FormLabel>
                        <p className="text-sm text-subtitle">
                          {t('apply.account.account_type.individual_description')}
                        </p>
                      </div>
                  </FormItem>
                </Card>

                <Card className="p-6 hover:border-primary transition-colors">
                  <FormItem className="flex flex-row items-center justify-start gap-10">
                      <FormControl>
                        <RadioGroupItem value="JOINT" />
                      </FormControl>
                      <div> 
                        <FormLabel className="text-lg font-medium text-foreground cursor-pointer">
                          {t('apply.account.account_type.joint')}
                        </FormLabel>
                        <p className="text-sm text-subtitle">
                          {t('apply.account.account_type.joint_description')}
                        </p>
                      </div>
                  </FormItem>
                </Card>



                <Card className="p-6">
                  <FormItem className="flex flex-row items-center justify-start gap-10">
                    <FormControl>
                      <RadioGroupItem value="ORG" />
                    </FormControl>
                    <div> 
                      <FormLabel className="text-lg font-medium text-foreground cursor-pointer">
                        {t('apply.account.account_type.institutional')}
                      </FormLabel>
                      <p className="text-sm text-subtitle">
                        {t('apply.account.account_type.institutional_description')}
                      </p>
                    </div>
                  </FormItem>
                </Card>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export default AccountTypeStep 