import Confetti from "@/components/ui/confetti"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Check } from "lucide-react"

const ApplicationEnd = () => {
    return (
      <div className='relative h-full w-full flex flex-col justify-center items-center gap-y-8 py-16'>
        <Confetti
          className="absolute left-0 top-0 -z-10 size-full pointer-events-none"
        />
        <Check className='w-24 h-24 text-green-500' />
        <p className='text-2xl font-semibold text-gray-700'>Your application has been successfully submitted.</p>
        <div className='flex flex-col items-center gap-y-4'>
          <p className='text-lg text-gray-600'>Thank you for choosing our services. We'll review your application and get back to you soon.</p>
        </div>
        <Button>
          <Link href='/apply'>Apply for another account</Link>
        </Button>
        <Button variant='ghost'>
          <Link href='/'>Go back home</Link>
        </Button>
      </div>
    )
  }

export default ApplicationEnd