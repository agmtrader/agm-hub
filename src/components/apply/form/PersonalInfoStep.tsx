import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Application } from '@/lib/entities/application';
import AccountHolderInfoStep from './AccountHolderInfoStep';

interface PersonalInfoStepProps {
  form: UseFormReturn<Application>;
  onSecurityQuestionsChange?: (qa: Record<string, string>) => void;
}

const PersonalInfoStep = ({ form, onSecurityQuestionsChange }: PersonalInfoStepProps) => (
  <AccountHolderInfoStep
    form={form}
    onSecurityQuestionsChange={onSecurityQuestionsChange}
  />
);

export default PersonalInfoStep;
