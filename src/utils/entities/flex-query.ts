import { accessAPI } from "../api"

export async function FetchFlexQueries(flexQueryIds: string[]): Promise<FlexQuery[]> {
    if (!flexQueryIds) throw new Error('Flex query IDs not found')
    const response = await accessAPI('/flex_query/fetch', 'POST', {'queryIds': flexQueryIds})
    if (response['status'] !== 'success') throw new Error(response['content'])
    return response['content']
}

export async function FetchFlexQuery(flexQueryId: string) {
    if (!flexQueryId) throw new Error('Flex query ID not found')
    const response = await accessAPI('/flex_query/fetch', 'POST', {'queryIds': [flexQueryId]})
    if (response['status'] !== 'success') throw new Error(response['content'])
    return response['content'][flexQueryId as string]
}