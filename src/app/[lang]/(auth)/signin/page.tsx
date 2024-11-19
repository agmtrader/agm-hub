"use client";

import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatURL } from '@/utils/lang';
import { useTranslationProvider } from '@/utils/providers/TranslationProvider';
import { useToast } from '@/hooks/use-toast';

function SignIn() {

  const { lang } = useTranslationProvider()

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {toast} = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });
    if (result?.ok) {
      router.push(formatURL('/', lang));
    } else {
      toast({
        title: 'Error',
        description: 'Invalid username or password',
        variant: 'destructive'
      })
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn('google', {
      callbackUrl: formatURL('/onboarding', lang),
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          variant="outline"
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
      </div>
    </div>
  );
}

export default SignIn;