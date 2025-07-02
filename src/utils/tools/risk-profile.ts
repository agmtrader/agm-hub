import { accessAPI } from "@/utils/api"
import { riskProfiles, AccountRiskProfilePayload, RiskProfile as RiskProfileType, AccountRiskProfile } from "@/lib/tools/risk-profile"
import { useTranslationProvider } from "../providers/TranslationProvider"

export async function CreateAccountRiskProfile(account_risk_profile:AccountRiskProfilePayload) {
    return
}

export async function ReadAccountRiskProfiles(): Promise<AccountRiskProfile[] | null> {
    let account_risk_profiles = await accessAPI('/risk_profiles/read','POST', {'query': {}})
    return account_risk_profiles
}

// Find assigned risk profile using the calculated risk score
export function GetRiskProfile(risk_score: number): RiskProfileType | null {

    let assigned_risk_profile:RiskProfileType | null = null
    riskProfiles.forEach(profile => {
        if (risk_score >= profile.min_score && risk_score < profile.max_score) {
        assigned_risk_profile = profile
        }
    })

    return assigned_risk_profile
}

export function GetAssetAllocation(riskProfile:RiskProfileType) {
    
    const {t} = useTranslationProvider()
    let labels:string[] = []
    let values:number[] = []
    
    if (riskProfile) {
        // Only include asset allocation fields
        const assetFields = ['bonds_aaa_a', 'bonds_bbb', 'bonds_bb', 'etfs']
        assetFields.forEach(field => {
            labels.push(t(`dashboard.risk.profile.asset_allocation.table.rows.${field}`))
            values.push((riskProfile[field as keyof RiskProfileType] as number) * 100)
        })
    }
    return {labels, values}
}