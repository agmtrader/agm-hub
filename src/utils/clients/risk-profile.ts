import { unwrapApiResult } from "../api-result"
import { accessAPI, accessAPIResult } from "@/utils/api"
import { RiskProfilePayload, RiskArchetype, RiskProfile  } from "@/lib/clients/risk-profile"

export async function CreateRiskProfile(risk_profile:RiskProfilePayload) {
    let risk_profile_id = unwrapApiResult(await accessAPIResult('/risk_profiles/create','POST', {'data': risk_profile}))
    return risk_profile_id  
}

export async function ReadRiskProfiles(): Promise<RiskProfile[] | null> {
    let risk_profiles = await accessAPI('/risk_profiles/read','GET')
    return risk_profiles
}

export async function ReadRiskProfileById(id: string): Promise<RiskProfile | null> {
    const risk_profiles: RiskProfile[] = await accessAPI(`/risk_profiles/read?id=${id}`, 'GET')
    return risk_profiles?.[0] ?? null
}

export async function ListRiskArchetypes(): Promise<RiskArchetype[] | null> {
    let risk_archetypes = unwrapApiResult(await accessAPIResult('/risk_profiles/list','GET'))
    return risk_archetypes
}
