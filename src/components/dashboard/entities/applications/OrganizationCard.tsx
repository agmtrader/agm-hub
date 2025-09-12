import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Info } from 'lucide-react'
import { LabelValue } from '@/components/misc/LabelValue'
import { Badge } from '@/components/ui/badge'

type Props = {
    customer: any
    organizationAccountSupport: any
    organizationIdents: any
}

const OrganizationCard = ({ customer, organizationAccountSupport, organizationIdents }: Props) => {
  return (
    <Card className="col-span-1">
    <CardHeader>
    <CardTitle className="flex items-center gap-2">
        <Info className="h-5 w-5 text-primary"/>
        Organization Details
    </CardTitle>
    </CardHeader>
    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
    {/* General Customer Fields */}
    <LabelValue label="Customer Prefix" value={customer.prefix} />
    <LabelValue label="Customer External ID" value={customer.externalId} />
    <LabelValue label="Customer Email" value={customer.email} />
    <LabelValue label="Legal Residence Country" value={customer.legalResidenceCountry} />
    <LabelValue label="Direct Trading Access" value={<Badge variant={customer.directTradingAccess ? 'success' : 'outline'}>{customer.directTradingAccess ? 'Yes' : 'No'}</Badge>} />
    <LabelValue label="Meets AML Standard" value={customer.meetAmlStandard} />
    <LabelValue label="MD Status Non-Pro" value={<Badge variant={customer.mdStatusNonPro ? 'success' : 'outline'}>{customer.mdStatusNonPro ? 'Yes' : 'No'}</Badge>} />

    {/* Account Support */}
    {organizationAccountSupport && (
        <>
        <LabelValue label="Owners Reside US" value={<Badge variant={organizationAccountSupport.ownersResideUS ? 'success' : 'outline'}>{organizationAccountSupport.ownersResideUS ? 'Yes' : 'No'}</Badge>} />
        <LabelValue label="Business Description" value={organizationAccountSupport.businessDescription} />
        </>
    )}

    {/* Identifications (may be multiple) */}
    {organizationIdents.map((ident:any, idx:number) => {
        const businessAddress = ident.placeOfBusinessAddress;
        return (
        <React.Fragment key={idx}>
            <LabelValue label={`Identification Name ${idx+1}`} value={ident.name} />
            <LabelValue label={`Identification ID ${idx+1}`} value={ident.identification} />
            <LabelValue label={`Identification Description ${idx+1}`} value={ident.businessDescription} />
            <LabelValue label={`Business Address ${idx+1}`} value={businessAddress ? `${businessAddress.street1}, ${businessAddress.city}, ${businessAddress.state}, ${businessAddress.country} ${businessAddress.postalCode}` : undefined} />
        </React.Fragment>
        );
    })}
    </CardContent>
    </Card>
  )
}

export default OrganizationCard