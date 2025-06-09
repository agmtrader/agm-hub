'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingComponent from '@/components/misc/LoadingComponent';
import { DetailItem } from './AccountPage';
import { CreateSSOSession, GetForms, GetPendingTasksByAccountID, SubmitAccountDocument } from '@/utils/entities/account';
import { DocumentSubmissionRequest, PendingTask, PendingTasksResponse } from '@/lib/entities/account';
import { ClipboardList } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatTimestamp } from '@/utils/dates';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface Props {
  accountId: string;
  accountTitle: string;
}

export function AccountPendingTasks({ accountId, accountTitle }: Props) {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingTasks, setPendingTasks] = useState<PendingTasksResponse | null>(null);

  const formsToIgnore = ["2111", "2121", "2122"];
  const taxForms = ["5001"];

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

  if (!pendingTasks) return <LoadingComponent />;

  return (
    <div className="relative">
      <Card aria-busy={isSubmitting}>
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
          {pendingTasks.pendingTaskPresent && pendingTasks.pendingTasks?.length > 0 && (
            <div className="space-y-3 pt-3">
              <h4 className="text-md font-semibold text-muted-foreground">Individual Pending Tasks:</h4>
              {pendingTasks.pendingTasks.map((task: PendingTask, idx: number) => {
                if (formsToIgnore.includes(task.formNumber.toString())) {
                  return (
                    <Card key={task.taskNumber} className="p-3 bg-muted/20 border shadow-sm flex items-center gap-3 opacity-60">
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{task.formName} (Form: {task.formNumber})</p>
                        <div className="flex-col">
                          <p className="text-xs">This form is ignored and will not be attached.</p>
                        </div>
                      </div>
                    </Card>
                  );
                }
                return (
                <Card key={task.taskNumber} className="p-3 bg-muted/20 border shadow-sm flex items-center gap-3">
                  <Checkbox
                    id={`complete-task-${task.taskNumber}`}
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
              );
              })}
            </div>
          )}
        </div>
        </CardContent>
      </Card>
      {isSubmitting && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <LoadingComponent />
        </div>
      )}
      <Button
        onClick={() => {
          CreateSSOSession()
        }}
      >
        Create SSO Session
      </Button>
    </div>
  );
}
