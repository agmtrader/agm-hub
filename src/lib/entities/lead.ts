export interface FollowUp {
    date: string;
    description: string;
    completed: boolean;
}

export interface Lead {
    'LeadID': string;
    'ContactID': string;
    'ReferrerID': string;
    'ContactDate': string;
    'Description': string;
    'FollowUps': FollowUp[];
    'Completed': boolean;
}