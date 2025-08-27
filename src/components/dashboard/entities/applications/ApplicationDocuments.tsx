import { ColumnDefinition } from '@/components/misc/DataTable'
import { DataTable } from '@/components/misc/DataTable'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { FileText } from 'lucide-react'
import React, { useState } from 'react'
import DocumentViewer from './DocumentViewer'


type Props = {
    documents: any[]
}

const ApplicationDocuments = ({ documents }: Props) => {

    const [selectedDocument, setSelectedDocument] = useState<any>(null)

    const DOCUMENT_TYPE_MAP: { [key: number]: string } = {
        5001: 'W8 Form',
        8001: 'Proof of Identity',
        8002: 'Proof of Address',
      };
    
      const getDocumentName = (formNumber: number) => {
        return DOCUMENT_TYPE_MAP[formNumber] || 'Unknown Document';
      };
      
  return (
    <div className="mb-8">
    <Card className="col-span-1 md:col-span-2">
        <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary"/> Documents</CardTitle>
        </CardHeader>
        <CardContent>
        <DataTable
            data={documents}
            enableRowActions
            rowActions={[{
                label: 'View',
                onClick: (row) => {
                    setSelectedDocument(row)
                }
            }]}
        />
        </CardContent>
    </Card>

    <DocumentViewer 
        document={selectedDocument}
        documentName={selectedDocument ? getDocumentName(selectedDocument.formNumber) : ''}
        isOpen={!!selectedDocument}
        onOpenChange={() => setSelectedDocument(null)}
    />
    </div>
  )
}

export default ApplicationDocuments