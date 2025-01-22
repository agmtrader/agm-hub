import React from 'react'
import { DataTable } from '../components/DataTable'
import { Doughnut } from 'react-chartjs-2'
import 'chart.js/auto'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

type Props = {
    riskProfile: any,
    account?: any,
}

const RiskProfile = ({riskProfile, account}: Props) => {

  const {t} = useTranslationProvider()

  function getAssetAllocation() {
      let labels:string[] = []
      let values:number[] = []
      
      if (riskProfile) {
          labels = Object.keys(riskProfile).filter((element) => element !== 'name' && element !== 'average_yield')
          labels.forEach((label) => {
              if (label !== 'min_score' && label !== 'max_score') {
                // Convert decimal to percentage without modifying original data
                values.push(riskProfile[label] * 100)
              }
          })
      }
      return {labels, values}
  }
  const {labels, values} = getAssetAllocation()

  const assetData = [
    {
      "Asset Class": "Bonds AAA - A",
      "Allocation": `${(riskProfile.bonds_aaa_a * 100).toFixed(2)}%`,
      "Risk Level": "Most Conservative",
    },
    {
      "Asset Class": "Bonds BBB",
      "Allocation": `${(riskProfile.bonds_bbb * 100).toFixed(2)}%`,
      "Risk Level": "Moderately Conservative",
    },
    {
      "Asset Class": "Bonds BB",
      "Allocation": `${(riskProfile.bonds_bb * 100).toFixed(2)}%`,
      "Risk Level": "Moderate",
    },
    {
      "Asset Class": "Stocks (ETFs)",
      "Allocation": `${(riskProfile.etfs * 100).toFixed(2)}%`,
      "Risk Level": "Most Aggressive",
    }
  ]

  const data = {
    backgroundColor: [
      "rgb(102, 204, 255)",
      "rgb(51, 153, 255)",
      "rgb(0, 102, 255)",
      "rgb(0, 51, 204)",
    ],
    labels: labels,
    datasets: [
      {
        label: "Portfolio",
        data: values,
        backgroundColor: [
          "rgb(102, 204, 255)",
          "rgb(51, 153, 255)",
          "rgb(0, 102, 255)",
          "rgb(0, 51, 204)",
        ],
        hoverOffset: 4,
      },
    ],
  }
  
  const options = {
      plugins: {
        legend: {
          display: false
      },
      tooltip: {
          callbacks: {
              label: function(context: any) {
                  let label = context.label || '';
                  if (label) {
                      label += ': ';
                  }
                  if (context.parsed !== undefined) {
                      label += context.parsed.toFixed(2) + '%';
                  }
                  return label;
              }
          }
      },
      elements: {
        arc: {
          weight: 0.5,
          borderWidth: 1,
        },
      },
    }
  }

  return (
    <div className="w-full h-full flex gap-10 justify-start flex-col items-center text-foreground">
        <div className="flex flex-col gap-2 text-center">
          {riskProfile.name && <h1 className="text-6xl font-bold">{riskProfile.name}</h1>}
          <p className="text-xl text-subtitle">{account && account.AccountNumber}</p>
        </div>
        <div className="grid grid-cols-2 gap-32 text-center">
          <div className="flex flex-col gap-5">
            <h2 className='text-xl font-semibold'>
              {t('dashboard.risk.profile.asset_allocation')}
            </h2>
            <DataTable data={assetData}/>
            <p className='text-sm'>
              {t('dashboard.risk.profile.average_yield')}: <span className='font-semibold text-primary'>{(riskProfile.average_yield * 100).toFixed(2)}%</span>
            </p>
          </div>
          <div className="w-full flex flex-col gap-5 max-w-md">
            <h2 className='text-xl font-semibold'>
              {t('dashboard.risk.profile.asset_allocation')}
            </h2>
            <Doughnut data={data} options={options} />
          </div>
        </div>
    </div>
  )
}

export default RiskProfile