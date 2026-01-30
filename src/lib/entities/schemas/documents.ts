import { z } from 'zod';

export const poe_schema = z.object({
    type: z.enum(['Business Registration', 'Articles of Incorporation', 'Company Charter', 'Partnership Agreement', 'Government-issued business license', 'Government-issued Certificate of Good Standing from the Jurisdiction of Incorporation', 'Business Registration', 'Regulatory Registration License', 'Other']),
})
  
export const poa_schema = z.object({
    type: z.enum(["Utility Bill", "Bank Statement", "Tax Return", "Marriage Certificate", "Other"]),
})
  
export const poi_schema = z.object({
    type: z.enum(["National ID Card", "Driver License", "Passport", "Other"]),
})
  
export const sow_schema = z.object({
    type: z.enum(["Bank Statement", "Tax Return", "Other", "Other"]),
})