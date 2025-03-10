import { accessAPI } from "../api"

export async function ReadAccruedInterest() {
  const report = await accessAPI('/reporting/get_accrued_interest', 'GET')
  return report
}

export async function ReadClientsReport() {
  const report = await accessAPI('/reporting/get_clients_report', 'GET')
  return report
}