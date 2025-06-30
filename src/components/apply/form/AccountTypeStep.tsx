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

interface AccountTypeStepProps {
  form: UseFormReturn<Application>
}

const AccountTypeStep = ({ form }: AccountTypeStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Select Account Type</h2>
        <p className="text-subtitle">Choose the type of account you would like to open</p>
      </div>

      <FormField
        control={form.control}
        name="customer.type"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="grid gap-4"
              >
                <Card className="p-6 hover:border-primary transition-colors">
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="INDIVIDUAL" />
                    </FormControl>
                    <div className="space-y-1 flex-1">
                      <FormLabel className="text-lg font-medium text-foreground cursor-pointer">
                        Individual Account
                      </FormLabel>
                      <p className="text-sm text-subtitle">
                        An account owned and controlled by a single person
                      </p>
                    </div>
                  </FormItem>
                </Card>

                {/* Disabled options for future implementation */}
                <Card className="p-6 opacity-50 cursor-not-allowed">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground"></div>
                    <div className="space-y-1 flex-1">
                      <div className="text-lg font-medium text-muted-foreground">
                        Joint Account
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Coming soon - An account owned by two or more people
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 opacity-50 cursor-not-allowed">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground"></div>
                    <div className="space-y-1 flex-1">
                      <div className="text-lg font-medium text-muted-foreground">
                        Trust Account
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Coming soon - An account managed by a trustee
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 opacity-50 cursor-not-allowed">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground"></div>
                    <div className="space-y-1 flex-1">
                      <div className="text-lg font-medium text-muted-foreground">
                        Organization Account
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Coming soon - An account for businesses and organizations
                      </p>
                    </div>
                  </div>
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