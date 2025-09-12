'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingComponent from '@/components/misc/LoadingComponent';
import { LabelValue } from '@/components/misc/LabelValue';
import { GetForms, GetPendingTasksByAccountID, SubmitIBKRDocument, ReadAccountDetailsByAccountID } from '@/utils/entities/account';
import { DocumentSubmissionRequest, PendingTask, PendingTasksResponse } from '@/lib/entities/account';
import { ClipboardList, PenTool, CheckSquare, UploadCloud } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatTimestamp } from '@/utils/dates';
import { Checkbox } from '@/components/ui/checkbox';
import LoaderButton from '@/components/misc/LoaderButton';

interface Props {
  accountId: string;
  accountTitle: string;
}

export function AccountPendingTasks({ accountId, accountTitle }: Props) {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoSigning, setIsAutoSigning] = useState(false);
  const [pendingTasks, setPendingTasks] = useState<PendingTasksResponse | null>(null);

  // Holder names (for joint accounts we expect multiple names)
  const [holderNames, setHolderNames] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, [accountId]);

  // Fetch account holder names (to handle joint accounts)
  useEffect(() => {
    const fetchHolderNames = async () => {
      try {
        const details: any = await ReadAccountDetailsByAccountID(accountId);
        if (details && details.associatedPersons && Array.isArray(details.associatedPersons)) {
          // Extract unique full names of associated persons (first + last)
          const names: string[] = details.associatedPersons
            .map((p: any) => `${p.firstName} ${p.lastName}`.trim())
            .filter((name: string, idx: number, arr: string[]) => name && arr.indexOf(name) === idx);
          setHolderNames(names);
        } else {
          setHolderNames([]);
        }
      } catch (error) {
        console.warn('Failed to fetch account holder names:', error);
        setHolderNames([]);
      }
    };

    fetchHolderNames();
  }, [accountId]);
  
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

  async function handleSignTask(task: PendingTask) {
    setIsSubmitting(true);
    try {
      // Only allow signing tasks that are online and have "to sign" action
      if (!task.onlineTask || task.action !== "to sign") {
        throw new Error("This task cannot be auto-signed");
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
            signedBy: holderNames.length > 0 ? holderNames : [`${accountTitle}`],
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
      const result = await SubmitIBKRDocument(accountId, documentSubmission);
      console.log(result);
      if (result.fileData.data.documentSubmission.documents[0].status === 'Accepted') {
        toast({
          title: "Success",
          description: `${task.formName} signed successfully!`,
          variant: "success",
        });
      } else {
        throw new Error(result.fileData.data.documentSubmission.documents[0].status);
      }

    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to sign the task.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      fetchData();
    }
  }

  async function handleAutoSignAllSignableTasks() {
    setIsAutoSigning(true);
    try {
      if (!pendingTasks || !pendingTasks.pendingTasks) {
        throw new Error("No pending tasks found");
      }

      // Filter tasks that can be auto-signed
      const signableTasks = pendingTasks.pendingTasks.filter(
        task => task.onlineTask && task.action === "to sign"
      );

      if (signableTasks.length === 0) {
        throw new Error("No signable tasks found");
      }
      
      const timestamp = parseInt(formatTimestamp(new Date()));
      const documents = [];
      
      // Get each form individually to ensure correct file data and SHA-1
      for (const task of signableTasks) {
        try {
          const forms = await GetForms([task.formNumber.toString()]);
          if (forms && forms.formDetails.length > 0) {
            const form = forms.formDetails[0];
            const fileData = forms.fileData;
            
            documents.push({
              signedBy: holderNames.length > 0 ? holderNames : [accountTitle],
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
          console.warn(`Failed to get form ${task.formNumber}:`, formError);
          // Continue with other forms
        }
      }

      if (documents.length === 0) {
        throw new Error("No signable forms found");
      }

      // Submit all documents at once
      const documentSubmission: DocumentSubmissionRequest = {
        documents,
        accountId,
        inputLanguage: 'en',
        translation: false,
      };

      const result = await SubmitIBKRDocument(accountId, documentSubmission);
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
            description: `All ${acceptedDocs.length} signable forms auto-signed successfully!`,
            variant: "success"
          });
        }
      } else {
        toast({
          title: "Success",
          description: "Signable forms auto-signed successfully!",
          variant: "success"
        });
      }

    } catch (error: any) {
      console.error('Auto-sign error:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to auto-sign forms.",
        variant: "destructive"
      });
    } finally {
      setIsAutoSigning(false);
      fetchData();
    }
  }

  if (!pendingTasks) return <LoadingComponent />;

  // Categorize pending tasks
  const tasksToSign = pendingTasks.pendingTasks?.filter(task => task.action === "to sign") || [];
  const tasksToComplete = pendingTasks.pendingTasks?.filter(task => task.action === "to complete") || [];
  const tasksToSend = pendingTasks.pendingTasks?.filter(task => task.action === "to send") || [];
  const signableTasks = tasksToSign.filter(task => task.onlineTask);

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
          <LabelValue label="Overall Status" value={pendingTasks.description} />
          <LabelValue label="Tasks Present" value={pendingTasks.pendingTaskPresent ? "Yes" : "No"} />
          
          {/* Auto-sign All Signable Tasks Button */}
          {signableTasks.length > 0 && (
            <div className="pt-4 border-t">
              <LoaderButton
                onClick={handleAutoSignAllSignableTasks}
                isLoading={isAutoSigning}
                text="Auto-Sign All Signable Forms"
                className="w-full bg-success text-background hover:bg-success/90"
              />
              <p className="text-xs text-subtitle mt-2 text-center">
                This will automatically sign {signableTasks.length} forms that can be signed online
              </p>
            </div>
          )}

          {pendingTasks.pendingTaskPresent && pendingTasks.pendingTasks?.length > 0 && (
            <div className="space-y-6 pt-3">
              
              {/* Forms to Sign Section */}
              {tasksToSign.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-md font-semibold text-primary flex items-center gap-2">
                    <PenTool className="h-4 w-4" />
                    Forms to Sign ({tasksToSign.length}):
                  </h4>
                  {tasksToSign.map((task: PendingTask, index: number) => (
                    <Card key={`sign-${task.formNumber}-${task.taskNumber}-${index}`} className="p-3 bg-primary/10 border-primary/20 shadow-sm">
                      <div className="flex items-center gap-3">
                        {task.onlineTask ? (
                          <>
                            <Checkbox
                              id={`sign-task-${task.formNumber}-${task.taskNumber}-${index}`}
                              checked={false}
                              onCheckedChange={() => handleSignTask(task)}
                            />
                            <PenTool className="h-5 w-5 text-primary" />
                          </>
                        ) : (
                          <PenTool className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{task.formName} (Form: {task.formNumber})</p>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <p className="text-xs">{task.requiredForApproval ? "Required for Approval" : "Not Required for Approval"}</p>
                              {task.requiredForTrading && (
                                <span className="text-xs bg-warning/20 text-warning px-2 py-0.5 rounded">Required for Trading</span>
                              )}
                            </div>
                            {!task.onlineTask ? (
                              <p className="text-xs text-muted-foreground">This form cannot be signed online.</p>
                            ) : (
                              <p className="text-xs text-primary">Click to sign this form</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Forms to Complete Section */}
              {tasksToComplete.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-md font-semibold text-warning flex items-center gap-2">
                    <CheckSquare className="h-4 w-4" />
                    Forms to Complete ({tasksToComplete.length}):
                  </h4>
                  {tasksToComplete.map((task: PendingTask, index: number) => (
                    <Card key={`complete-${task.formNumber}-${task.taskNumber}-${index}`} className="p-3 bg-warning/10 border-warning/20 shadow-sm">
                      <div className="flex items-center gap-3">
                        <CheckSquare className="h-5 w-5 text-warning" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{task.formName} (Form: {task.formNumber})</p>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <p className="text-xs">{task.requiredForApproval ? "Required for Approval" : "Not Required for Approval"}</p>
                              {task.requiredForTrading && (
                                <span className="text-xs bg-error/20 text-error px-2 py-0.5 rounded">Required for Trading</span>
                              )}
                            </div>
                            <p className="text-xs text-warning font-medium">
                              This form requires additional information to be completed and cannot be auto-signed.
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Forms to Send Section */}
              {tasksToSend.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-md font-semibold text-secondary flex items-center gap-2">
                    <UploadCloud className="h-4 w-4" />
                    Forms to Send ({tasksToSend.length}):
                  </h4>
                  {tasksToSend.map((task: PendingTask, index: number) => (
                    <Card key={`send-${task.formNumber}-${task.taskNumber}-${index}`} className="p-3 bg-secondary/10 border-secondary/20 shadow-sm">
                      <div className="flex items-center gap-3">
                        <UploadCloud className="h-5 w-5 text-secondary" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{task.formName} (Form: {task.formNumber})</p>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <p className="text-xs">{task.requiredForApproval ? "Required for Approval" : "Not Required for Approval"}</p>
                              {task.requiredForTrading && (
                                <span className="text-xs bg-error/20 text-error px-2 py-0.5 rounded">Required for Trading</span>
                              )}
                            </div>
                            <p className="text-xs text-secondary font-medium">
                              This form needs to be sent manually. Please follow the instructions provided.
                            </p>
                          </div>
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
