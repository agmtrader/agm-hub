import { poa_schema, poe_schema, poi_schema, sow_schema } from './schemas/documents';
import { Base } from './base';

export const documentCategories = [
  {
    name: 'W8 Form',
    formNumber: 5001,
    types: poa_schema.shape.type.options,
  },
  {
    name: 'Proof of Identity',
    formNumber: 8001,
    types: poi_schema.shape.type.options,
  },
  {
    name: 'Proof of Address',
    formNumber: 8002,
    types: poa_schema.shape.type.options,
  },
  {
    name: 'Source of Wealth',
    formNumber: null,
    types: sow_schema.shape.type.options,
  },
  {
    name: 'Proof of Existence',
    formNumber: null,
    types: poe_schema.shape.type.options,
  },
  {
    name: 'Manifest',
    formNumber: null,
    types: null,
  },
  {
    name: 'New Application Form',
    formNumber: null,
    types: null,
  },
  {
    name: 'Tax',
    formNumber: null,
    types: null,
  },
  {
    name: 'Other',
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