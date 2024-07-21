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
                    <p className='text-sm font-bold'>¿Cómo crear una cuenta de ahorro/inversión?</p>
                </AccordionTrigger>
                <AccordionContent>
                    <p className='text-sm font-light'>Yes. It adheres to the WAI-ARIA design pattern.</p>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>
                    <p className='text-sm font-bold'>¿Qué medidas de seguridad ofrecen?</p>
                </AccordionTrigger>
                <AccordionContent>
                    <p className='text-sm font-light'>
                        Cuentas aseguradas sobre el SIPC (Securities, Investor, 
                        Protection Corporation) y FINRA (Ente regulador de los mercados 
                        financieros en Estados Unidos).
                    </p>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>
                    <p className='text-sm font-bold'>Qué tipos de cuentas existen en AGM?</p>
                </AccordionTrigger>
                <AccordionContent>
                    <p className='text-sm font-light'>
                        Individuales, mancomunadas y 
                        corporativas. Atendemos clientes 
                        tanto institucionales como individuales a nivel internacional.
                    </p>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
                <AccordionTrigger>
                    <p className='text-sm font-bold'>¿Dónde ingresa mi dinero?</p>
                </AccordionTrigger>
                <AccordionContent>
                    <p className='text-sm font-light'>
                        Luego de abrir su cuenta y realizar un primer 
                        depósito de ahorro/iniversión, el dinero llega a 
                        su cuenta de AGM, en la cual entrá acceso y monitoreo las 24h.
                    </p>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
                <AccordionTrigger>
                    <p className='text-sm font-bold'>¿Hay impuestos que deban considerarse?</p>
                </AccordionTrigger>
                <AccordionContent>
                    <p className='text-sm font-light'>
                        No hay impuestos sobre las cuentas.
                    </p>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
                <AccordionTrigger>
                    <p className='text-sm font-bold'>¿Quién puede mover el dinero en cada cuenta?</p>
                </AccordionTrigger>
                <AccordionContent>
                    <p className='text-sm font-light'>
                        Únicamente el propietario de la cuenta, la primera 
                        persona designada, puede ser el encargado de mover el dinero.
                    </p>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
  )
}

export default FAQ