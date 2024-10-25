import React from 'react'
import { DataTable } from '../components/DataTable'
import { Doughnut } from 'react-chartjs-2'
import { cn } from '@/lib/utils'

type Props = {
    riskProfile: any,
    account?: any,
    dark?: boolean
}

const RiskProfile = ({riskProfile, account, dark}: Props) => {

  function getAssetAllocation() {
      let labels:string[] = []
      let values:number[] = []
      
      if (riskProfile) {
          labels = Object.keys(riskProfile).filter((element) => element !== 'name' && element !== 'average_yield')
          labels.forEach((label) => {
              // Convert decimal to percentage
              riskProfile[label] = riskProfile[label] * 100
              values.push(riskProfile[label])
          })
      }
      return {labels, values}
  }
  const {labels, values} = getAssetAllocation()

  const asset_data = [
    {
      "Asset Class": "Bonds AAA - A",
      "Allocation": `${riskProfile.bonds_aaa_a.toFixed(2)}%`,
      "Risk Level": "Most Conservative",
    },
    {
      "Asset Class": "Bonds BBB",
      "Allocation": `${riskProfile.bonds_bbb.toFixed(2)}%`,
      "Risk Level": "Moderately Conservative",
    },
    {
      "Asset Class": "Bonds BB",
      "Allocation": `${riskProfile.bonds_bb.toFixed(2)}%`,
      "Risk Level": "Moderate",
    },
    {
      "Asset Class": "Stocks (ETFs)",
      "Allocation": `${riskProfile.etfs.toFixed(2)}%`,
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
    <div className="w-full h-fit flex gap-y-5 justify-center flex-col items-center">
        {account && <p className={cn("text-5xl font-bold text-agm-black", dark && 'text-agm-white')}>{account['ClientName']}</p>}
        {riskProfile.name && <h1 className="text-3xl text-agm-orange">{riskProfile.name}</h1>}
        <div className="flex flex-col lg:flex-row gap-5 w-full h-fit justify-center items-center text-center">
          <div className="w-full lg:w-1/2 flex flex-col gap-y-5 justify-center items-center">
            <h2 className={cn("text-2xl font-semibold", dark && 'text-agm-white')}>Asset Allocation</h2>
            <DataTable dark={dark} data={asset_data} width={100}/>
            <p className={cn("text-lg font-semibold", dark && 'text-agm-white')}>
              Average yield: {(riskProfile.average_yield * 100).toFixed(2)}%
            </p>
          </div>
          <div className="w-full lg:w-1/2 flex gap-y-5 justify-center items-center flex-col">
            <h2 className={cn("text-2xl font-semibold", dark && 'text-agm-white')}>Portfolio Visualization</h2>
            <div className="w-full max-w-md">
              <Doughnut data={data} options={options} />
            </div>
          </div>
        </div>
    </div>
  )
}

export default RiskProfile