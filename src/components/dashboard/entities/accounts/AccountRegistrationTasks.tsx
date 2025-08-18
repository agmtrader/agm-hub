'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingComponent from '@/components/misc/LoadingComponent';
import { LabelValue } from '../applications/ApplicationPage';
import { GetRegistrationTasksByAccountID } from '@/utils/entities/account';
import { RegistrationTask, RegistrationTasksResponse } from '@/lib/entities/account';
import { ListChecks, PenTool, CheckSquare, UploadCloud, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Props {
  accountId: string;
}

export function AccountRegistrationTasks({ accountId }: Props) {
  const [registrationTasksData, setRegistrationTasksData] = useState<RegistrationTasksResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Categorize tasks for prettier UI similar to pending tasks component
  const registrationTasks: RegistrationTask[] = registrationTasksData?.registrationTasks || [];
  const completedTasks = registrationTasks.filter(task => task.isCompleted);
  const tasksToSign = registrationTasks.filter(task => !task.isCompleted && task.action === "to sign");
  const tasksToComplete = registrationTasks.filter(task => !task.isCompleted && task.action === "to complete");
  const tasksToSend = registrationTasks.filter(task => !task.isCompleted && task.action === "to send");
  const hasTasks = registrationTasksData?.registrationTaskPresent && registrationTasks.length > 0;

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
    <div className="relative">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ListChecks className="h-5 w-5 mr-2 text-primary" />Registration Tasks
          </CardTitle>
          <CardDescription>Overview of account registration tasks.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <LabelValue label="Overall Status" value={registrationTasksData?.description ?? "-"} />
            <LabelValue label="Current State" value={registrationTasksData?.state ?? "-"} />
            <LabelValue label="Tasks Present" value={registrationTasksData?.registrationTaskPresent ? "Yes" : "No"} />
    
            {hasTasks && (
              <div className="space-y-6 pt-3">

                {/* Tasks to Sign */}
                {tasksToSign.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-md font-semibold text-primary flex items-center gap-2">
                      <PenTool className="h-4 w-4" />
                      Tasks to Sign ({tasksToSign.length}):
                    </h4>
                    {tasksToSign.map((task, idx) => (
                      <Card key={`sign-${idx}`} className="p-3 bg-primary/10 border-primary/20 shadow-sm">
                        <div className="flex items-center gap-3">
                          <PenTool className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold">{task.formName}</p>
                            <div className="flex flex-col gap-1 text-xs">
                              <p>Action: {task.action}</p>
                              <p>{task.isRequiredForApproval ? "Required for Approval" : "Not Required for Approval"}</p>
                              <p>State: {task.state}</p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Tasks to Complete */}
                {tasksToComplete.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-md font-semibold text-warning flex items-center gap-2">
                      <CheckSquare className="h-4 w-4" />
                      Tasks to Complete ({tasksToComplete.length}):
                    </h4>
                    {tasksToComplete.map((task, idx) => (
                      <Card key={`complete-${idx}`} className="p-3 bg-warning/10 border-warning/20 shadow-sm">
                        <div className="flex items-center gap-3">
                          <CheckSquare className="h-5 w-5 text-warning" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold">{task.formName}</p>
                            <div className="flex flex-col gap-1 text-xs">
                              <p>Action: {task.action}</p>
                              <p>{task.isRequiredForApproval ? "Required for Approval" : "Not Required for Approval"}</p>
                              <p>State: {task.state}</p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Tasks to Send */}
                {tasksToSend.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-md font-semibold text-secondary flex items-center gap-2">
                      <UploadCloud className="h-4 w-4" />
                      Tasks to Send ({tasksToSend.length}):
                    </h4>
                    {tasksToSend.map((task, idx) => (
                      <Card key={`send-${idx}`} className="p-3 bg-secondary/10 border-secondary/20 shadow-sm">
                        <div className="flex items-center gap-3">
                          <UploadCloud className="h-5 w-5 text-secondary" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold">{task.formName}</p>
                            <div className="flex flex-col gap-1 text-xs">
                              <p>Action: {task.action}</p>
                              <p>{task.isRequiredForApproval ? "Required for Approval" : "Not Required for Approval"}</p>
                              <p>State: {task.state}</p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Completed Tasks */}
                {completedTasks.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-md font-semibold text-success flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Completed Tasks ({completedTasks.length}):
                    </h4>
                    {completedTasks.map((task, idx) => (
                      <Card key={`completed-${idx}`} className="p-3 bg-success/10 border-success/20 shadow-sm">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-success" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold">{task.formName}</p>
                            <div className="flex flex-col gap-1 text-xs">
                              {task.dateCompleted && (
                                <p>Date Completed: {new Date(task.dateCompleted).toLocaleDateString()}</p>
                              )}
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
          {!registrationTasksData && (
            <p className="text-sm text-muted-foreground">Could not load registration tasks. Please try again later.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
