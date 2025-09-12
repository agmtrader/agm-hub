import React from 'react'

type Props = {
    label: string
    value?: React.ReactNode
}

export const LabelValue = ({ label, value }: Props) => {
    if (
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '')
    ) {
      return null;
    }
    return (
      <div className="flex select-text gap-2 text-sm">
        <span className="font-medium text-foreground whitespace-nowrap">{label}:</span> <span className="text-subtitle text-left">{value}</span>
      </div>
    );
  };

export default LabelValue