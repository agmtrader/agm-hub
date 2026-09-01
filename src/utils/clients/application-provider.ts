import { accessAPI } from '../api'
import type { ApplicationProvider } from '@/lib/clients/application-provider'

export async function ReadApplicationProvider(id: string): Promise<ApplicationProvider | null> {
  const providers: ApplicationProvider[] = await accessAPI(`/application_providers/read?id=${encodeURIComponent(id)}`, 'GET')
  return providers?.[0] || null
}
