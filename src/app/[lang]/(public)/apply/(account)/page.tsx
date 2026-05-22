'use client'
import React, { useEffect, useState } from 'react';
import Title from '@/components/hub/apply/Title';
import IBKRApplicationForm from '@/components/hub/apply/IBKRApplicationForm';
import { GetBusinessAndOccupation, GetFinancialRanges, GetForms } from '@/utils/clients/account';

const agreementFormNumbers = [
  '3230', '3024', '4070', '3044', '3089', '4304', '4404', '5013', '5001', '4024', '9130', '3074', '3203',
  '3070', '3094', '3071', '4587', '2192', '2191', '3077', '4399', '4684', '2109', '4016', '4289',
];

const page = () => {
  const [started, setStarted] = useState(false)
  const [prefetchedData, setPrefetchedData] = useState<{
    financialRangesResult: any;
    businessResult: any;
    agreementsResult: any;
  } | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [financialRangesResult, businessResult, agreementsResult] = await Promise.all([
          GetFinancialRanges(),
          GetBusinessAndOccupation(),
          GetForms(agreementFormNumbers),
        ]);
        if (!active) return;
        setPrefetchedData({
          financialRangesResult,
          businessResult,
          agreementsResult,
        });
      } catch {
        // Keep form fallback fetch behavior.
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  if (started) {
    return <IBKRApplicationForm prefetchedData={prefetchedData} />
  }
  else {
    return <Title setStarted={setStarted}/>
  }
}

export default page
