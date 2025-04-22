'use client'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Home, Wallet } from "lucide-react"
import Image from 'next/image'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import Link from 'next/link'
import { formatURL } from '@/utils/language/lang'
import { Button } from '@/components/ui/button'

const RequirementsPage = () => {

    const { t, lang } = useTranslationProvider()

  return (
    <div className="container flex-col flex py-6 gap-6 justify-center items-center">
        <div className='flex flex-col gap-2'>
            <h1 className="text-4xl font-bold p-5 text-center">{t('apply.requirements.title')}</h1>
            <p className="text-muted-foreground text-center">{t('apply.requirements.description')}</p>
        </div>
        <Tabs defaultValue="personal" className="w-full max-w-7xl">
            <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="personal">{t('apply.requirements.personal.title')}</TabsTrigger>
            <TabsTrigger value="institutional">{t('apply.requirements.institutional.title')}</TabsTrigger>
            </TabsList>
            <TabsContent value="personal" className="mt-0">
            <div className="space-y-6">
                <div className="flex flex-col gap-6">
                {/* Identity Documents Card */}
                <Card className="border-none shadow-md">
                    <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <CardTitle>1. {t('apply.requirements.personal.identity.title')}</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{t('apply.requirements.personal.identity.description')}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <div className="space-y-4">
                        <div className="border-l-2 border-primary pl-4">
                        <h4 className="font-medium text-foreground">{t('apply.requirements.personal.identity.documents.passport.title')}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                            {t('apply.requirements.personal.identity.documents.passport.description')}
                        </p>
                        </div>
                        <div className="border-l-2 border-primary pl-4">
                        <h4 className="font-medium text-foreground">{t('apply.requirements.personal.identity.documents.id_card.title')}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                            {t('apply.requirements.personal.identity.documents.id_card.description')}
                        </p>
                        </div>
                        <div className="border-l-2 border-primary pl-4">
                        <h4 className="font-medium text-foreground">{t('apply.requirements.personal.identity.documents.driver_license.title')}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                            {t('apply.requirements.personal.identity.documents.driver_license.description')}
                        </p>
                        </div>
                    </div>
                    </CardContent>
                </Card>

                {/* Address Proof Card */}
                <Card className="border-none shadow-md">
                    <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                        <Home className="h-5 w-5 text-primary" />
                        <CardTitle>2. {t('apply.requirements.personal.proof_of_address.title')}</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{t('apply.requirements.personal.proof_of_address.description')}</p>
                    </CardHeader>
                    <CardContent>
                    <div className="border-l-2 border-primary pl-4">
                        <h4 className="font-medium text-foreground">{t('apply.requirements.personal.proof_of_address.documents.utility_bill.title')}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                            {t('apply.requirements.personal.proof_of_address.documents.utility_bill.description')}
                        </p>
                    </div>
                    </CardContent>
                </Card>

                {/* Income Source Card */}
                <Card className="border-none shadow-md">
                    <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-primary" />
                        <CardTitle>3. {t('apply.requirements.personal.source_of_wealth.title')}</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{t('apply.requirements.personal.source_of_wealth.description')}</p>
                    </CardHeader>
                    <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                        <span className="block w-1 h-1 mt-2 rounded-full bg-primary flex-shrink-0"></span>
                        {t('apply.requirements.personal.source_of_wealth.documents.salary')}
                        </li>
                        <li className="flex items-start gap-2">
                        <span className="block w-1 h-1 mt-2 rounded-full bg-primary flex-shrink-0"></span>
                        {t('apply.requirements.personal.source_of_wealth.documents.investments')}
                        </li>
                        <li className="flex items-start gap-2">
                        <span className="block w-1 h-1 mt-2 rounded-full bg-primary flex-shrink-0"></span>
                        {t('apply.requirements.personal.source_of_wealth.documents.property')}
                        </li>
                        <li className="flex items-start gap-2">
                        <span className="block w-1 h-1 mt-2 rounded-full bg-primary flex-shrink-0"></span>
                        {t('apply.requirements.personal.source_of_wealth.documents.inheritance')}
                        </li>
                        <li className="flex items-start gap-2">
                        <span className="block w-1 h-1 mt-2 rounded-full bg-primary flex-shrink-0"></span>
                        {t('apply.requirements.personal.source_of_wealth.documents.shares')}
                        </li>
                        <li className="flex items-start gap-2">
                        <span className="block w-1 h-1 mt-2 rounded-full bg-primary flex-shrink-0"></span>
                        {t('apply.requirements.personal.source_of_wealth.documents.dividends')}
                        </li>
                    </ul>
                    </CardContent>
                </Card>
                </div>
            </div>
            </TabsContent>
            <TabsContent value="institutional" className="mt-6">
                <div className="space-y-6">
                    <div className="flex flex-col gap-6">
                        {/* Company Documents Card */}
                        <Card className="border-none shadow-md">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    <CardTitle>1. {t('apply.requirements.institutional.company_documents.title')}</CardTitle>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{t('apply.requirements.institutional.company_documents.description')}</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-4">
                                    <div className="border-l-2 border-primary pl-4">
                                        <h4 className="font-medium text-foreground">{t('apply.requirements.institutional.company_documents.documents.incorporation.title')}</h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {t('apply.requirements.institutional.company_documents.documents.incorporation.description')}
                                        </p>
                                    </div>
                                    <div className="border-l-2 border-primary pl-4">
                                        <h4 className="font-medium text-foreground">{t('apply.requirements.institutional.company_documents.documents.legal_id.title')}</h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {t('apply.requirements.institutional.company_documents.documents.legal_id.description')}
                                        </p>
                                    </div>
                                    <div className="border-l-2 border-primary pl-4">
                                        <h4 className="font-medium text-foreground">{t('apply.requirements.institutional.company_documents.documents.legal_status.title')}</h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {t('apply.requirements.institutional.company_documents.documents.legal_status.description')}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Address Verification Card */}
                        <Card className="border-none shadow-md">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-2">
                                    <Home className="h-5 w-5 text-primary" />
                                    <CardTitle>2. {t('apply.requirements.institutional.address_verification.title')}</CardTitle>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{t('apply.requirements.institutional.address_verification.description')}</p>
                            </CardHeader>
                            <CardContent>
                                <div className="border-l-2 border-primary pl-4">
                                    <h4 className="font-medium text-foreground">{t('apply.requirements.institutional.address_verification.documents.utility_bill.title')}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {t('apply.requirements.institutional.address_verification.documents.utility_bill.description')}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Director Identification Card */}
                        <Card className="border-none shadow-md">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    <CardTitle>3. {t('apply.requirements.institutional.director_identification.title')}</CardTitle>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{t('apply.requirements.institutional.director_identification.description')}</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-4">
                                    <div className="border-l-2 border-primary pl-4">
                                        <h4 className="font-medium text-foreground">{t('apply.requirements.institutional.director_identification.documents.passport.title')}</h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {t('apply.requirements.institutional.director_identification.documents.passport.description')}
                                        </p>
                                    </div>
                                    <div className="border-l-2 border-primary pl-4">
                                        <h4 className="font-medium text-foreground">{t('apply.requirements.institutional.director_identification.documents.id_card.title')}</h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {t('apply.requirements.institutional.director_identification.documents.id_card.description')}
                                        </p>
                                    </div>
                                    <div className="border-l-2 border-primary pl-4">
                                        <h4 className="font-medium text-foreground">{t('apply.requirements.institutional.director_identification.documents.driver_license.title')}</h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {t('apply.requirements.institutional.director_identification.documents.driver_license.description')}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Director Address Card */}
                        <Card className="border-none shadow-md">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-2">
                                    <Home className="h-5 w-5 text-primary" />
                                    <CardTitle>4. {t('apply.requirements.institutional.director_address.title')}</CardTitle>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{t('apply.requirements.institutional.director_address.description')}</p>
                            </CardHeader>
                            <CardContent>
                                <div className="border-l-2 border-primary pl-4">
                                    <h4 className="font-medium text-foreground">{t('apply.requirements.institutional.director_address.documents.utility_bill.title')}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {t('apply.requirements.institutional.director_address.documents.utility_bill.description')}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Capital Ownership Card */}
                        <Card className="border-none shadow-md">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    <CardTitle>5. {t('apply.requirements.institutional.capital_ownership.title')}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-4">
                                    <div className="border-l-2 border-primary pl-4">
                                        <p className="text-sm text-muted-foreground">
                                            {t('apply.requirements.institutional.capital_ownership.documents.share_certificate')}
                                        </p>
                                    </div>
                                    <div className="border-l-2 border-primary pl-4">
                                        <p className="text-sm text-muted-foreground">
                                            {t('apply.requirements.institutional.capital_ownership.documents.notarial_certification')}
                                        </p>
                                    </div>
                                    <div className="border-l-2 border-primary pl-4">
                                        <p className="text-sm text-muted-foreground font-medium">
                                            {t('apply.requirements.institutional.capital_ownership.note')}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Source of Wealth Card */}
                        <Card className="border-none shadow-md">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-2">
                                    <Wallet className="h-5 w-5 text-primary" />
                                    <CardTitle>6. {t('apply.requirements.institutional.source_of_wealth.title')}</CardTitle>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{t('apply.requirements.institutional.source_of_wealth.description')}</p>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <span className="block w-1 h-1 mt-2 rounded-full bg-primary flex-shrink-0"></span>
                                        {t('apply.requirements.institutional.source_of_wealth.documents.investments')}
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="block w-1 h-1 mt-2 rounded-full bg-primary flex-shrink-0"></span>
                                        {t('apply.requirements.institutional.source_of_wealth.documents.inheritance')}
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="block w-1 h-1 mt-2 rounded-full bg-primary flex-shrink-0"></span>
                                        {t('apply.requirements.institutional.source_of_wealth.documents.shares')}
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="block w-1 h-1 mt-2 rounded-full bg-primary flex-shrink-0"></span>
                                        {t('apply.requirements.institutional.source_of_wealth.documents.profits]')}
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="block w-1 h-1 mt-2 rounded-full bg-primary flex-shrink-0"></span>
                                        {t('apply.requirements.institutional.source_of_wealth.documents.business')}
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="block w-1 h-1 mt-2 rounded-full bg-primary flex-shrink-0"></span>
                                        {t('apply.requirements.institutional.source_of_wealth.documents.dividends')}
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
        <Link href={formatURL('/apply', lang)}>
            <Button className="w-full">
                {t('apply.requirements.submit')}
            </Button>
        </Link>
    </div>
  )
}

export default RequirementsPage