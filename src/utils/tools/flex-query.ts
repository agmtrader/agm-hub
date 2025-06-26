import { accessAPI } from "../api"

export async function FetchFlexQueries(flexQueryIds: string[]): Promise<FlexQuery[]> {
    if (!flexQueryIds) throw new Error('Flex query IDs not found')
    const flexQueries = await accessAPI('/flex_query/fetch', 'POST', {'queryIds': flexQueryIds})
    return flexQueries
}

export async function FetchFlexQuery(flexQueryId: string) {
    if (!flexQueryId) throw new Error('Flex query ID not found')
    const flexQuery = await accessAPI('/flex_query/fetch', 'POST', {'queryIds': [flexQueryId]})
    return flexQuery[flexQueryId as string]
}