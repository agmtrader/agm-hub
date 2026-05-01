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

export async function ReadBondsReport() {
  const report = await accessAPI('/reporting/rtd', 'GET')
  return report
}

export async function ReadUSTBondsReport() {
  const report = await accessAPI('/reporting/ust_bonds', 'GET')
  return report
}

export async function ReadStocksReport() {
  const report = await accessAPI('/reporting/stocks', 'GET')
  return report
}

export async function ReadIBKRDetails() {
  const report = await accessAPI('/reporting/ibkr_details', 'GET')
  return report
}

export async function ReadClientFeesReport() {
  const report = await accessAPI('/reporting/clients/fees', 'GET')
  return report
}

export async function ReadBrokerageCommissions() {
  const report = await accessAPI('/reporting/brokerage_commissions', 'GET')
  return report
}

export async function ReadManagementCommissions() {
  const report = await accessAPI('/reporting/management_commissions', 'GET')
  return report
}

export async function ReadEndingBalancesFromStatements() {
  const report = await accessAPI('/reporting/ending_balances_from_statements', 'GET')
  return report
}

export async function ReadDepositsWithdrawalsReport(years: string[] = [], months: string[] = []) {
  const params = new URLSearchParams()
  if (years.length > 0) params.set('years', years.join(','))
  if (months.length > 0) params.set('months', months.join(','))
  const query = params.toString() ? `?${params.toString()}` : ''

  const report = await accessAPI(`/reporting/deposits_withdrawals/monthly${query}`, 'GET')
  return report
}

export async function ReadMonthlyDepositsReport(years: string[] = [], months: string[] = []) {
  const params = new URLSearchParams()
  if (years.length > 0) params.set('years', years.join(','))
  if (months.length > 0) params.set('months', months.join(','))
  const query = params.toString() ? `?${params.toString()}` : ''

  const response = await fetch(`/api/reporting/deposits_withdrawals/monthly${query}`, { cache: 'no-store' })
  return response.json()
}

export async function ReadTradesReport(years: string[] = [], months: string[] = []) {
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

export async function ReadMonthlyClientFeesReport(years: string[], months: string[]) {
  const params = new URLSearchParams()
  if (years.length > 0) params.set('years', years.join(','))
  if (months.length > 0) params.set('months', months.join(','))
  const query = params.toString() ? `?${params.toString()}` : ''
  const response = await fetch(`/api/reporting/clients/fees/monthly${query}`, { cache: 'no-store' })
  return response.json()
}