import Confetti from "@/components/ui/confetti"
import { Check } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const FinalPage = () => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='relative h-full w-full flex flex-col justify-center items-center gap-y-8 py-16'
      >
        <Confetti/>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <Check className='w-24 h-24 text-green-500' />
        </motion.div>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className='text-2xl font-semibold text-gray-700'
        >
          You have successfully opened a new account.
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className='flex flex-col items-center gap-y-4'
        >
          <Button asChild>
            <Link href='/dashboard/open-account'>Open another account</Link>
          </Button>
          <Button variant='ghost' asChild>
            <Link href='/'>Go back home</Link>
          </Button>
        </motion.div>
      </motion.div>
    )
}

export default FinalPage