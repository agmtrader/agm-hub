"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


const languages = [
{ label: "Mr.", value: "mr" },
{ label: "Ms.", value: "ms" },
{ label: "Mrs.", value: "mrs" },
{ label: "Dr.", value: "dr" },
] as const

const formSchema = z.object({

  salutation: z.string().min(1, {
    message: "Salutation cannot be empty.",
  }),

  first_name: z.string().min(1, {
    message: "First name cannot be empty.",
  }),

  middle_name: z.string().optional().transform(e => e === "" ? undefined : e),

  last_name: z.string().min(1, {
    message: "Last name cannot be empty.",
  }),

})

interface Props {
  stepForward:() => void,
  setCanContinue?:React.Dispatch<React.SetStateAction<boolean>>,
  stepBackwards?:() => void
}

const AboutYouPrimary = ({stepForward, setCanContinue, stepBackwards}:Props) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salutation: '',
      first_name: '',
      middle_name: '',
      last_name: '',
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const ticket = {'ApplicationInfo':values}
    console.log(ticket)
  }

  return (
      <div className="h-full w-full flex flex-col justify-center items-center gap-y-5">
        <h1 className='text-7xl font-bold'>About you</h1>
        <h1 className='text-3xl font-light'>Primary holder</h1>
        <Form {...form}>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 text-center flex flex-col justify-center items-center">

          <FormField
              control={form.control}
              name="salutation"
              render={({ field }) => (
                <FormItem className="flex flex-col  justify-center">
                  <FormLabel>Salutation</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] text-sm justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? languages.find(
                                (language) => language.value === field.value
                              )?.label
                            : "Select a country"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandList>
                          <CommandInput
                            placeholder="Search countries..."
                            className="h-9"
                          />
                          <CommandEmpty>No country found.</CommandEmpty>
                          <CommandGroup>
                            {languages.map((language) => (
                              <CommandItem
                                value={language.label}
                                key={language.value}
                                onSelect={() => {
                                  form.setValue("salutation", language.value)
                                }}
                              >
                                {language.label}
                              </CommandItem>
                            ))}

                          </CommandGroup>
                          </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                    <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
              control={form.control}
              name="middle_name"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Middle name</FormLabel>
                <FormControl>
                    <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                    <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <Button className="bg-agm-light-orange" type="submit">
              Next step
            </Button>

            <Button className="bg-agm-light-orange" onClick={stepBackwards}>
              Previous step
            </Button>


          </form>
        </Form>
      </div>
    )
}

export default AboutYouPrimary
  