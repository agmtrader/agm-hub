import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Info } from 'lucide-react'
import { LabelValue } from '@/components/misc/LabelValue'

type Props = {
    title: string
    details: any
}

const AccountHolderCard = ({ title, details }: Props) => {
  return (
    <Card className="col-span-1">
        <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary"/> 
            {title}
        </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">

        <div className="flex flex-col gap-2">

            <p className="text-lg font-semibold text-foreground">Personal Information</p>
            <LabelValue label="Name" value={details?.name ? `${details.name.first} ${details.name.last}` : undefined} />
            <LabelValue label="Email" value={details?.email} />
            <LabelValue label="Country of Birth" value={details?.countryOfBirth} />
            <LabelValue label="Date of Birth" value={details?.dateOfBirth} />
            <LabelValue label="Employment Type" value={details?.employmentType} />
            <LabelValue label="Phones" value={details?.phones?.map((p: any) => `${p.type}: +${p.country} ${p.number}`).join(', ')} />
            <LabelValue label="Address" value={details?.residenceAddress ? `${details.residenceAddress.street1}, ${details.residenceAddress.city}, ${details.residenceAddress.state}, ${details.residenceAddress.country} ${details.residenceAddress.postalCode}` : undefined} />
        </div>

        <div className="flex flex-col gap-2">

            <p className="text-lg font-semibold text-foreground">Employment Details</p>
            <LabelValue label="Employer" value={details?.employmentDetails?.employer} />
            <LabelValue label="Occupation" value={details?.employmentDetails?.occupation} />
            <LabelValue label="Employer Business" value={details?.employmentDetails?.employerBusiness} />
            <LabelValue label="Employer Address" value={details?.employmentDetails?.employerAddress ? `${details.employmentDetails.employerAddress.street1}, ${details.employmentDetails.employerAddress.city}, ${details.employmentDetails.employerAddress.state}, ${details.employmentDetails.employerAddress.country} ${details.employmentDetails.employerAddress.postalCode}` : undefined} />
        </div>

        <div className="flex flex-col gap-2">
            <p className="text-lg font-semibold text-foreground">Identification</p>
            <LabelValue label="Passport" value={details?.identification?.passport} />
            <LabelValue label="Passport Country" value={details?.identification?.issuingCountry} />
            <LabelValue label="Citizenship" value={details?.identification?.citizenship} />
            <LabelValue label="National Card" value={details?.identification?.nationalCard} />
            <LabelValue label="National Card Expiration" value={details?.identification?.expirationDate} />
            <LabelValue label="Marital Status" value={details?.maritalStatus} />
            <LabelValue label="Dependents" value={details?.numDependents !== undefined ? details.numDependents.toString() : undefined} />
            <LabelValue label="Tax Residencies" value={details?.taxResidencies?.map((tr: any) => `${tr.country} (${tr.tinType}): ${tr.tin}`).join('; ')} />
            {details?.w8Ben && (
            <>
                <LabelValue label="W8Ben Name" value={details.w8Ben.name} />
                <LabelValue label="Foreign Tax ID" value={details.w8Ben.foreignTaxId} />
            </>
            )}
        </div>
        </CardContent>
    </Card>
  )
}

export default AccountHolderCard