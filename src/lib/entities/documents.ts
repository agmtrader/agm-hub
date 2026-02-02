import { poa_schema, poe_schema, poi_schema, sow_schema } from './schemas/documents';
import { Base } from './base';

export const documentCategories = (t: (key: string) => string) => [
  {
    name: t('apply.account.documents.document_categories.w8_form'),
    formNumber: 5001,
    types: poa_schema.shape.type.options,
  },
  {
    name: t('apply.account.documents.document_categories.proof_of_identity'),
    formNumber: 8001,
    types: poi_schema.shape.type.options,
  },
  {
    name: t('apply.account.documents.document_categories.proof_of_address'),
    formNumber: 8002,
    types: poa_schema.shape.type.options,
  },
  {
    name: t('apply.account.documents.document_categories.source_of_wealth'),
    formNumber: null,
    types: sow_schema.shape.type.options,
  },
  {
    name: t('apply.account.documents.document_categories.proof_of_existence'),
    formNumber: null,
    types: poe_schema.shape.type.options,
  },
  {
    name: t('apply.account.documents.document_categories.manifest'),
    formNumber: null,
    types: null,
  },
  {
    name: t('apply.account.documents.document_categories.new_application_form'),
    formNumber: null,
    types: null,
  },
  {
    name: t('apply.account.documents.document_categories.tax'),
    formNumber: null,
    types: null,
  },
  {
    name: t('apply.account.documents.document_categories.other'),
    formNumber: null,
    types: null,
  },
]

export interface InternalDocumentPayload {
  mime_type: string;
  file_name: string;
  file_length: number;
  sha1_checksum: string;
  data: string;
}
export type InternalDocument = InternalDocumentPayload & Base