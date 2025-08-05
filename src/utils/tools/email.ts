import { accessAPI } from "../api";

export async function sendTradeTicketEmail(content: any, email: string) {
  const response = await accessAPI('/email/send_email/trade_ticket', 'POST', {
    client_email: email,
    content: content,
  })
  return response
}

export async function sendEmailConfirmationEmail(content: any, email: string) {
  const response = await accessAPI('/email/send_email/email_confirmation', 'POST', {
    client_email: email,
    content: content,
  })
  return response
}

export async function sendApplicationLinkEmail(content: any, email: string, language: string) {
  const response = await accessAPI('/email/send_email/application_link', 'POST', {
    client_email: email,
    content: content,
    lang: language,
  })
  return response
}