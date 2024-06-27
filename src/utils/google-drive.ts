import { google } from 'googleapis'
import { getSession } from 'next-auth/react';

const scopes = 'https://www.googleapis.com/auth/drive'

async function authenticateGoogleDrive(req:any, res:any) {

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NEXTAUTH_URL
  );

  auth.setCredentials({ access_token: session.accessToken });

  const service = google.drive({ version: 'v3', auth })
  return service
}


// Todo!!!
export async function createFile(req:any, res:any) {
    
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.NEXTAUTH_URL
    );
  
    auth.setCredentials({ access_token: session.accessToken });
  
    const service = google.drive({ version: 'v3', auth })

    const file = await service.files.create({
        requestBody,
        media: media,
    })
    return file
}