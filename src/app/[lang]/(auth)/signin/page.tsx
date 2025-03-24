"use client";
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatURL } from '@/utils/language/lang';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { FaGoogle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/anims';

function SignIn() {

  const { lang, t } = useTranslationProvider()

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const {toast} = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
      callbackUrl: callbackUrl ? formatURL(callbackUrl, lang) : formatURL('/', lang),
    });
    if (result?.ok) {
      router.push(callbackUrl ? formatURL(callbackUrl, lang) : formatURL('/', lang));
    } else {
      toast({
        title: 'Error',
        description: 'Invalid username or password',
        variant: 'destructive'
      })
    }
    setIsLoading(false);
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn('google', {
      callbackUrl: callbackUrl ? formatURL(`/onboarding?callbackUrl=${encodeURIComponent(callbackUrl)}`, lang) : formatURL('/onboarding', lang),
    });
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className='flex items-center h-full justify-center'
    >
      <Card className='w-full max-w-xl p-8'>
        <motion.div variants={itemVariants}>
          <CardHeader className='flex flex-col justify-center items-center gap-2'>
            <Image src='/assets/brand/agm-logo.png' alt='AGM Logo' width={200} height={200} />
            <CardTitle className='text-center font-bold text-3xl'>{t('signin.title')}</CardTitle>
            {callbackUrl === formatURL(`/apply`, lang) && (
              <div className='flex flex-col gap-2 bg-error/20 p-2 rounded-md items-center justify-center'>
                <p className='text-sm text-subtitle text-center'>{t('signin.apply.message')}</p>
              </div>
            )}
          </CardHeader>
        </motion.div>
        <motion.div variants={itemVariants} className='w-full'>
          <CardContent className='w-full'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>
              <Input
                type="text"
                placeholder={t('signin.username')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
              <Input
                type="password"
                placeholder={t('signin.password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('signin.signingIn')}
                  </>
                ) : (
                  t('signin.signin')
                )}
              </Button>
              <p className='text-subtitle text-lg text-center'>
                {t('signin.register.message')} <Link href={formatURL('/create-account', lang)} className='underline text-primary font-bold'>{t('signin.register.link')}</Link>
              </p>
            </form>
            <div className='flex items-center gap-4 justify-center'>
              <Separator className='my-4 w-[40%]' />
              <p className='text-subtitle text-sm'>{t('signin.or')}</p>
              <Separator className='my-4 w-[40%]' />
            </div>
            { process.env.DEV_MODE === 'true' && (
              <Button
                variant='ghost'
                onClick={handleGoogleSignIn}
                className="w-full mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('signin.signingIn')}
                  </>
                ) : (
                  <div className='flex items-center gap-2'>
                    <FaGoogle className='h-4 w-4' />
                    {t('signin.google')}
                  </div>
                )}
              </Button>
            )}
          </CardContent>
        </motion.div>
      </Card>
    </motion.div>
  )
}

export default SignIn;