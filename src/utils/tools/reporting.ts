import { accessAPI } from "../api"

export async function GenerateReports() {
  const report = await accessAPI('/reporting/run', 'GET')
  return report
}

export async function ReadClientsReport() {
  const report = await accessAPI('/reporting/clients', 'GET')
  return report
}

export async function ReadClientFeesReport() {
  const report = await accessAPI('/reporting/client_fees', 'GET')
  return report
}

export async function ReadNavReport() {
  const report = await accessAPI('/reporting/nav', 'GET')
  return report
}