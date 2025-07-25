import { accessAPI } from "../api"

export async function GenerateReports() {
  const report = await accessAPI('/reporting/run', 'GET')
  return report
}

export async function GetDimensionalTable() {
  const report = await accessAPI('/reporting/dimensional_table', 'GET')
  return report
}

export async function GetClientsReport() {
  const report = await accessAPI('/reporting/clients', 'GET')
  return report
}

export async function GetNAVReport() {
  const report = await accessAPI('/reporting/nav', 'GET')
  return report
}

export async function GetClientFeesReport() {
  const report = await accessAPI('/reporting/client_fees', 'GET')
  return report
}