export interface FollowUp {
    date: string;
    description: string;
    completed: boolean;
}

export interface Lead {
    'LeadID': string;
    'Name': string;
    'Referrer': string;
    'Email': string;
    'EmailCountry': string;
    'Phone': string;
    'PhoneCountry': string;
    'ContactDate': string;
    'Description': string;
    'FollowUps': FollowUp[];
    'Completed': boolean;
}