import React from 'react'
import { ColumnDefinition, DataTable } from '../../misc/DataTable'
import { Doughnut } from 'react-chartjs-2'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { Account } from '@/lib/entities/account'
import { RiskProfile as RiskProfileType } from '@/lib/entities/risk-profile'
import { GetAssetAllocation } from '@/utils/entities/risk-profile'
import 'chart.js/auto'

type Props = {
    riskProfile: RiskProfileType,
    account?: Account | null,
}

const RiskProfile = ({riskProfile, account}: Props) => {

  const {t} = useTranslationProvider()
  const {labels, values} = GetAssetAllocation(riskProfile)

  const assetData = [
    {
      "Asset Class": t('dashboard.risk.profile.asset_allocation.table.rows.bonds_aaa_a'),
      "Allocation": `${(riskProfile.bonds_aaa_a * 100).toFixed(2)}%`,
      "Risk Level": t('dashboard.risk.profile.asset_allocation.table.rows.most_conservative'),
    },
    {
      "Asset Class": t('dashboard.risk.profile.asset_allocation.table.rows.bonds_bbb'),
      "Allocation": `${(riskProfile.bonds_bbb * 100).toFixed(2)}%`,
      "Risk Level": t('dashboard.risk.profile.asset_allocation.table.rows.moderately_conservative'),
    },
    {
      "Asset Class": t('dashboard.risk.profile.asset_allocation.table.rows.bonds_bb'),
      "Allocation": `${(riskProfile.bonds_bb * 100).toFixed(2)}%`,
      "Risk Level": t('dashboard.risk.profile.asset_allocation.table.rows.moderate'),
    },
    {
      "Asset Class": t('dashboard.risk.profile.asset_allocation.table.rows.etfs'),
      "Allocation": `${(riskProfile.etfs * 100).toFixed(2)}%`,
      "Risk Level": t('dashboard.risk.profile.asset_allocation.table.rows.most_aggressive'),
    }
  ]

  const columns = [
    {
      accessorKey: 'Asset Class',
      header: t('dashboard.risk.profile.asset_allocation.table.header.asset_class') as string,
    },
    {
      accessorKey: 'Allocation',
      header: t('dashboard.risk.profile.asset_allocation.table.header.allocation') as string,
    },
    {
      accessorKey: 'Risk Level',
      header: t('dashboard.risk.profile.asset_allocation.table.header.risk_level') as string,
    }
  ] as ColumnDefinition<any>[]

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

  console.log(data)

  return (
    <div className="w-full h-full flex gap-10 justify-start flex-col items-center text-foreground">
        <div className="flex flex-col gap-2 text-center">
          {riskProfile.name && <h1 className="text-6xl font-bold">{t('dashboard.risk.profile.title' + '.' + riskProfile.name.toLowerCase().replace(' ', '_'))}</h1>}
          <p className="text-xl text-subtitle">{account && account.id}</p>
        </div>
        <div className="grid grid-cols-2 gap-32 text-center">
          <div className="flex flex-col gap-5">
            <h2 className='text-xl font-semibold'>
              {t('dashboard.risk.profile.asset_allocation.title')}
            </h2>
            <DataTable data={assetData} columns={columns}/>
            <p className='text-sm'>
              {t('dashboard.risk.profile.average_yield')}: <span className='font-semibold text-primary'>{(riskProfile.average_yield * 100).toFixed(2)}%</span>
            </p>
          </div>
          <div className="w-full flex flex-col gap-5 max-w-md">
            <h2 className='text-xl font-semibold'>
              {t('dashboard.risk.profile.asset_allocation.title')}
            </h2>
            <Doughnut data={data} options={options} />
          </div>
        </div>
    </div>
  )

}

export default RiskProfile