"use client";
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatURL } from '@/utils/lang';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';

function SignIn() {

  const { lang } = useTranslationProvider()

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
  };

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <Card className='w-96 h-fit gap-5 flex flex-col justify-center items-center'>
        <CardHeader className='flex flex-col gap-2'>
        <CardTitle className='text-center text-3xl' >Sign In</CardTitle>
        <div className='flex flex-col gap-2 bg-error/20 p-2 rounded-md items-center justify-center'>
            <p className='text-sm text-subtitle text-center'>You must create an AGM Hub account to apply for an account, see your personal dashboard and more services.</p>
            <Link 
              href={
                callbackUrl ? 
                formatURL(`/create-account?callbackUrl=${encodeURIComponent(callbackUrl)}`, lang) 
                : 
                formatURL('/create-account', lang)
              } 
              className='underline text-subtitle font-bold'
            >
              Create an account
            </Link> 
        </div>
      </CardHeader>
      <CardContent className='w-full'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Or continue with
        </div>
        <Button
          variant='ghost'
          onClick={handleGoogleSignIn}
          className="w-full mt-4"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing In...
            </>
          ) : (
            'Sign in with Google'
          )}
        </Button>
      </CardContent>
    </Card>
    </div>
  );
}

export default SignIn;