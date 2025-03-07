'use server'
import { firestoreAdmin } from '@/utils/firebase/firebase-admin'

export async function getRecoveryData() {
    try {
        const userRef = firestoreAdmin.collection('users').doc('20250123124721')
        
        const result = await firestoreAdmin.runTransaction(async (transaction) => {
            const doc = await transaction.get(userRef)
            if (!doc.exists) {
                throw new Error('User document does not exist!')
            }

            // Get the data from the document
            const userData = doc.data()
            
            // You can perform additional operations within the transaction here
            // For example, updating a lastAccessed timestamp:
            // transaction.update(userRef, {
            //     lastAccessed: Timestamp.now()
            // })

            return userData
        })
        console.log(result)

        return result
    } catch (error) {
        console.error('Error getting recovery data:', error)
        throw error
    }
}