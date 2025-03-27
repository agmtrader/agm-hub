'use server'
import { firestore } from '@/utils/firebase/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'

const ids = [{'id': '20241219155907'}, {'id': '20250124114724'}, {'id': '20250203092909'}, {'id': '20250205093922'}, {'id': '20250225121139'}, {'id': '20250303084841'}, {'id': '20250303084850'}, {'id': '20250303084851'}, {'id': '20250303092249'}, {'id': '20250303093841'}, {'id': '20250303094134'}, {'id': '20250303094135'}, {'id': '20250303094509'}, {'id': '20250303110322'}, {'id': '20250303110331'}, {'id': '20250314103020'}, {'id': '20250324101414'}]

export async function getRecoveryData() {
    try {
        // Calculate timestamp from the last whole minute 10 minutes ago
        const now = new Date();
        const tenMinutesAgo = new Date(now);
        tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 45);
        
        // Round down to the nearest minute by setting seconds and milliseconds to 0
        tenMinutesAgo.setSeconds(0, 0);
        
        const readTime = Timestamp.fromDate(tenMinutesAgo);
        console.log('Reading from timestamp:', tenMinutesAgo.toISOString());

        // Create document references
        const userRefs = ids.map(({ id }) => firestore.collection('db/clients/accounts').doc(id));

        // Run read-only transaction with specific read time
        const recoveryData = await firestore.runTransaction(async (transaction) => {
            const docs = await Promise.all(
                userRefs.map(ref => transaction.get(ref))
            );

            return docs.map((doc, index) => {
                if (!doc.exists) {
                    console.warn(`Document for ID ${ids[index].id} does not exist`);
                    return null;
                }
                return {
                    id: ids[index].id,
                    ...doc.data()
                };
            }).filter(Boolean);
        }, { readOnly: true, readTime });

        console.log(recoveryData)
        return recoveryData;

    } catch (error) {
        console.error('Error getting recovery data:', error);
        throw error;
    }
}