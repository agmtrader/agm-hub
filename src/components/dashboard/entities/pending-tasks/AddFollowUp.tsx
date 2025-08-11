'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { pending_task_follow_up_schema } from '@/lib/entities/schemas/pending_task'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { DateTimePicker } from '@/components/ui/datetime-picker'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { CreatePendingTaskFollowUp } from '@/utils/entities/pending_task'
import { toast } from '@/hooks/use-toast'
import { formatTimestamp } from '@/utils/dates'
import { Plus, Loader2 } from 'lucide-react'

interface Props {
  taskId: string
  onSuccess?: () => void
}

const AddFollowUp = ({ taskId, onSuccess }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(pending_task_follow_up_schema),
    defaultValues: {
      date: new Date(),
      description: '',
      completed: false,
    },
  })

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true)
    try {
      const followUpPayload = {
        ...values,
        date: formatTimestamp(values.date),
      }

      await CreatePendingTaskFollowUp(taskId, followUpPayload)

      toast({
        title: 'Success',
        description: 'Follow-up added successfully',
        variant: 'success',
      })

      onSuccess?.()
      form.reset()
      setIsOpen(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add follow-up',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Follow-up
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Follow-up</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <DateTimePicker value={field.value} onChange={field.onChange} granularity="minute" />
                  </FormControl>
                  <FormMessage />
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
              name="completed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">Mark as completed</FormLabel>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-primary text-background hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                </>
              ) : (
                'Add Follow-up'
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddFollowUp
