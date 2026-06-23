import { poa_schema, poe_schema, poi_schema, sow_schema } from './schemas/documents';
import { Base } from './base';

type TranslateFn = ((key: string) => string) | undefined

const labelOr = (t: TranslateFn, key: string, fallback: string) => (t ? t(key) : fallback)

export const documentCategories = (t?: TranslateFn) => [
  {
    name: labelOr(t, 'apply.account.documents.document_categories.w8_form', 'W8 Form'),
    formNumber: 5001,
    types: null,
  },
  {
    name: labelOr(t, 'apply.account.documents.document_categories.proof_of_identity', 'Proof of Identity'),
    formNumber: 8001,
    types: poi_schema.shape.type.options,
  },
  {
    name: labelOr(t, 'apply.account.documents.document_categories.proof_of_address', 'Proof of Address'),
    formNumber: 8002,
    types: poa_schema.shape.type.options,
  },
  {
    name: labelOr(t, 'apply.account.documents.document_categories.source_of_wealth', 'Source of Wealth'),
    formNumber: 8543,
    types: sow_schema.shape.type.options,
  },
  {
    name: labelOr(t, 'apply.account.documents.document_categories.proof_of_existence', 'Proof of Existence'),
    formNumber: null,
    types: poe_schema.shape.type.options,
  },
  {
    name: labelOr(t, 'apply.account.documents.document_categories.manifest', 'Manifest'),
    formNumber: null,
    types: null,
  },
  {
    name: labelOr(t, 'apply.account.documents.document_categories.new_application_form', 'New Application Form'),
    formNumber: null,
    types: null,
  },
  {
    name: labelOr(t, 'apply.account.documents.document_categories.tax', 'Tax'),
    formNumber: null,
    types: null,
  },
  {
    name: labelOr(t, 'apply.account.documents.document_categories.other', 'Other'),
    formNumber: null,
    types: null,
  },
]

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
