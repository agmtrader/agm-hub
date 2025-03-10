import { accessAPI } from "@/utils/api"
import { risk_profiles, UserRiskProfile, RiskProfile as RiskProfileType } from "@/lib/entities/risk-profile"
import { useTranslationProvider } from "../providers/TranslationProvider"

export async function saveRiskProfile(user_risk_profile:UserRiskProfile) {
    await accessAPI('/database/create', 'POST', {data: user_risk_profile, path:'db/clients/risk_profiles', id:user_risk_profile.UserID})
}

export async function ReadRiskProfiles(): Promise<RiskProfileType[] | null> {
    let risk_profiles = await accessAPI('/database/read','POST', {'path': 'db/clients/risk_profiles'})
    return risk_profiles
}

// Find assigned risk profile using the calculated risk score
export function getRiskProfile(risk_score: number): RiskProfileType | null {

    let assigned_risk_profile:RiskProfileType | null = null
    risk_profiles.forEach(profile => {
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
        labels = Object.keys(riskProfile).filter((element) => element !== 'name' && element !== 'average_yield')
        labels.forEach((label) => {
            if (label !== 'min_score' && label !== 'max_score') {
              // Convert decimal to percentage without modifying original data
              values.push((riskProfile[label as keyof RiskProfileType] as number) * 100)
              // Translate the label
              labels[labels.indexOf(label)] = t(`dashboard.risk.profile.asset_allocation.table.rows.${label}`);
            }
        })
    }
    return {labels, values}
}