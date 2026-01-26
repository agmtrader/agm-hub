import { Application } from '@/lib/entities/application';
import React from 'react'
import { UseFormReturn } from 'react-hook-form';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { Check } from 'lucide-react';
import { FormStep } from './IBKRApplicationForm';

type Props = {
    form: UseFormReturn<Application>
    currentStep: number
}

const ProgressMeter = ({form, currentStep}: Props) => {
    const { t } = useTranslationProvider();
    const steps = [
        { name: t('apply.account.header.steps.account_type'), step: FormStep.ACCOUNT_TYPE },
        { name: t('apply.account.header.steps.personal_info'), step: FormStep.PERSONAL_INFO },
        { name: t('apply.account.header.steps.financial_info'), step: FormStep.FINANCIAL_INFO },
        { name: t('apply.account.header.steps.regulatory_info'), step: FormStep.REGULATORY_INFO },
        { name: t('apply.account.header.steps.agreements'), step: FormStep.AGREEMENTS },
        { name: t('apply.account.header.steps.documents'), step: FormStep.DOCUMENTS },
        { name: t('apply.account.header.steps.complete'), step: FormStep.SUCCESS },
    ];

    console.log(form.formState.errors);
    console.log(form.getValues());

    return (
        <div className="mb-8">
        <div className="flex justify-between items-center">
            {steps.map((step, index) => (
            <React.Fragment key={step.step}>
                <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= step.step ? 'bg-primary text-background' : 'bg-muted text-foreground'}`}>
                    {currentStep >= step.step ? (
                    step.step === FormStep.SUCCESS ? <Check className="w-4 h-4" /> : index + 1
                    ) : (
                    index + 1
                    )}
                </div>
                <span className="mt-2 text-sm">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 bg-muted">
                    <div 
                    className="h-full bg-primary" 
                    style={{ width: currentStep > step.step ? '100%' : '0%', transition: 'width 0.3s ease-in-out' }}
                    />
                </div>
                )}
            </React.Fragment>
            ))}
        </div>
        </div>
    );
    }

export default ProgressMeter