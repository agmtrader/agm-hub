'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingComponent from '@/components/misc/LoadingComponent';
import { DetailItem } from './AccountPage';
import { GetForms, GetPendingTasksByAccountID, SubmitAccountDocument } from '@/utils/entities/account';
import { DocumentSubmissionRequest, PendingTask, PendingTasksResponse } from '@/lib/entities/account';
import { ClipboardList, FileCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatTimestamp } from '@/utils/dates';
import { Checkbox } from '@/components/ui/checkbox';
import LoaderButton from '@/components/misc/LoaderButton';

interface Props {
  accountId: string;
  accountTitle: string;
}

// Online forms that would otherwise become pending tasks
const ONLINE_FORMS = [
  { formNumber: 3024, name: 'Forex and Multi-Currency Accounts Disclosure' },
  { formNumber: 4587, name: 'Risk Disclosure Regarding Ramp and Dump Scams' },
  { formNumber: 4070, name: 'Algorithmic Execution Venue Disclosure' },
  { formNumber: 2192, name: 'Interactive Brokers Group Privacy Policy' },
  { formNumber: 3089, name: 'Global Financial Information Services Subscriber Agreement' },
  { formNumber: 4304, name: 'Interactive Brokers LLC Regulation Best Interest Disclosure' },
  { formNumber: 4399, name: 'Interactive Brokers Group Cookie Policy' },
  { formNumber: 4404, name: 'FINRA Investor Protection Information Resources' },
  { formNumber: 5013, name: 'Trading Control and Ownership Certification' },
  { formNumber: 4684, name: 'Notice and Acknowledgement of Clearing Arrangement' },
  { formNumber: 2109, name: 'Legal Acknowledgement' },
  { formNumber: 4016, name: 'After-Hours Trading Disclosure' },
  { formNumber: 4289, name: 'Interactive Brokers Fractional Share Trading Disclosure' },
  { formNumber: 4024, name: 'Interactive Brokers Customer Relationship Summary' },
  { formNumber: 9130, name: 'Stock Stop Order Disclosure' },
  { formNumber: 3074, name: 'IB Order Routing and Payment for Order Flow Disclosure' },
  { formNumber: 3203, name: 'Interactive Brokers LLC Client Agreement' },
  { formNumber: 3070, name: 'Interactive Brokers Business Continuity Plan Disclosure' },
  { formNumber: 3081, name: 'Notice Regarding USA Patriot Act Section 311' },
  { formNumber: 3094, name: 'Notice Regarding NFA\'s BASIC System' },
  { formNumber: 3071, name: 'Day Trading Risk Disclosure Statement' }
]

// Forms that require manual document upload and cannot be auto-signed
const MANUAL_UPLOAD_FORMS = [
  { formNumber: 8001, name: 'Proof of Identity' },
  { formNumber: 8002, name: 'Proof of Address' }
]

