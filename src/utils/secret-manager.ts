'use server'

import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { cache } from 'react';

// Initialize the client
const client = new SecretManagerServiceClient();

// Cache duration in milliseconds (30 minutes)
const CACHE_DURATION = 30 * 60 * 1000;

// Define valid secret names for type safety
export type SecretName = 'FIREBASE_SERVICE_ACCOUNT' | 'GOOGLE_CLIENT_ID' | 'GOOGLE_CLIENT_SECRET'; // Add your valid secret names

/**
 * Fetch a secret from Google Secret Manager with React cache
 * Server-side only function
 * @param {SecretName} secretId - The ID of the secret
 * @returns {Promise<string>} - The secret value
 */
export const getSecret = cache(async (secretId: SecretName): Promise<string> => {
  console.log('Fetching secret:', secretId);
  
  const projectId = 'agm-datalake';
  
  try {
    const name = `projects/${projectId}/secrets/${secretId}/versions/latest`;
    const [version] = await client.accessSecretVersion({ name });
    
    if (!version?.payload?.data) {
      throw new Error('Invalid secret version response');
    }

    return version.payload.data.toString();
  } catch (error) {
    console.error('Error fetching secret:', error);
    throw error;
  }
});
