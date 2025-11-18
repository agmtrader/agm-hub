'use client'

import React, { useEffect, useState } from 'react'
import { useFormContext, UseFormReturn, useWatch } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, FileText, Clock, Users, Building, Trash2, Eye } from 'lucide-react'
import DocumentViewer from '@/components/misc/DocumentViewer'
import { Application, IBKRDocument } from '@/lib/entities/application'
import DocumentUploader, { DocumentType } from './DocumentUploader'
import { FormField } from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { formatTimestamp } from '@/utils/dates'

interface DocumentsStepProps {
  form?: UseFormReturn<Application>
  formData?: Application
}

interface DocumentConfig {
  id: string;
  name: string;
  formNumber: number;
}

interface HolderInfo {
  id: string;
  name: string;
  fullName: string;
  type: 'individual' | 'organization';
}

const DOCUMENT_CONFIGS: DocumentConfig[] = [
  { id: 'w8', name: 'W8 Form', formNumber: 5001 },
  { id: 'poi', name: 'Proof of Identity', formNumber: 8001 },
  { id: 'poa', name: 'Proof of Address', formNumber: 8002 },
  { id: 'poe', name: 'Proof of Existence', formNumber: 9001 }, // Organization proof of existence
  { id: 'ppb', name: 'Proof of Place of Business', formNumber: 9002 } // Organization proof of place of business
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

  // Check application type
  const isJointApplication = actualFormData?.customer?.type === 'JOINT';
  const isOrganizationApplication = actualFormData?.customer?.type === 'ORG';

  // Get holder information for all application types
  const getHolderInfo = (): HolderInfo[] => {
    if (isOrganizationApplication && actualFormData?.customer?.organization) {
      const holders: HolderInfo[] = [];
      
      // Add organization entity
      const orgIdentification = actualFormData.customer.organization.identifications?.[0];
      if (orgIdentification) {
        holders.push({
          id: 'organization',
          name: 'Organization',
          fullName: orgIdentification.name ?? '',
          type: 'organization'
        });
      }
      
      // Add associated individuals
      const associatedIndividuals = actualFormData.customer.organization.associatedEntities?.associatedIndividuals || [];
      associatedIndividuals.forEach((individual, index) => {
        holders.push({
          id: `individual-${index}`,
          name: `Associated Individual ${index + 1}`,
          fullName: `${individual.name.first} ${individual.name.last}`,
          type: 'individual'
        });
      });
      
      return holders;
    }
    
    if (isJointApplication && actualFormData?.customer?.jointHolders) {
      // For joint applications
      const firstHolder = actualFormData.customer.jointHolders.firstHolderDetails?.[0];
      const secondHolder = actualFormData.customer.jointHolders.secondHolderDetails?.[0];
      
      const holders: HolderInfo[] = [];
      
      if (firstHolder) {
        holders.push({
          id: 'first',
          name: 'First Holder',
          fullName: `${firstHolder.name.first} ${firstHolder.name.last}`,
          type: 'individual'
        });
      }
      
      if (secondHolder) {
        holders.push({
          id: 'second',
          name: 'Second Holder',
          fullName: `${secondHolder.name.first} ${secondHolder.name.last}`,
          type: 'individual'
        });
      }
      
      return holders;
    }
    
    // For individual applications
    const holder = actualFormData?.customer?.accountHolder?.accountHolderDetails?.[0];
    if (holder) {
      return [{
        id: 'primary',
        name: 'Account Holder',
        fullName: `${holder.name.first} ${holder.name.last}`,
        type: 'individual'
      }];
    }
    
    return [];
  };

  const holders = getHolderInfo();

  // New helper to get externalIndividualId for the given holder (needed for Joint POI/POA)
  const getExternalIndividualId = (holderId: string): string | undefined => {
    const users = actualFormData?.users || [] as any[];
    switch (holderId) {
      case 'primary':
      case 'first':
        return users[0]?.externalIndividualId;
      case 'second':
        return users[1]?.externalIndividualId;
      default:
        return undefined;
    }
  };

  // Utility functions for document upload
  /**
   * Convert a File into a pure base-64 string (without the Data URL prefix).
   * Using `arrayBuffer` avoids any unintended UTF-8 conversions that can
   * corrupt binary data (e.g. PDFs) when the file is large. The returned
   * string is safe to send directly to the backend.
   */
  function getBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        try {
          const buffer = reader.result as ArrayBuffer;
          const bytes = new Uint8Array(buffer);
          let binary = "";
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const base64 = btoa(binary);
          resolve(base64);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = error => reject(error);
    });
  }

  async function calculateSHA1(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  // State and handler for DocumentViewer dialog
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerDoc, setViewerDoc] = useState<any>(null)
  const [viewerName, setViewerName] = useState('')

  const handleViewDocument = (formNumber: number, holderId?: string) => {
    const doc = documents.find((d: any) => {
      if (holderId) return d.formNumber === formNumber && d.holderId === holderId
      return d.formNumber === formNumber
    })

    if (!doc || !doc.payload?.data) {
      toast({
        title: 'Error',
        description: 'Document data not found',
        variant: 'destructive',
      })
      return
    }

    // Transform to shape expected by DocumentViewer
    const viewerDocument = {
      data: doc.payload.data,
      mime_type: doc.payload.mimeType || 'application/octet-stream',
      file_name: doc.attachedFile?.fileName || 'document',
    }

    const docName = DOCUMENT_CONFIGS.find(cfg => cfg.formNumber === formNumber)?.name || 'Document'

    setViewerDoc(viewerDocument)
    setViewerName(docName)
    setViewerOpen(true)
  }

  const isDocumentUploaded = (formNumber: number, holderId?: string): boolean => {
    return documents.some((doc: any) => {
      if (holderId) {
        return doc.formNumber === formNumber && doc.holderId === holderId;
      }
      return doc.formNumber === formNumber;
    });
  };

  const getIBKRTimestamp = () => {
    const now = new Date();
    const pad = (num: number) => num.toString().padStart(2, '0');
    return parseInt(
      `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}`
    );
  };

  const getSignerName = (holderId: string): string => {
    const holder = holders.find(h => h.id === holderId);
    return holder?.fullName || "Account Holder";
  };

  // New function to remove a document
  const handleRemoveDocument = (formNumber: number, holderId?: string) => {
    const currentDocs = actualForm?.getValues('documents') || [];
    const updatedDocs = currentDocs.filter((doc: any) => {
      if (holderId) {
        return !(doc.formNumber === formNumber && doc.holderId === holderId);
      }
      return doc.formNumber !== formNumber;
    });
    
    actualForm?.setValue('documents', updatedDocs, { shouldValidate: true, shouldDirty: true });
    
    const holderName = holderId ? holders.find(h => h.id === holderId)?.name || 'Account Holder' : 'Account Holder';
    const docName = DOCUMENT_CONFIGS.find(config => config.formNumber === formNumber)?.name || 'Document';
    
    toast({
      title: "Document Removed",
      description: `${docName} for ${holderName} has been removed successfully`,
      variant: "success"
    });
  };

  async function handlePOASubmission(
    documentType: DocumentType, 
    poaFormValues: any,         
    uploadedFiles: File[] | null,
    holderId?: string
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

      const signerName = getSignerName(holderId || 'primary');

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
        holderId: holderId || 'primary', // Add holder identifier
        ...(getExternalIndividualId(holderId || 'primary') && {
          externalIndividualId: getExternalIndividualId(holderId || 'primary'),
        }),
        payload: {
          mimeType: file.type,
          data: base64Data,
        },
        issuedDate: poaFormValues.issuedDate ? formatTimestamp(poaFormValues.issuedDate) : undefined,
        expiryDate: poaFormValues.expiryDate ? formatTimestamp(poaFormValues.expiryDate) : undefined,
      };

      const currentDocs = actualForm?.getValues('documents') || [];
      actualForm?.setValue('documents', [...currentDocs, newDoc], { shouldValidate: true, shouldDirty: true });
      
      const holderName = holders.find(h => h.id === holderId)?.name || 'Account Holder';
      toast({
        title: "Success",
        description: `Proof of Address document uploaded successfully for ${holderName}`,
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
    uploadedFiles: File[] | null,
    holderId?: string
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

      const signerName = getSignerName(holderId || 'primary');

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
        holderId: holderId || 'primary', // Add holder identifier
        ...(poiFormValues.issuedDate && { issuedDate: formatTimestamp(poiFormValues.issuedDate) }),
        ...(poiFormValues.expiryDate && { expiryDate: formatTimestamp(poiFormValues.expiryDate) }),
        ...(getExternalIndividualId(holderId || 'primary') && {
          externalIndividualId: getExternalIndividualId(holderId || 'primary'),
        }),
        payload: {
          mimeType: file.type,
          data: base64Data,
        },
      };

      const currentDocs = actualForm?.getValues('documents') || [];
      actualForm?.setValue('documents', [...currentDocs, newDoc], { shouldValidate: true, shouldDirty: true });
      
      const holderName = holders.find(h => h.id === holderId)?.name || 'Account Holder';
      toast({
        title: "Success",
        description: `Proof of Identity document uploaded successfully for ${holderName}`,
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

  // New handlers for organization-specific documents
  async function handlePOESubmission(
    documentType: DocumentType,
    poeFormValues: any,
    uploadedFiles: File[] | null,
    holderId?: string
  ) {
    if (!uploadedFiles || uploadedFiles.length === 0) { 
      console.error("No file provided for POE submission.");
      return;
    }
    const file = uploadedFiles[0]; 
    const poeFormNumber = 9001;

    try {
      const base64Data = await getBase64(file);
      const sha1Checksum = await calculateSHA1(file);
      const ibkrTimestamp = getIBKRTimestamp();

      const signerName = getSignerName(holderId || 'organization');

      const newDoc = {
        signedBy: [signerName],
        attachedFile: {
          fileName: file.name,
          fileLength: file.size,
          sha1Checksum: sha1Checksum,
        },
        formNumber: poeFormNumber,
        execLoginTimestamp: ibkrTimestamp,
        execTimestamp: ibkrTimestamp,
        proofOfExistenceType: poeFormValues.type,
        holderId: holderId || 'organization',
        payload: {
          mimeType: file.type,
          data: base64Data,
        },
        ...(poeFormValues.issuedDate && { issuedDate: formatTimestamp(poeFormValues.issuedDate) }),
        ...(poeFormValues.expiryDate && { expiryDate: formatTimestamp(poeFormValues.expiryDate) }),
      };

      const currentDocs = actualForm?.getValues('documents') || [];
      actualForm?.setValue('documents', [...currentDocs, newDoc], { shouldValidate: true, shouldDirty: true });
      
      toast({
        title: "Success",
        description: "Proof of Existence document uploaded successfully for Organization",
        variant: "success"
      });
      
      console.log('[DocumentsStep] POE Document submitted:', newDoc);
    } catch (error) {
      console.error("Error processing POE document:", error);
      toast({
        title: "Error",
        description: "Failed to upload Proof of Existence document",
        variant: "destructive"
      });
    }
  }

  async function handlePPBSubmission(
    documentType: DocumentType,
    ppbFormValues: any,
    uploadedFiles: File[] | null,
    holderId?: string
  ) {
    if (!uploadedFiles || uploadedFiles.length === 0) { 
      console.error("No file provided for PPB submission.");
      return;
    }
    const file = uploadedFiles[0]; 
    const ppbFormNumber = 9002;

    try {
      const base64Data = await getBase64(file);
      const sha1Checksum = await calculateSHA1(file);
      const ibkrTimestamp = getIBKRTimestamp();

      const signerName = getSignerName(holderId || 'organization');

      const newDoc = {
        signedBy: [signerName],
        attachedFile: {
          fileName: file.name,
          fileLength: file.size,
          sha1Checksum: sha1Checksum,
        },
        formNumber: ppbFormNumber,
        validAddress: ppbFormValues.type !== 'other',
        execLoginTimestamp: ibkrTimestamp,
        execTimestamp: ibkrTimestamp,
        proofOfPlaceOfBusinessType: ppbFormValues.type,
        holderId: holderId || 'organization',
        payload: {
          mimeType: file.type,
          data: base64Data,
        },
        ...(ppbFormValues.issuedDate && { issuedDate: formatTimestamp(ppbFormValues.issuedDate) }),
        ...(ppbFormValues.expiryDate && { expiryDate: formatTimestamp(ppbFormValues.expiryDate) }),
      };

      const currentDocs = actualForm?.getValues('documents') || [];
      actualForm?.setValue('documents', [...currentDocs, newDoc], { shouldValidate: true, shouldDirty: true });
      
      toast({
        title: "Success",
        description: "Proof of Place of Business document uploaded successfully for Organization",
        variant: "success"
      });
      
      console.log('[DocumentsStep] PPB Document submitted:', newDoc);
    } catch (error) {
      console.error("Error processing PPB document:", error);
      toast({
        title: "Error",
        description: "Failed to upload Proof of Place of Business document",
        variant: "destructive"
      });
    }
  }

  const renderDocumentSection = (holder: HolderInfo) => {
    // Determine which documents are required based on holder type
    let requiredDocs: DocumentConfig[] = [];
    
    if (holder.type === 'organization') {
      // Organization needs POE and PPB
      requiredDocs = DOCUMENT_CONFIGS.filter(doc => 
        doc.formNumber === 9001 || doc.formNumber === 9002
      );
    } else {
      // Individuals need POI and POA
      requiredDocs = DOCUMENT_CONFIGS.filter(doc => 
        doc.formNumber === 8001 || doc.formNumber === 8002
      );
    }
    
    return (
      <div key={holder.id} className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          {holder.type === 'organization' ? (
            <Building className="h-5 w-5" />
          ) : (
            <Users className="h-5 w-5" />
          )}
          <p className="text-lg font-medium text-foreground">
            Upload required documents for {holder.name.toLowerCase()} - {holder.fullName}
          </p>
        </div>
        <CardContent className="space-y-4">
          {requiredDocs.map((docConfig) => {
            const isUploaded = isDocumentUploaded(docConfig.formNumber, holder.id);
            return (
              <div key={`${holder.id}-${docConfig.id}`} className="flex items-center justify-between p-3 bg-muted rounded-lg">
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
                    <div className="flex items-center gap-2">
                      <Badge variant="success">Uploaded</Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-muted/50"
                        onClick={() => handleViewDocument(docConfig.formNumber, holder.id)}
                        title="View document"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemoveDocument(docConfig.formNumber, holder.id)}
                        title="Remove document"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : docConfig.formNumber === 8002 ? (
                    <DocumentUploader 
                      documentType="POA" 
                      handleSubmit={(docType, formValues, files) => 
                        handlePOASubmission(docType, formValues, files, holder.id)
                      } 
                    />
                  ) : docConfig.formNumber === 8001 ? (
                    <DocumentUploader 
                      documentType="POI" 
                      handleSubmit={(docType, formValues, files) => 
                        handlePOISubmission(docType, formValues, files, holder.id)
                      } 
                    />
                  ) : docConfig.formNumber === 9001 ? (
                    <DocumentUploader 
                      documentType="POI" // Reusing POI uploader for now, can be customized
                      handleSubmit={(docType, formValues, files) => 
                        handlePOESubmission(docType, formValues, files, holder.id)
                      } 
                    />
                  ) : docConfig.formNumber === 9002 ? (
                    <DocumentUploader 
                      documentType="POA" // Reusing POA uploader for business address
                      handleSubmit={(docType, formValues, files) => 
                        handlePPBSubmission(docType, formValues, files, holder.id)
                      } 
                    />
                  ) : null}
                </div>
              </div>
            );
          })}
        </CardContent>
      </div>
    );
  };

  const renderJointW8Section = () => {
    // For joint accounts, show a single W8 upload for the account (holderId: 'joint')
    const firstHolder = holders.find(h => h.id === 'first');
    if (!firstHolder) return null;
    const isUploaded = isDocumentUploaded(5001, 'joint');
    return (
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-5 w-5" />
          <p className="text-lg font-medium text-foreground">
            Upload W8 Form for Joint Account - {firstHolder.fullName}
          </p>
        </div>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              {isUploaded ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : (
                <Clock className="h-4 w-4 text-warning" />
              )}
              <div>
                <p className="font-medium">W8 Form</p>
                <p className="text-sm text-subtitle">Form 5001</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isUploaded ? (
                <div className="flex items-center gap-2">
                  <Badge variant="success">Uploaded</Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-muted/50"
                    onClick={() => handleViewDocument(5001, 'joint')}
                    title="View document"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveDocument(5001, 'joint')}
                    title="Remove document"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <DocumentUploader
                  documentType="POI"
                  handleSubmit={(docType, formValues, files) => {
                    // Use POI uploader for W8, but set formNumber to 5001 and holderId to 'joint'
                    if (!files || files.length === 0) return;
                    const file = files[0];
                    (async () => {
                      const base64Data = await getBase64(file);
                      const sha1Checksum = await calculateSHA1(file);
                      const ibkrTimestamp = getIBKRTimestamp();
                      const signerName = getSignerName('first');
                      const newDoc = {
                        signedBy: [signerName],
                        attachedFile: {
                          fileName: file.name,
                          fileLength: file.size,
                          sha1Checksum: sha1Checksum,
                        },
                        formNumber: 5001,
                        execLoginTimestamp: ibkrTimestamp,
                        execTimestamp: ibkrTimestamp,
                        holderId: 'joint',
                        ...(formValues?.issuedDate && { issuedDate: formatTimestamp(formValues.issuedDate) }),
                        ...(formValues?.expiryDate && { expiryDate: formatTimestamp(formValues.expiryDate) }),
                        payload: {
                          mimeType: file.type,
                          data: base64Data,
                        },
                      };
                      const currentDocs = actualForm?.getValues('documents') || [];
                      actualForm?.setValue('documents', [...currentDocs, newDoc], { shouldValidate: true, shouldDirty: true });
                      toast({
                        title: 'Success',
                        description: 'W8 Form uploaded successfully for Joint Account',
                        variant: 'success',
                      });
                    })();
                  }}
                />
              )}
            </div>
          </div>
        </CardContent>
      </div>
    );
  };

  const getApplicationTypeDescription = () => {
    if (isOrganizationApplication) {
      return "Please upload the required documents for the organization and each associated individual.";
    }
    if (isJointApplication) {
      return "Please upload the required documents for each account holder.";
    }
    return "Please upload the following required documents for your application.";
  };

  const getApplicationTypeBadge = () => {
    if (isOrganizationApplication) {
      return <Badge variant="outline" className="ml-2">Organization Application</Badge>;
    }
    if (isJointApplication) {
      return <Badge variant="outline" className="ml-2">Joint Application</Badge>;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Document Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Required Document Uploads
            {getApplicationTypeBadge()}
          </CardTitle>
          <CardDescription>
            {getApplicationTypeDescription()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isJointApplication ? (
            <div className="space-y-4">
              {renderJointW8Section()}
              {holders.map(holder => renderDocumentSection(holder))}
            </div>
          ) : isOrganizationApplication ? (
            <div className="space-y-4">
              {holders.map(holder => renderDocumentSection(holder))}
            </div>
          ) : (
            <div className="space-y-4">
              {DOCUMENT_CONFIGS.filter(doc => doc.formNumber <= 8002).map((docConfig) => {
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
                        <div className="flex items-center gap-2">
                          <Badge variant="success">Uploaded</Badge>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-muted/50"
                            onClick={() => handleViewDocument(docConfig.formNumber)}
                            title="View document"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleRemoveDocument(docConfig.formNumber)}
                            title="Remove document"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : docConfig.formNumber === 8002 ? (
                        <DocumentUploader documentType="POA" handleSubmit={handlePOASubmission} />
                      ) : docConfig.formNumber === 8001 ? (
                        <DocumentUploader documentType="POI" handleSubmit={handlePOISubmission} />
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document viewer dialog */}
      <DocumentViewer
        isOpen={viewerOpen}
        onOpenChange={setViewerOpen}
        document={viewerDoc}
        documentName={viewerName}
      />

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
            {isOrganizationApplication 
              ? "Upload the required documents for the organization and each associated individual to complete your application."
              : isJointApplication 
                ? "Upload the required documents for each account holder to complete your application."
                : "Upload the required documents above to complete your application."
            }
          </p>
          {(isJointApplication || isOrganizationApplication) && documents.length > 0 && (
            <div className="mt-3 space-y-1">
              {holders.map(holder => {
                const holderDocs = documents.filter((doc: any) => doc.holderId === holder.id);
                return (
                  <div key={holder.id} className="flex items-center justify-between text-xs">
                    <span className="text-subtitle">
                      {holder.name} ({holder.type === 'organization' ? 'Organization' : 'Individual'}):
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {holderDocs.length} document(s)
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
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