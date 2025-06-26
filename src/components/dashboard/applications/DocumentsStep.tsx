'use client'

import React, { useEffect, useState } from 'react'
import { useFormContext, UseFormReturn, useWatch } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, FileText, Clock } from 'lucide-react'
import { Application } from '@/lib/entities/application'
import DocumentUploader, { DocumentType } from './DocumentUploader'
import { FormField } from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'

interface DocumentsStepProps {
  form?: UseFormReturn<Application>
  formData?: Application
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

const DocumentsStep = ({ form, formData }: DocumentsStepProps) => {
  // Use the passed form if available, otherwise try to get from context
  const actualForm = form as UseFormReturn<Application>
  const actualFormData = formData || (actualForm ? actualForm.getValues() : null)

  // Register documents field
  useEffect(() => {
    if (actualForm) {
      actualForm.register('documents');
    }
  }, [actualForm]);

  const documents = useWatch({
    control: actualForm?.control,
    name: "documents",
    defaultValue: [],
  }) || [];

  // Utility functions for document upload
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

      // Get account holder name for signing
      const accountHolderName = actualFormData?.customer?.accountHolder?.accountHolderDetails?.[0]?.name
      const signerName = accountHolderName ? `${accountHolderName.first} ${accountHolderName.last}` : "Account Holder"

      const newDoc = {
        signedBy: [signerName],
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

      const currentDocs = actualForm?.getValues('documents') || [];
      actualForm?.setValue('documents', [...currentDocs, newDoc], { shouldValidate: true, shouldDirty: true });
      
      toast({
        title: "Success",
        description: "Proof of Address document uploaded successfully",
        variant: "success"
      });
      
      console.log('[DocumentsStep] POA Document submitted:', newDoc);
    } catch (error) {
      console.error("Error processing POA document:", error);
      toast({
        title: "Error",
        description: "Failed to upload Proof of Address document",
        variant: "destructive"
      });
    }
  }

  async function handlePOISubmission(
    documentType: DocumentType,
    poiFormValues: any,
    uploadedFiles: File[] | null
  ) {
    if (!uploadedFiles || uploadedFiles.length === 0) { 
      console.error("No file provided for POI submission.");
      return;
    }
    const file = uploadedFiles[0]; 
    const poiFormNumber = 8001;

    try {
      const base64Data = await getBase64(file);
      const sha1Checksum = await calculateSHA1(file);
      const ibkrTimestamp = getIBKRTimestamp();

      // Get account holder name for signing
      const accountHolderName = actualFormData?.customer?.accountHolder?.accountHolderDetails?.[0]?.name
      const signerName = accountHolderName ? `${accountHolderName.first} ${accountHolderName.last}` : "Account Holder"

      const newDoc = {
        signedBy: [signerName],
        attachedFile: {
          fileName: file.name,
          fileLength: file.size,
          sha1Checksum: sha1Checksum,
        },
        formNumber: poiFormNumber,
        execLoginTimestamp: ibkrTimestamp,
        execTimestamp: ibkrTimestamp,
        proofOfIdentityType: poiFormValues.type,
        payload: {
          mimeType: file.type,
          data: base64Data,
        },
      };

      const currentDocs = actualForm?.getValues('documents') || [];
      actualForm?.setValue('documents', [...currentDocs, newDoc], { shouldValidate: true, shouldDirty: true });
      
      toast({
        title: "Success",
        description: "Proof of Identity document uploaded successfully",
        variant: "success"
      });
      
      console.log('[DocumentsStep] POI Document submitted:', newDoc);
    } catch (error) {
      console.error("Error processing POI document:", error);
      toast({
        title: "Error",
        description: "Failed to upload Proof of Identity document",
        variant: "destructive"
      });
    }
  }

  return (
    <div className="space-y-6">
      {/* Document Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Required Document Uploads
          </CardTitle>
          <CardDescription>
            Please upload the following required documents for your application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {DOCUMENT_CONFIGS.map((docConfig) => {
            const isUploaded = isDocumentUploaded(docConfig.formNumber);
            return (
              <div key={docConfig.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  {isUploaded ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <Clock className="h-4 w-4 text-warning" />
                  )}
                  <div>
                    <p className="font-medium">{docConfig.name}</p>
                    <p className="text-sm text-subtitle">Form {docConfig.formNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isUploaded ? (
                    <Badge variant="success">Uploaded</Badge>
                  ) : docConfig.formNumber === 8002 ? (
                    <DocumentUploader documentType="POA" handleSubmit={handlePOASubmission} />
                  ) : docConfig.formNumber === 8001 ? (
                    <DocumentUploader documentType="POI" handleSubmit={handlePOISubmission} />
                  ) : null}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Documents Uploaded</p>
            <Badge variant="outline">
              {documents.length} document(s)
            </Badge>
          </div>
          <p className="text-xs text-subtitle mt-1">
            Upload the required documents above to complete your application.
          </p>
        </CardContent>
      </Card>

      {/* Hidden form field */}
      {actualForm && (
        <FormField
          control={actualForm.control}
          name="documents"
          render={({ field }: { field: any }) => (
            <input type="hidden" {...field} />
          )}
        />
      )}
    </div>
  )
}

export default DocumentsStep