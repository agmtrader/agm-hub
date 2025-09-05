import { accessAPI } from "../api"

export async function ReadMessageCenter() {
    const response = await accessAPI('/message_center/read', 'GET')
    return response
}