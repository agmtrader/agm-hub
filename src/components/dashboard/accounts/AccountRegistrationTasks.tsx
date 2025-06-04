'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingComponent from '@/components/misc/LoadingComponent';
import { DetailItem } from './AccountPage';
import { GetRegistrationTasksByAccountID } from '@/utils/entities/account';
import { RegistrationTask, RegistrationTasksResponse } from '@/lib/entities/account';
import { ListChecks } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Props {
  accountId: string;
}

export function AccountRegistrationTasks({ accountId }: Props) {
  const [registrationTasksData, setRegistrationTasksData] = useState<RegistrationTasksResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrationTasks = async () => {
      try {
        const data = await GetRegistrationTasksByAccountID(accountId);
        setRegistrationTasksData(data);
      } catch (error) {
        console.error('Error fetching registration tasks:', error);
        toast({
          title: "Error",
          description: "Failed to fetch registration tasks. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistrationTasks();
  }, [accountId]);

  if (isLoading) return <LoadingComponent />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ListChecks className="h-5 w-5 mr-2 text-primary"/>Registration Tasks
        </CardTitle>
        <CardDescription>Overview of account registration tasks.</CardDescription>
      </CardHeader>
      <CardContent>
        {registrationTasksData ? (
          <div className="space-y-4">
            <DetailItem label="Overall Status" value={registrationTasksData.description} />
            <DetailItem label="Current State" value={registrationTasksData.state} />
            <DetailItem label="Tasks Present" value={registrationTasksData.registrationTaskPresent ? "Yes" : "No"} />
            
            {registrationTasksData.registrationTaskPresent && registrationTasksData.registrationTasks?.length > 0 && (
              <div className="space-y-3 pt-3">
                <h4 className="text-md font-semibold text-muted-foreground">Individual Registration Tasks:</h4>
                {registrationTasksData.registrationTasks.map((task: RegistrationTask, idx: number) => (
                  <Card key={idx} className="p-3 bg-muted/20 border shadow-sm">
                    <p className="text-sm font-semibold mb-1.5">{task.formName} (Form: {task.formName}, Task: {task.isCompleted ? "Completed" : "Not Completed"})</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <DetailItem label="Action Required" value={task.action} />
                      <DetailItem label="Current Task State" value={task.state} />
                      <DetailItem 
                        label="Required for Approval"
                        value={<Badge variant={task.isRequiredForApproval ? "destructive" : "outline"}>{task.isRequiredForApproval ? "Yes" : "No"}</Badge>}
                      />
                      {task.dateCompleted && <DetailItem label="Date Completed" value={new Date(task.dateCompleted).toLocaleDateString()} />}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Could not load registration tasks. Please try again later.</p>
        )}
      </CardContent>
    </Card>
  );
}
