import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Application } from '@/lib/entities/application';
import AccountHolderInfoStep from './AccountHolderInfoStep';

interface PersonalInfoStepProps {
  form: UseFormReturn<Application>;
}

const PersonalInfoStep = ({ form }: PersonalInfoStepProps) => {
  return (
    <AccountHolderInfoStep
      form={form}
      showFinancial={false}
      showRegulatory={false}
      showAccountInformation={false}
    />
  );
};

export default PersonalInfoStep;
