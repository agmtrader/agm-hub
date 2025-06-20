import React from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { Application } from '@/lib/entities/application';
import { FormField } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import DocumentUploader, { DocumentType } from './DocumentUploader';

interface Props {
  form: UseFormReturn<Application>;
}

interface DocumentConfig {
  id: string;
  name: string;
  formNumber: number;
}

const DOCUMENT_CONFIGS: DocumentConfig[] = [
  { id: 'w8', name: 'W8 Form', formNumber: 5001 },
  { id: 'poi', name: 'Proof of Income', formNumber: 8001 },
  { id: 'poa', name: 'Proof of Address', formNumber: 8002 }
];

const DocumentsStep = ({ form }: Props) => {

  React.useEffect(() => {
    form.register('documents');
  }, [form]);

  const documents = useWatch({
    control: form.control,
    name: "documents",
    defaultValue: [],
  }) || [];

  function getBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = error => reject(error);
    });
  };

  async function calculateSHA1(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  const isDocumentUploaded = (formNumber: number): boolean => {
    return documents.some((doc: any) => doc.formNumber === formNumber);
  };

  const getIBKRTimestamp = () => {
    const now = new Date();
    const pad = (num: number) => num.toString().padStart(2, '0');
    return parseInt(
      `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}`
    );
  };

  async function handlePOASubmission(
    documentType: DocumentType, 
    poaFormValues: any,         
    uploadedFiles: File[] | null 
  ) {
    if (!uploadedFiles || uploadedFiles.length === 0) { 
      console.error("No file provided for POA submission.");
      return;
    }
    const file = uploadedFiles[0]; 
    const poaFormNumber = 8002;

    try {
      const base64Data = await getBase64(file);
      const sha1Checksum = await calculateSHA1(file);
      const ibkrTimestamp = getIBKRTimestamp();

      const newDoc = {
        signedBy: ["Andres Aguilar Carboni"],
        attachedFile: {
          fileName: file.name,
          fileLength: file.size,
          sha1Checksum: sha1Checksum,
        },
        formNumber: poaFormNumber,
        validAddress: poaFormValues.type !== 'other', 
        execLoginTimestamp: ibkrTimestamp,
        execTimestamp: ibkrTimestamp,
        proofOfAddressType: poaFormValues.type, 
        payload: {
          mimeType: file.type,
          data: base64Data,
        },
      };

      const currentDocs = form.getValues('documents') || [];
      form.setValue('documents', [...currentDocs, newDoc], { shouldValidate: true, shouldDirty: true });
      console.log('[DocumentsStep] POA Document submitted:', newDoc);
    } catch (error) {
      console.error("Error processing POA document:", error);
    }
  }

  async function handlePOISubmission(
    documentType: DocumentType,
    poiFormValues: any,
    uploadedFiles: File[] | null
  ) {
  }

  return (
    <div className="space-y-6">
      {DOCUMENT_CONFIGS.map((docConfig) => {
        const isUploaded = isDocumentUploaded(docConfig.formNumber);
        return (
          <Card key={docConfig.id}>
            <CardHeader>
              <CardTitle>{docConfig.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {isUploaded ? (
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  <span>Uploaded</span>
                </div>
              ) : docConfig.formNumber === 8002 ? (
                <DocumentUploader documentType="POA" handleSubmit={handlePOASubmission} />
              ) : docConfig.formNumber === 8001 ? (
                <DocumentUploader documentType="POI" handleSubmit={handlePOISubmission} />
              ) : (
                null
              )}
            </CardContent>
          </Card>
        );
      })}

      <FormField
        control={form.control}
        name="documents"
        render={({ field }: { field: any }) => (
          <input type="hidden" {...field} />
        )}
      />
    </div>
  );
};

export default DocumentsStep;