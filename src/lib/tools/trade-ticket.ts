import { Base } from "../entities/base";

export type TradeTicket = {
    name: string;
} & Base

export interface Trade {
    "AccountAlias": string;
    "AccruedInterest": string;
    "AllocatedTo": string;
    "Amount": string;
    "AssetClass": string;
    "BlockID": string;
    "BrokerClearingCommission": string;
    "BrokerExecutionCommission": string;
    "BrokerageOrderID": string;
    "Buy/Sell": string;
    "CUSIP": string;
    "ClearingFirmID": string;
    "ClientAccountID": string;
    "Code": string;
    "Commission": string;
    "CommissionCurrency": string;
    "CommodityType": string;
    "Conid": string;
    "CurrencyPrimary": string;
    "Date/Time": string;
    "DeliveryType": string;
    "Description": string;
    "Exchange": string;
    "ExecID": string;
    "Expiry": string;
    "ExtExecID": string;
    "FIGI": string;
    "Fineness": string;
    "ISIN": string;
    "IsAPIOrder": string;
    "Issuer": string;
    "IssuerCountryCode": string;
    "LevelOfDetail": string;
    "ListingExchange": string;
    "Model": string;
    "Multiplier": string;
    "NetCash": string;
    "NetCashWithBillable": string;
    "OrderID": string;
    "OrderReference": string;
    "OrderTime": string;
    "OrderType": string;
    "OrigTradeDate": string;
    "OrigTradeID": string;
    "OrigTradePrice": string;
    "OtherCommission": string;
    "Price": string;
    "PrincipalAdjustFactor": string;
    "Proceeds": string;
    "Put/Call": string;
    "Quantity": string;
    "RFQID": string;
    "ReportDate": string;
    "SecurityID": string;
    "SecurityIDType": string;
    "SerialNumber": string;
    "SettleDate": string;
    "Strike": string;
    "SubCategory": string;
    "Symbol": string;
    "Tax": string;
    "ThirdPartyClearingCommission": string;
    "ThirdPartyExecutionCommission": string;
    "ThirdPartyRegulatoryCommission": string;
    "TradeDate": string;
    "TradeID": string;
    "TraderID": string;
    "TransactionType": string;
    "UnderlyingConid": string;
    "UnderlyingListingExchange": string;
    "UnderlyingSecurityID": string;
    "UnderlyingSymbol": string;
    "VolatilityOrderLink": string;
    "Weight": string;
    "file_name": string;
}

export interface TradeTicketResponse {
    "message": string;
}