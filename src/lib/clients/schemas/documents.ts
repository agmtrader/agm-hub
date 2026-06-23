import { z } from 'zod';
import { proof_of_address_type_values, proof_of_identity_type_values } from './application';

export const poe_schema = z.object({
    type: z.enum(['Business Registration', 'Articles of Incorporation', 'Company Charter', 'Partnership Agreement', 'Government-issued business license', 'Government-issued Certificate of Good Standing from the Jurisdiction of Incorporation', 'Business Registration', 'Regulatory Registration License', 'Other']),
})
  
export const poa_schema = z.object({
    type: z.enum(proof_of_address_type_values),
})
  
export const poi_schema = z.object({
    type: z.enum(proof_of_identity_type_values),
})
  
export const sow_schema = z.object({
    type: z.enum(["Bank Statement", "Tax Return", "Other", "Other"]),
})
