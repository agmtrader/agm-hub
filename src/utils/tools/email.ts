import { accessAPI } from "../api";


export async function sendAccountAccessEmail(content: any, email: string) {
  const response = await accessAPI('/email/send_email/account_access', 'POST', {
    client_email: email,
    content: content,
  })
  return response
}

export async function sendTradeTicketEmail(content: any, email: string) {
  const response = await accessAPI('/email/send_email/trade_ticket', 'POST', {
    client_email: email,
    content: content,
  })
  return response
}

export async function sendEmailChangeEmail(client_email: string, advisor_email: string) {
  const response = await accessAPI('/email/send_email/email_change', 'POST', {
    client_email: client_email,
    advisor_email: advisor_email,
  })
  return response
}

export async function sendTwoFactorReminderEmail(content: any, email: string) {
  const response = await accessAPI('/email/send_email/two_factor_reminder', 'POST', {
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