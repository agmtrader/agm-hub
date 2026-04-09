import { accessAPI } from "../api"

export async function ReadClientsReport() {
  const report = await accessAPI('/reporting/clients', 'GET')
  return report
}

export async function ReadNavReport() {
  const report = await accessAPI('/reporting/nav', 'GET')
  return report
}

export async function ReadOpenPositionsReport() {
  const report = await accessAPI('/reporting/open_positions', 'GET')
  return report
}

export async function ReadDepositsWithdrawalsReport() {
  const report = await accessAPI('/reporting/deposits_withdrawals', 'GET')
  return report
}

export async function ReadBondsReport() {
  const report = await accessAPI('/reporting/rtd', 'GET')
  return report
}

export async function ReadStocksReport() {
  const report = await accessAPI('/reporting/stocks', 'GET')
  return report
}

export async function ReadTradesReport(years: string[], months: string[]) {
  const params = new URLSearchParams()
  if (years.length > 0) params.set('years', years.join(','))
  if (months.length > 0) params.set('months', months.join(','))
  const query = params.toString() ? `?${params.toString()}` : ''
  const response = await fetch(`/api/reporting/trades${query}`, { cache: 'no-store' })
  return response.json()
}

export async function ReadNavMonthlyReport(year: string, month: string[]) {
  const params = new URLSearchParams()
  if (year) params.set('year', year)
  if (month.length > 0) params.set('month', month.join(','))
  const query = params.toString() ? `?${params.toString()}` : ''
  const response = await fetch(`/api/reporting/nav/monthly${query}`, { cache: 'no-store' })
  return response.json()
}

export async function ReadIBKRDetails() {
  const report = await accessAPI('/reporting/ibkr_details', 'GET')
  return report
}