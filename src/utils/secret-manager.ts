'use server'

import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

// Initialize the client
const client = new SecretManagerServiceClient();

// Declare global cache type
declare global {
  var secretsCache: { [key: string]: { value: string; timestamp: number } };
}

// Initialize global cache if it doesn't exist
if (!global.secretsCache) {
  global.secretsCache = {};
}

const CACHE_TTL = 1000 * 60 * 60; // 1 hour in milliseconds


/// TODO PASS THIS TO PYTHON OF COURSE

/**
 * Fetch a secret from Google Secret Manager with caching
 * Server-side only function
 * @param {string} secretId - The ID of the secret (e.g., "my-api-key")
 * @returns {Promise<string>} - The secret value
 */
export async function getSecret(secretId: string) {
  console.log('Fetching secret:', secretId);
  
  const projectId = 'agm-datalake';
  const cacheKey = `${projectId}/${secretId}`;
  const now = Date.now();

  // Check cache first
  if (global.secretsCache[cacheKey] && now - global.secretsCache[cacheKey].timestamp < CACHE_TTL) {
    console.log('Secret found in cache');
    return global.secretsCache[cacheKey].value;
  }

  try {
    const name = `projects/${projectId}/secrets/${secretId}/versions/latest`;
    const [version] = await client.accessSecretVersion({ name });
    
    if (!version?.payload?.data) {
      throw new Error('Invalid secret version response');
    }

    const secretValue = version.payload.data.toString();
    
    // Update cache
    global.secretsCache[cacheKey] = {
      value: secretValue,
      timestamp: now
    };

    console.log('Successfully fetched secret and decoded secret');

    return secretValue;
  } catch (error) {
    console.error('Error fetching secret:', error);
    throw error;
  }
}

/**
 * Clear the secrets cache
 * Server-side only function
 */
export async function clearSecretsCache() {
  Object.keys(global.secretsCache).forEach(key => delete global.secretsCache[key]);
}

