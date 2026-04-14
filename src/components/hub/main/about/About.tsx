'use client'
import React, { useRef } from 'react'
import Iphone15Pro from '@/components/ui/iphone-15-pro'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion'

const About = () => {

  const { t } = useTranslationProvider();
  
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  // Offset to account for the negative inset (inset-48 = 12rem = 192px)
  const bgX = useTransform(mouseX, (value) => value + 192);
  const bgY = useTransform(mouseY, (value) => value + 192);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    x.set(clientX - left);
    y.set(clientY - top);
  }

  return (
    <div className='container w-full flex flex-col-reverse items-center justify-center gap-12 px-4 lg:flex-row lg:gap-16'>
        <div className="flex flex-col items-center justify-center gap-8">
            <h2 className="text-center text-4xl font-bold tracking-tighter text-foreground md:text-5xl">
                {t('main.about.title')}
            </h2>
            <div 
                ref={ref}
                className='relative group flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-3 rounded-xl p-4'
                onMouseMove={handleMouseMove}
            >
                <motion.div
                    className="pointer-events-none absolute -inset-48 rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                    style={{
                        background: useMotionTemplate`
                            radial-gradient(
                                120px circle at ${bgX}px ${bgY}px,
                                rgba(242, 108, 13, 0.3),
                                transparent 80%
                            )
                        `,
                    }}
                />
                <span className='relative z-10 text-lg font-semibold text-foreground md:text-2xl'>
                    {t('main.about.assets.0')}
                </span>
                <span className='relative z-10 text-lg font-semibold text-foreground md:text-2xl'>
                    {t('main.about.assets.1')}
                </span>
                <span className='relative z-10 text-lg font-semibold text-foreground md:text-2xl'>
                    {t('main.about.assets.2')}
                </span>
                <span className='relative z-10 text-lg font-semibold text-foreground md:text-2xl'>
                    {t('main.about.assets.3')}
                </span>
                <span className='relative z-10 text-lg font-semibold text-foreground md:text-2xl'>
                    {t('main.about.assets.4')}
                </span>
                <span className='relative z-10 text-lg font-semibold text-foreground md:text-2xl'>
                    {t('main.about.assets.5')}
                </span>
                <span className='relative z-10 text-lg font-semibold text-foreground md:text-2xl'>
                    {t('main.about.assets.6')}
                </span>
                <span className='relative z-10 text-lg font-semibold text-foreground md:text-2xl'>
                    {t('main.about.assets.7')}
                </span>
            </div>
            <div className='flex max-w-3xl flex-col gap-4'>
                <p className='text-center text-base text-foreground md:text-lg'>
                    {t('main.about.description')}
                </p>
                <p className='text-center text-base text-foreground md:text-lg'>
                    {t('main.about.description_2')}
                </p>
            </div>
        </div>
        <Iphone15Pro
            className='h-[26rem] sm:h-[32rem] lg:h-[40rem]'
            src='/assets/products/iphone-app.png'
            style={{ transform: 'perspective(1000px) rotateY(-15deg) rotateZ(0deg)' }}
        />
    </div>
  )
}

export default About
