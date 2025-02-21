export const Response = {
    success: (content: any) => ({
        status: 'success',
        content
    }),
    error: (error: any) => ({
        status: 'error',
        content: error
    })
}