export function AccountPendingTasks({ accountId, accountTitle }: Props) {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoSigning, setIsAutoSigning] = useState(false);
  const [pendingTasks, setPendingTasks] = useState<PendingTasksResponse | null>(null);

  const formsToIgnore = ["2111", "2121", "2122"];
  const taxForms = ["5001"];
  const manualUploadFormNumbers = MANUAL_UPLOAD_FORMS.map(form => form.formNumber.toString());

  console.log(pendingTasks)

  async function fetchData() {
    try {
      const data = await GetPendingTasksByAccountID(accountId);
      setPendingTasks(data);
    } catch (error) {
      console.error('Error fetching pending tasks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch pending tasks. Please try again later.",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    fetchData();
  }, [accountId]);

  async function handleCompleteTask(task: PendingTask) {
    setIsSubmitting(true);
    try {

      // Get form document relating to task
      if (formsToIgnore.includes(task.formNumber.toString())) {
        throw new Error("Form not found for this task");
      }

      // Prevent manual upload forms from being auto-completed
      if (manualUploadFormNumbers.includes(task.formNumber.toString())) {
        throw new Error("This form requires manual document upload and cannot be auto-signed");
      }

      const forms = await GetForms([task.formNumber.toString()]);
      if (!forms || !forms.formDetails.length) throw new Error("Form not found for this task");
      const form = forms.formDetails[0];

      // Prepare document submission
      const timestamp = parseInt(formatTimestamp(new Date()));
      const fileData = forms.fileData;

      const documentSubmission: DocumentSubmissionRequest = {
        documents: [
          {
            signedBy: [`${accountTitle}`],
            attachedFile: {
              fileName: form.fileName,
              fileLength: form.fileLength,
              sha1Checksum: form.sha1Checksum
            },
            formNumber: parseInt(task.formNumber.toString()),
            validAddress: false,
            execLoginTimestamp: timestamp,
            execTimestamp: timestamp,
            payload: {
              mimeType: 'application/pdf',
              data: fileData.data
            }
          }
        ],
        accountId,
        inputLanguage: 'en',
        translation: false,
      };

      // Submit document
      const result = await SubmitAccountDocument(accountId, documentSubmission);
      console.log(result);
      if (result.fileData.data.documentSubmission.documents[0].status === 'Accepted') {
        toast({
          title: "Success",
          description: `${task.formName} marked as complete!`,
          variant: "success",
        });
      } else {
        throw new Error(result.fileData.data.documentSubmission.documents[0].status);
      }

    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to complete the task.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      fetchData();
    }
  }

  // Auto-sign all online forms to prevent pending tasks
  async function handleAutoSignOnlineForms() {
    setIsAutoSigning(true);
    try {
      // Get form numbers for online forms
      const onlineFormNumbers = ONLINE_FORMS.map(form => form.formNumber.toString());
      
      const timestamp = parseInt(formatTimestamp(new Date()));
      const documents = [];
      
      // Get each form individually to ensure correct file data and SHA-1
      for (const formNumber of onlineFormNumbers) {
        try {
          const forms = await GetForms([formNumber]);
          if (forms && forms.formDetails.length > 0) {
            const form = forms.formDetails[0];
            const fileData = forms.fileData;
            
            documents.push({
              signedBy: [accountTitle],
              attachedFile: {
                fileName: form.fileName,
                fileLength: form.fileLength,
                sha1Checksum: form.sha1Checksum
              },
              formNumber: parseInt(form.formNumber.toString()),
              validAddress: false,
              execLoginTimestamp: timestamp,
              execTimestamp: timestamp,
              payload: {
                mimeType: 'application/pdf',
                data: fileData.data
              }
            });
          }
        } catch (formError) {
          console.warn(`Failed to get form ${formNumber}:`, formError);
          // Continue with other forms
        }
      }

      if (documents.length === 0) {
        throw new Error("No online forms found to sign");
      }

      // Submit all documents at once
      const documentSubmission: DocumentSubmissionRequest = {
        documents,
        accountId,
        inputLanguage: 'en',
        translation: false,
      };

      const result = await SubmitAccountDocument(accountId, documentSubmission);
      console.log('Auto-sign result:', result);
      
      if (result.fileData?.data?.documentSubmission?.documents) {
        const submissionResults = result.fileData.data.documentSubmission.documents;
        const acceptedDocs = submissionResults.filter((doc: any) => doc.status === 'Accepted');
        const rejectedDocs = submissionResults.filter((doc: any) => doc.status !== 'Accepted');

        if (rejectedDocs.length > 0) {
          console.error('Some forms were rejected:', rejectedDocs);
          toast({
            title: "Partial Success",
            description: `${acceptedDocs.length} forms auto-signed, ${rejectedDocs.length} rejected.`,
            variant: "warning"
          });
        } else {
          toast({
            title: "Success",
            description: `All ${acceptedDocs.length} online forms auto-signed successfully!`,
            variant: "success"
          });
        }
      } else {
        toast({
          title: "Success",
          description: "Online forms auto-signed successfully!",
          variant: "success"
        });
      }

    } catch (error: any) {
      console.error('Auto-sign error:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to auto-sign online forms.",
        variant: "destructive"
      });
    } finally {
      setIsAutoSigning(false);
      fetchData();
    }
  }

  if (!pendingTasks) return <LoadingComponent />;

  return (
    <div className="relative">
      <Card aria-busy={isSubmitting || isAutoSigning}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ClipboardList className="h-5 w-5 mr-2 text-primary"/>Pending Tasks
          </CardTitle>
          <CardDescription>Overview of account pending tasks.</CardDescription>
        </CardHeader>
        <CardContent>
        <div className="space-y-4">
          <DetailItem label="Overall Status" value={pendingTasks.description} />
          <DetailItem label="Current State" value={pendingTasks.state} />
          <DetailItem label="Tasks Present" value={pendingTasks.pendingTaskPresent ? "Yes" : "No"} />
          
          {/* Auto-sign Online Forms Button - Only show if there are tasks that can be auto-signed */}
          {(!pendingTasks.pendingTaskPresent || 
            (pendingTasks.pendingTasks && pendingTasks.pendingTasks.some(task => 
              !formsToIgnore.includes(task.formNumber.toString()) && 
              !manualUploadFormNumbers.includes(task.formNumber.toString())
            ))
          ) && (
            <div className="pt-4 border-t">
              <LoaderButton
                onClick={handleAutoSignOnlineForms}
                isLoading={isAutoSigning}
                text="Auto-Sign All Online Forms"
                className="w-full bg-success text-background hover:bg-success/90"
              />
              <p className="text-xs text-subtitle mt-2 text-center">
                This will automatically sign {ONLINE_FORMS.length} standard online forms to prevent pending tasks
              </p>
            </div>
          )}

          {pendingTasks.pendingTaskPresent && pendingTasks.pendingTasks?.length > 0 && (
            <div className="space-y-4 pt-3">
              {/* Manual Upload Forms Section */}
              {pendingTasks.pendingTasks.some(task => manualUploadFormNumbers.includes(task.formNumber.toString())) && (
                <div className="space-y-3">
                  <h4 className="text-md font-semibold text-warning flex items-center gap-2">
                    <FileCheck className="h-4 w-4" />
                    Document Upload Required:
                  </h4>
                  {pendingTasks.pendingTasks
                    .filter(task => manualUploadFormNumbers.includes(task.formNumber.toString()))
                    .map((task: PendingTask, index: number) => (
                      <Card key={`manual-${task.formNumber}-${task.taskNumber}-${index}`} className="p-3 bg-warning/10 border-warning/20 shadow-sm">
                        <div className="flex items-center gap-3">
                          <FileCheck className="h-5 w-5 text-warning" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold">{task.formName} (Form: {task.formNumber})</p>
                            <div className="flex-col">
                              <p className="text-xs">{task.requiredForApproval ? "Required for Approval" : "Not Required for Approval"}</p>
                              <p className="text-xs text-warning font-medium">This form requires manual document upload and cannot be auto-signed.</p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              )}

              {/* Regular Pending Tasks Section */}
              {pendingTasks.pendingTasks.some(task => 
                !formsToIgnore.includes(task.formNumber.toString()) && 
                !manualUploadFormNumbers.includes(task.formNumber.toString())
              ) && (
                <div className="space-y-3">
                  <h4 className="text-md font-semibold text-muted-foreground">Other Pending Tasks:</h4>
                  {pendingTasks.pendingTasks
                    .filter(task => 
                      !formsToIgnore.includes(task.formNumber.toString()) && 
                      !manualUploadFormNumbers.includes(task.formNumber.toString())
                    )
                    .map((task: PendingTask, index: number) => (
                      <Card key={`regular-${task.formNumber}-${task.taskNumber}-${index}`} className="p-3 bg-muted/20 border shadow-sm flex items-center gap-3">
                        <Checkbox
                          id={`complete-task-${task.formNumber}-${task.taskNumber}-${index}`}
                          checked={false}
                          onCheckedChange={() => handleCompleteTask(task)}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{task.formName} (Form: {task.formNumber})</p>
                          <div className="flex-col">
                            <p className="text-xs">{task.requiredForApproval ? "Required for Approval" : "Not Required for Approval"}</p>
                            {taxForms.includes(task.formNumber.toString()) && (
                              <p className="text-xs text-warning">This form is a tax form and will be submitted to Interactive Brokers.</p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              )}

              {/* Ignored Forms Section */}
              {pendingTasks.pendingTasks.some(task => formsToIgnore.includes(task.formNumber.toString())) && (
                <div className="space-y-3">
                  <h4 className="text-md font-semibold text-muted-foreground">Ignored Forms:</h4>
                  {pendingTasks.pendingTasks
                    .filter(task => formsToIgnore.includes(task.formNumber.toString()))
                    .map((task: PendingTask, index: number) => (
                      <Card key={`ignored-${task.formNumber}-${task.taskNumber}-${index}`} className="p-3 bg-muted/20 border shadow-sm flex items-center gap-3 opacity-60">
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{task.formName} (Form: {task.formNumber})</p>
                          <div className="flex-col">
                            <p className="text-xs">This form is ignored and will not be attached.</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
        </CardContent>
      </Card>
      {(isSubmitting || isAutoSigning) && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <LoadingComponent />
        </div>
      )}
    </div>
  );
}
