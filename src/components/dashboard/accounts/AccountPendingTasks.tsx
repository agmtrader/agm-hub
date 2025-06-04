'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingComponent from '@/components/misc/LoadingComponent';
import { DetailItem } from './AccountPage';
import { GetPendingTasksByAccountID, buildDocumentSubmissionRequest } from '@/utils/entities/account';
import { PendingTask, PendingTasksResponse } from '@/lib/entities/account';
import { ClipboardList } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Props {
  accountId: string;
}

export function AccountPendingTasks({ accountId }: Props) {
  
  const [pendingTasksData, setPendingTasksData] = useState<PendingTasksResponse | null>(null);

  useEffect(() => {
    const fetchPendingTasks = async () => {
      try {
        const data = await GetPendingTasksByAccountID(accountId);
        setPendingTasksData(data);
      } catch (error) {
        console.error('Error fetching pending tasks:', error);
        toast({
          title: "Error",
          description: "Failed to fetch pending tasks. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchPendingTasks();
  }, [accountId]);

  if (!pendingTasksData) return <LoadingComponent />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ClipboardList className="h-5 w-5 mr-2 text-primary"/>Pending Tasks
        </CardTitle>
        <CardDescription>Overview of account pending tasks.</CardDescription>
      </CardHeader>
      <CardContent>
      <div className="space-y-4">
        <DetailItem label="Overall Status" value={pendingTasksData.description} />
        <DetailItem label="Current State" value={pendingTasksData.state} />
        <DetailItem label="Tasks Present" value={pendingTasksData.pendingTaskPresent ? "Yes" : "No"} />
        
        {pendingTasksData.pendingTaskPresent && pendingTasksData.pendingTasks?.length > 0 && (
          <div className="space-y-3 pt-3">
            <h4 className="text-md font-semibold text-muted-foreground">Individual Pending Tasks:</h4>
            {pendingTasksData.pendingTasks.map((task: PendingTask, idx: number) => (
              <Card key={idx} className="p-3 bg-muted/20 border shadow-sm">
                <p className="text-sm font-semibold mb-1.5">{task.formName} (Form: {task.formNumber})</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <p className="text-xs">{task.requiredForApproval ? "Required for Approval" : "Not Required for Approval"}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
        <div className="pt-4">
          <button
            className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/90 transition"
            onClick={() => {
              const structure = buildDocumentSubmissionRequest(pendingTasksData, accountId);
              console.log('documentSubmission structure:', structure);
            }}
            type="button"
          >
            Print documentSubmission Structure
          </button>
        </div>
      </div>
      </CardContent>
    </Card>
  );
}
