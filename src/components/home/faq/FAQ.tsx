import React from 'react'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"


type Props = {}

function FAQ({}: Props) {
  return (
    <div className='w-full h-full flex flex-col justify-center gap-y-16 items-center'>
      <p className='text-5xl text-center font-bold'>Frequently Asked Questions</p>
        <Accordion type="single" collapsible className="w-[80%] text-start">
            <AccordionItem value="item-1" >
                <AccordionTrigger>
                    <p className='text-sm font-bold'>How to create a savings/investment account?</p>
                </AccordionTrigger>
                <AccordionContent>
                    <p className='text-sm font-light'></p>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>
                    <p className='text-sm font-bold'>What security measures do you offer?</p>
                </AccordionTrigger>
                <AccordionContent>
                    <p className='text-sm font-light'>
                        Accounts are insured under the SIPC (Securities Investor 
                        Protection Corporation) and FINRA (Financial Industry 
                        Regulatory Authority in the United States).
                    </p>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>
                    <p className='text-sm font-bold'>What types of accounts are available at AGM?</p>
                </AccordionTrigger>
                <AccordionContent>
                    <p className='text-sm font-light'>
                        Individual, joint, and corporate accounts. We serve both 
                        institutional and individual clients internationally.
                    </p>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
                <AccordionTrigger>
                    <p className='text-sm font-bold'>Where does my money go?</p>
                </AccordionTrigger>
                <AccordionContent>
                    <p className='text-sm font-light'>
                        After opening your account and making an initial 
                        savings/investment deposit, the money goes to 
                        your AGM account, which you can access and monitor 24/7.
                    </p>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
                <AccordionTrigger>
                    <p className='text-sm font-bold'>Are there any taxes to consider?</p>
                </AccordionTrigger>
                <AccordionContent>
                    <p className='text-sm font-light'>
                        There are no taxes on the accounts.
                    </p>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
                <AccordionTrigger>
                    <p className='text-sm font-bold'>Who can move the money in each account?</p>
                </AccordionTrigger>
                <AccordionContent>
                    <p className='text-sm font-light'>
                        Only the account owner, the first designated 
                        person, can be responsible for moving the money.
                    </p>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
  )
}

export default FAQ