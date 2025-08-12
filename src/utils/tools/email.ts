import { accessAPI } from "../api";

export async function sendTradeTicketEmail(content: {message: string}, email: string) {
  const response = await accessAPI('/email/send_email/trade_ticket', 'POST', {
    client_email: email,
    content: content,
  })
  return response
}

export async function sendEmailConfirmationEmail(content: { pin: string }, email: string, lang: string) {
  const response = await accessAPI('/email/send_email/email_confirmation', 'POST', {
    client_email: email,
    content: content,
    lang: lang,
  })
  return response
}

export async function sendApplicationLinkEmail(content: {name: string, application_link: string}, email: string, language: string) {
  const response = await accessAPI('/email/send_email/application_link', 'POST', {
    client_email: email,
    content: content,
    lang: language,
  })
  return response
}