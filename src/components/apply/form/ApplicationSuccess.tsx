import Confetti from "@/components/ui/confetti"
import { Check } from "lucide-react"
import Link from "next/link"
import { Button } from '@/components/ui/button'

// Success component for the final step
const ApplicationSuccess = () => {
    return (
        <div className='relative h-full w-full flex flex-col justify-center items-center gap-y-8 py-16'>
        <Confetti
            className="absolute left-0 top-0 -z-10 size-full pointer-events-none"
        />
        <Check className='w-24 h-24 text-success' />
        <p className='text-2xl font-semibold text-foreground'>Application Submitted Successfully!</p>
        <div className='flex flex-col items-center gap-y-4'>
            <p className='text-lg text-subtitle'>Your IBKR application has been submitted and is being processed.</p>
            <p className='text-sm text-subtitle'>You will receive a confirmation email shortly with next steps.</p>
        </div>
        <div className='flex gap-4'>
            <Button>
            <Link href='/'>Go Back Home</Link>
            </Button>
        </div>
        </div>
    )
}

export default ApplicationSuccess