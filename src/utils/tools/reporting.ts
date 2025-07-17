import { accessAPI } from "../api"

export async function ExtractReports() {
  const report = await accessAPI('/reporting/extract', 'GET')
  return report
}

export async function TransformReports() {
  const report = await accessAPI('/reporting/transform', 'GET')
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
