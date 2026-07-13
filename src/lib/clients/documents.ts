import { poa_schema, poe_schema, poi_schema, sow_schema } from './schemas/documents';
import { Base } from './base';

type TranslateFn = ((key: string) => string) | undefined

const labelOr = (t: TranslateFn, key: string, fallback: string) => (t ? t(key) : fallback)

export type DocumentCategoryDefinition = {
  key: string
  name: string
  canonicalName: string
  formNumber: number | null
  types: readonly string[] | null
}

export const documentCategories = (t?: TranslateFn) => [
  {
    key: 'w8_form',
    name: labelOr(t, 'apply.account.documents.document_categories.w8_form', 'W8 Form'),
    canonicalName: 'W8 Form',
    formNumber: 5001,
    types: null,
  },
  {
    key: 'proof_of_identity',
    name: labelOr(t, 'apply.account.documents.document_categories.proof_of_identity', 'Proof of Identity'),
    canonicalName: 'Proof of Identity',
    formNumber: 8001,
    types: poi_schema.shape.type.options,
  },
  {
    key: 'proof_of_address',
    name: labelOr(t, 'apply.account.documents.document_categories.proof_of_address', 'Proof of Address'),
    canonicalName: 'Proof of Address',
    formNumber: 8002,
    types: poa_schema.shape.type.options,
  },
  {
    key: 'source_of_wealth',
    name: labelOr(t, 'apply.account.documents.document_categories.source_of_wealth', 'Source of Wealth'),
    canonicalName: 'Source of Wealth',
    formNumber: 8543,
    types: sow_schema.shape.type.options,
  },
  {
    key: 'proof_of_existence',
    name: labelOr(t, 'apply.account.documents.document_categories.proof_of_existence', 'Proof of Existence'),
    canonicalName: 'Proof of Existence',
    formNumber: null,
    types: poe_schema.shape.type.options,
  },
  {
    key: 'manifest',
    name: labelOr(t, 'apply.account.documents.document_categories.manifest', 'Manifest'),
    canonicalName: 'Manifest',
    formNumber: null,
    types: null,
  },
  {
    key: 'new_application_form',
    name: labelOr(t, 'apply.account.documents.document_categories.new_application_form', 'New Application Form'),
    canonicalName: 'New Application Form',
    formNumber: null,
    types: null,
  },
  {
    key: 'tax',
    name: labelOr(t, 'apply.account.documents.document_categories.tax', 'Tax'),
    canonicalName: 'Tax',
    formNumber: null,
    types: null,
  },
  {
    key: 'other',
    name: labelOr(t, 'apply.account.documents.document_categories.other', 'Other'),
    canonicalName: 'Other',
    formNumber: null,
    types: null,
  },
] satisfies DocumentCategoryDefinition[]

const normalizeCategoryValue = (value: string) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

export function getDocumentCategoryByKey(key: string, t?: TranslateFn) {
  return documentCategories(t).find((category) => category.key === key) || null
}

export function getDocumentCategoryKey(value: string, t?: TranslateFn) {
  const normalized = normalizeCategoryValue(value)
  const match = documentCategories(t).find((category) =>
    normalizeCategoryValue(category.key) === normalized ||
    normalizeCategoryValue(category.name) === normalized ||
    normalizeCategoryValue(category.canonicalName) === normalized
  )

  return match?.key || null
}

export function getCanonicalDocumentCategory(value: string, t?: TranslateFn) {
  const key = getDocumentCategoryKey(value, t)
  if (!key) return value
  return getDocumentCategoryByKey(key, t)?.canonicalName || value
}

export const requiredApplicationDocuments = [
  { name: 'W8 Form', formNumber: 5001 },
  { name: 'Proof of Identity', formNumber: 8001 },
  { name: 'Proof of Address', formNumber: 8002 },
] as const

export const documentLanguageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
] as const

export interface InternalDocumentPayload {
  mime_type: string;
  file_name: string;
  file_length: number;
  sha1_checksum: string;
  data: string;
}
export type InternalDocument = InternalDocumentPayload & Base
