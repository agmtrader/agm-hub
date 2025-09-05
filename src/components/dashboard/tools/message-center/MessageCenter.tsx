'use client'
import { DataTable } from '@/components/misc/DataTable'
import { ReadMessageCenter } from '@/utils/tools/message_center'
import React, { useEffect, useState } from 'react'

const MessageCenter = () => {

    const [messages, setMessages] = useState<any[]>([])

    useEffect(() => {
        async function fetchMessages() {
            const messages = await ReadMessageCenter()
            setMessages(messages)
        }
        fetchMessages()
    }, [])

  return (
    <DataTable 
        data={messages}
        enableFiltering
        infiniteScroll
    />
  )
}

export default MessageCenter