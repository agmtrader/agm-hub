import TradeTickets from '@/components/dashboard/trade-tickets/TradeTickets'
import React, { use } from 'react'

type Props = {
    params: Promise<{
        'flex-query-id': string
    }>
}

const page = ({ params }: Props) => {

    const { 'flex-query-id': flexQueryId } = use(params)

  return (
    <TradeTickets flexQueryIdParam={flexQueryId}/>
  )
}

export default page