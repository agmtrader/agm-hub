import { Trade, TradeTicket, TradeTicketResponse } from "@/lib/tools/trade-ticket"
import { accessAPI } from "../api"
import { sendTradeTicketEmail } from "./email"

export async function ListTradeTickets() {
    const availableTradeTickets:TradeTicket[] = await accessAPI('/trade_tickets/list', 'GET')
    return availableTradeTickets
}

export async function FetchTrades(tradeTicketId: string) {
    const trades:Trade[] = await accessAPI(`/trade_tickets/read?query_id=${tradeTicketId}`, 'GET')
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
    let response:TradeTicketResponse = await accessAPI('/trade_tickets/confirmation_message', 'POST', {
        'flex_query_dict': trades,
        'indices': selectedIndices.join(',')
    });

    return response['message'];
}

export async function SendToClient(clientMessage: string, email: string) {
    if (!clientMessage) return;
    await sendTradeTicketEmail(clientMessage, email)
}