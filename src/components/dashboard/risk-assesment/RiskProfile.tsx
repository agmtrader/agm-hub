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
        let labels:any[] = []
        let values:any[] = []
        
        if (riskProfile) {
            labels = Object.keys(riskProfile).filter((element) => element !== 'name' && element !== 'average_yield')
            labels.forEach((label) => {
            values.push(riskProfile[label])
            })
        }
        return {labels, values}
    }
    const {labels, values} = getAssetAllocation()
    

  const asset_data = [
    {
      "Risk Score": 1,
      "Asset Class": "STOCKS (ETFs)",
      "Risk Level": "Most Aggressive",
      "Asset Type": "STOCKS"
    },
    {
      "Risk Score": 2,
      "Asset Class": "BONDS BB",
      "Risk Level": "Moderate",
      "Asset Type": "BONDS"
    },
    {
      "Risk Score": 3,
      "Asset Class": "BONDS BBB",
      "Risk Level": "Moderately Conservative",
      "Asset Type": "BONDS"
    },
    {
      "Risk Score": 4,
      "Asset Class": "BONDS AAA",
      "Risk Level": "Most Conservative",
      "Asset Type": "BONDS"
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
          labels: {
              color: dark ? 'white' : 'black',
              font: {
                  size: 14
              },
              padding: 20,
          },
          position: "bottom" as const, 
      }
    },
    elements: {
      arc: {
        weight: 0.5,
        borderWidth: 1,
      },
    },
  }

  return (
    <div className="w-full h-fit flex gap-y-5 justify-center flex-col items-center">
        {account && <p className={cn("text-5xl font-bold text-agm-black", dark && 'text-agm-white')}>{account['ClientName']}</p>}
        {riskProfile.name && <h1 className="text-3xl text-agm-orange">{riskProfile.name}</h1>}
        <div className="flex gap-x-5 w-full h-fit justify-center items-center text-center">
        <div className="w-fit h-fit mx-10 flex flex-col gap-y-5 justify-center items-start gap-x-10">
            <DataTable dark={dark} data={asset_data} width={100}/>
            <DataTable dark={dark} data={[riskProfile]} width={100}/>
        </div>
        <div className="w-full lg:w-[35%] flex gap-y-10 justify-center items-center flex-col">
            <Doughnut data={data} options={options} />
            {riskProfile.average_yield && <p className={cn("text-lg text-agm-black font-semibold", dark && 'text-agm-white')}>Average yield: {Number(riskProfile.average_yield).toFixed(2)}%</p>}
        </div>
        </div>
    </div>
  )
}

export default RiskProfile