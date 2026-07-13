import ContactDocuments from '@/components/hub/apply/ContactDocuments'

const COPY_BY_LANGUAGE = {
  en: {
    title: 'Compliance Document Upload',
    description:
      'Please upload the requested documents below. Once uploaded, they will be linked to your contact immediately.',
    missingContactId: 'Missing contact_id in the link.',
    missingFormNumbers: 'Missing or invalid form_numbers in the link.',
  },
  es: {
    title: 'Carga de Documentos de Cumplimiento',
    description:
      'Por favor cargue los documentos solicitados a continuación. Una vez cargados, quedarán vinculados inmediatamente a su contacto.',
    missingContactId: 'Falta el contact_id en el enlace.',
    missingFormNumbers: 'Faltan form_numbers válidos en el enlace.',
  },
} as const

type PageProps = {
  params: Promise<{ lang: string }>
  searchParams: Promise<{
    contact_id?: string
    form_numbers?: string
  }>
}

const FORM_NUMBER_TO_CATEGORY_KEY: Record<number, string> = {
  8001: 'proof_of_identity',
  8002: 'proof_of_address',
  8137: 'proof_of_existence',
  2150: 'source_of_wealth',
  8553: 'source_of_wealth',
}

const normalizeAllowedCategoryKeys = (rawFormNumbers: string | undefined) => {
  const uniqueKeys = new Set<string>()

  String(rawFormNumbers || '')
    .split(',')
    .map((value) => Number(String(value).trim()))
    .filter((value) => Number.isFinite(value))
    .forEach((formNumber) => {
      const categoryKey = FORM_NUMBER_TO_CATEGORY_KEY[formNumber]
      if (categoryKey) uniqueKeys.add(categoryKey)
    })

  return Array.from(uniqueKeys)
}

export default async function ComplianceDocumentsPage(props: PageProps) {
  const params = await props.params
  const searchParams = await props.searchParams

  const lang = params.lang === 'es' ? 'es' : 'en'
  const copy = COPY_BY_LANGUAGE[lang]
  const contactId = String(searchParams.contact_id || '').trim()
  const allowedCategoryKeys = normalizeAllowedCategoryKeys(searchParams.form_numbers)

  if (!contactId) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-12">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          {copy.missingContactId}
        </div>
      </main>
    )
  }

  if (allowedCategoryKeys.length === 0) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-12">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          {copy.missingFormNumbers}
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <div className="mb-8 space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{copy.title}</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">{copy.description}</p>
      </div>

      <ContactDocuments
        contactId={contactId}
        accountId={null}
        uploadOnly
        allowedCategoryKeys={allowedCategoryKeys}
      />
    </main>
  )
}
