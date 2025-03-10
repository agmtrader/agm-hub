import { accessAPI } from "../api";

export async function sendEmail(email: string, subject: string, content: any, email_template: string) {
  const response = await accessAPI('/email/send_email', 'POST', {
    client_email: email,
    subject: subject,
    content: content,
    email_template: email_template,
  })
  return response
}