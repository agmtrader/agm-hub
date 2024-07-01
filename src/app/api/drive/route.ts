import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

import mime from 'mime'
import { Readable } from "stream";
import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/route";
import { NextApiRequest, NextApiResponse } from "next";

// upload function
async function uploadFileToDrive (service: any, file: any, driveId: string) {

  if (!service) {
    return null
  }

  const mimeType = mime.getType(file.name);

  const fileMetadata = {
    name: file.name,
    parents: [driveId],
    mimeType: mimeType,
  }

  const fileBuffer = file.stream();

  const response = await service.files.create({
    requestBody: fileMetadata,
    media: {
      mimeType: mimeType!,
      body: Readable.from(fileBuffer),
    },
    fields: "id",
    supportsAllDrives: true,
  })

  console.log(response)

  // get file link
  const fileLink = await service.files.get({
    fields: "id",
    fileId: response.data.id!,
    supportsAllDrives: true,
  })

  return fileLink
};

// POST request handler
export const POST = async (req:Request, res:Response) => {

    // Authenticate Google Drive using OAuth2
    const session = await getServerSession(    
      req as unknown as NextApiRequest,
      {
        ...res,
        getHeader: (name: string) => res.headers?.get(name),
        setHeader: (name: string, value: string) => res.headers?.set(name, value),
      } as unknown as NextApiResponse,
      authOptions
    );

    if (!session) {

      return NextResponse.json(
        {
          'error':'NextAuth Session does not exist'
        }
      )

    }

    if (!session.user) {

    }

    const accessToken = session.user.accessToken
    const refreshToken = session.user.refreshToken

    const auth = new google.auth.OAuth2({
      clientId: process.env.GOOGLE_OAUTH_ID,
      clientSecret: process.env.GOOGLE_OAUTH_SECRET,
      redirectUri: process.env.NEXTAUTH_URL
    })

    if (!session.user.accessToken || !session.user.refreshToken) {

    }

    auth.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    })

    const service = google.drive({ version: "v3", auth });

    const request = await req.formData()
    const file = request.get('file')
    const driveId = '0AJK0LiNFpTk6Uk9PVA'

    const fileLink = await uploadFileToDrive(service, file, driveId);

  return NextResponse.json(
    {
      fileLink,
    },
    {
      status: 200,
    }
  )
}
