import { Trade } from "@/lib/entities/trade-ticket"
import { accessAPI } from "../api"
import { FetchFlexQuery } from "./flex-query"

export async function FetchTrades(tradeTicketId: string) {
    const trades:Trade[] = await FetchFlexQuery(tradeTicketId)
    trades.sort((a: any, b: any) => {
        const dateA = new Date(a['Date/Time']).getTime()
        const dateB = new Date(b['Date/Time']).getTime()
        return dateB - dateA
    })
    return trades
}

export async function GenerateTradeTicket(trades: Trade[], selectedTrades: Trade[]) {

    if (!trades || !selectedTrades) throw new Error('Trades or selected trades not found')

    // Check if all selected trades have the same description
    const firstSymbol = selectedTrades[0]?.Symbol;
    const allSameSymbol = selectedTrades.every(trade => trade.Symbol === firstSymbol);
    if (!allSameSymbol) throw new Error('All selected trades must be for the same symbol')

    // Find the indices of the selected trades in the flex query
    const selectedIndices = selectedTrades.map(selectedTrade => 
        trades.findIndex(trade => 
            trade['Date/Time'] === selectedTrade['Date/Time'] && 
            trade['Description'] === selectedTrade['Description'] &&
            trade['Quantity'] === selectedTrade['Quantity']
        )
    ).filter(index => index !== -1);

    // Generate the trade ticket using the selected indices
    let response = await accessAPI('/trade_tickets/generate_trade_ticket', 'POST', {
        'flex_query_dict': trades,
        'indices': selectedIndices.join(',')
    });
    if (response['status'] !== 'success') throw new Error(response['content']);
    const tradeTicket:Trade = response['content']

    // Generate the plain text message
    response = await accessAPI('/trade_tickets/generate_client_confirmation_message', 'POST', {'trade_data': tradeTicket});
    if (response['status'] === 'error') throw new Error(response['content']);
    return response['content']['message'];
}

export async function SendToClient(clientMessage: string) {

    if (!clientMessage) return;

    const clientEmails = "lchavarria@acobo.com, arodriguez@acobo.com, rcontreras@acobo.com"
    const response = await accessAPI('/email/send_client_email', 'POST', {
      'plain_text': clientMessage, 
      'client_email': clientEmails, 
      'subject': 'Confirmación de Transacción'
    })
    if (response['status'] !== 'success') throw new Error(response['content'])
    return true
}