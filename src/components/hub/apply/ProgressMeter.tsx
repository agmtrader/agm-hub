import React from 'react'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { Check } from 'lucide-react';
import { FormStep } from './IBKRApplicationForm';

type Props = {
    currentStep: number
}

const ProgressMeter = ({ currentStep }: Props) => {
    const { t } = useTranslationProvider();
    const steps = [
        { name: t('apply.account.header.steps.account_type'), step: FormStep.ACCOUNT_TYPE },
        { name: t('apply.account.header.steps.personal_info'), step: FormStep.PERSONAL_INFO },
        { name: t('apply.account.header.steps.financial_info'), step: FormStep.FINANCIAL_INFO },
        { name: t('apply.account.header.steps.regulatory_info'), step: FormStep.REGULATORY_INFO },
        { name: t('apply.account.header.steps.documents'), step: FormStep.DOCUMENTS },
        { name: t('apply.account.header.steps.agreements'), step: FormStep.AGREEMENTS },
        { name: t('apply.account.header.steps.complete'), step: FormStep.SUCCESS },
    ];

    const currentStepIndex = Math.min(currentStep, steps.length - 1);
    const currentStepName = steps[currentStepIndex]?.name ?? steps[0].name;

    return (
        <div className="mb-8">
            <div className="md:hidden rounded-xl border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-muted-foreground">
                        Step {currentStepIndex + 1} of {steps.length}
                    </p>
                    <p className="text-sm font-semibold text-foreground text-right">
                        {currentStepName}
                    </p>
                </div>

                <div className="mt-4 flex items-center">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.step}>
                            <div
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                                    currentStep >= step.step
                                        ? 'bg-primary text-background'
                                        : 'bg-muted text-foreground'
                                }`}
                            >
                                {currentStep >= step.step && step.step === FormStep.SUCCESS ? (
                                    <Check className="h-3.5 w-3.5" />
                                ) : (
                                    index + 1
                                )}
                            </div>
                            {index < steps.length - 1 && (
                                <div className="mx-1 h-1 flex-1 rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-primary transition-all duration-300 ease-in-out"
                                        style={{ width: currentStep > step.step ? '100%' : '0%' }}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="hidden items-center justify-between gap-2 md:flex">
                {steps.map((step, index) => (
                    <React.Fragment key={step.step}>
                        <div className="flex min-w-0 flex-col items-center text-center">
                            <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                    currentStep >= step.step
                                        ? 'bg-primary text-background'
                                        : 'bg-muted text-foreground'
                                }`}
                            >
                                {currentStep >= step.step ? (
                                    step.step === FormStep.SUCCESS ? <Check className="h-4 w-4" /> : index + 1
                                ) : (
                                    index + 1
                                )}
                            </div>
                            <span className="mt-2 text-sm leading-tight">{step.name}</span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className="h-1 flex-1 rounded-full bg-muted">
                                <div
                                    className="h-full rounded-full bg-primary transition-all duration-300 ease-in-out"
                                    style={{ width: currentStep > step.step ? '100%' : '0%' }}
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
