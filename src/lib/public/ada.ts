export interface ChatMessage {
    role: string;      // e.g. 'HumanMessage' or 'AIMessage'
    message: string;   // the text content
}

// The Ada endpoint returns an object with model + all messages
export interface ChatResponse {
    model: string;
    messages: ChatMessage[];
}