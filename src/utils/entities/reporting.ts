import { accessAPI } from "../api"

export async function ReadAccruedInterest() {
  const report = await accessAPI('/reporting/get_accrued_interest', 'GET')
  return report
}

export async function ReadClientsReport() {
  const report = await accessAPI('/reporting/get_clients_report', 'GET')
  return report
}

export async function ExtractReports() {
  const report = await accessAPI('/reporting/extract', 'GET')
  return report
}

export async function TransformReports() {
  const report = await accessAPI('/reporting/transform', 'GET')
  return report
}