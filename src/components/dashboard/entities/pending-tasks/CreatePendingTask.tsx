'use client'
import React, { useMemo, useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { pending_task_schema, pending_task_follow_up_schema } from '@/lib/entities/schemas/pending_task'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CreatePendingTask as CreatePendingTaskAPI } from '@/utils/entities/pending_task'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { DateTimePicker } from '@/components/ui/datetime-picker'
import { formatTimestamp } from '@/utils/dates'
import { PendingTaskPayload, PendingTaskFollowUpPayload } from '@/lib/entities/pending_task'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { getDefaults } from '@/utils/form'
import { Account } from '@/lib/entities/account'
import { ReadAccounts } from '@/utils/entities/account'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'

interface Props {
  refreshTasks?: () => void
}

const CreatePendingTask = ({ refreshTasks }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [newTag, setNewTag] = useState('')
  const { t } = useTranslationProvider()

  useEffect(() => {
    ReadAccounts().then(setAccounts).catch(() => null)
  }, [])

  const formSchema = z.object({
    ...pending_task_schema.shape,
    follow_ups: z.array(pending_task_follow_up_schema),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...getDefaults(pending_task_schema),
      tags: [],
      follow_ups: [
        {
          date: new Date(),
          description: '',
          completed: false,
        },
      ],
    } as any,
  })

  const { fields, append, remove } = useFieldArray({
    name: 'follow_ups',
    control: form.control,
  })

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true)
    try {
      const followUps: PendingTaskFollowUpPayload[] = values.follow_ups.map((fu: any) => ({
        date: fu.date,
        description: fu.description,
        completed: fu.completed || false,
      }))

      const pendingTask: PendingTaskPayload = {
        priority: values.priority,
        account_id: values.account_id,
        description: values.description,
        date: formatTimestamp(new Date()),
        closed: false,
        tags: (values.tags && Array.isArray(values.tags)) ? values.tags : [],
      }

      await CreatePendingTaskAPI(pendingTask, followUps)
      toast({ title: 'Success', description: 'Pending task created', variant: 'success' })
      refreshTasks?.()
      form.reset()
      setIsOpen(false)
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to create', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const SUGGESTED_TAGS = useMemo(() => [
    'funding',
    'account',
    'kyc',
    'documents',
    'compliance',
    'misc',
  ], [])

  const addTag = (tag: string) => {
    const current = form.getValues('tags') || []
    const normalized = tag.trim().toLowerCase()
    if (!normalized) return
    if (!current.includes(normalized)) {
      form.setValue('tags', [...current, normalized], { shouldDirty: true, shouldTouch: true })
    }
    setNewTag('')
  }

  const removeTag = (tag: string) => {
    const current = form.getValues('tags') || []
    form.setValue('tags', current.filter((t: string) => t !== tag), { shouldDirty: true, shouldTouch: true })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-background hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" /> Create Task
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Pending Task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="account_id"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormLabel>Account</FormLabel>
                    <FormMessage />
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button role="combobox" variant="form">
                          {field.value
                            ? (accounts.find(a => a.id === field.value)?.ibkr_account_number || field.value)
                            : ''}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Command>
                        <CommandList>
                          <CommandInput placeholder={t('forms.search')} />
                          <CommandEmpty>{t('forms.no_results')}</CommandEmpty>
                          <CommandGroup>
                            {accounts.map(acc => (
                              <CommandItem
                                key={acc.id}
                                value={acc.ibkr_account_number || acc.id}
                                onSelect={() => {
                                  form.setValue('account_id', acc.id)
                                }}
                              >
                                {acc.ibkr_account_number || acc.id}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[100px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={1} max={3} />
                  </FormControl>  
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a tag (e.g., funding, account)"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addTag(newTag)
                          }
                        }}
                      />
                      <Button type="button" variant="outline" onClick={() => addTag(newTag)}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(field.value || []).map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="px-2 py-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs">{tag}</span>
                            <Button type="button" variant="ghost" size="icon" className="h-5 w-5" onClick={() => removeTag(tag)}>×</Button>
                          </div>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_TAGS.map(t => (
                        <Button key={t} type="button" variant="outline" size="sm" onClick={() => addTag(t)}>
                          {t}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Follow-ups</FormLabel>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ date: new Date(), description: '', completed: false })}>
                  <Plus className="h-4 w-4 mr-2" /> Add Follow-up
                </Button>
              </div>
              {fields.map((fieldItem, index) => (
                <Card key={fieldItem.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-4">
                      <FormField
                        control={form.control}
                        name={`follow_ups.${index}.date` as const}
                        render={({ field: dateField }) => (
                          <FormItem>
                            <FormLabel>Follow-up Date</FormLabel>
                            <FormControl>
                              <DateTimePicker value={dateField.value} onChange={dateField.onChange} granularity="minute" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`follow_ups.${index}.description` as const}
                        render={({ field: descField }) => (
                          <FormItem>
                            <FormLabel>Follow-up Description</FormLabel>
                            <FormControl>
                              <Textarea {...descField} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`follow_ups.${index}.completed` as const}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">Mark as completed</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    {fields.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <Button type="submit" className="w-full bg-primary text-background hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                </>
              ) : (
                'Create Task'
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreatePendingTask
