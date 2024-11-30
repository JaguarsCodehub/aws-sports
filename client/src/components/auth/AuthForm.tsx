'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import routes from '@/lib/routes';

type FormData = {
  email: string;
  password: string;
};

function parseJwt(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
  );
  return JSON.parse(jsonPayload);
}

export function AuthForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<FormData>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('http://localhost:8000/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const result = await response.json();
      const token = result.token;

      const decodedToken = parseJwt(token);

      await login({
        id: decodedToken.sub,
        email: decodedToken.email,
        token: token,
        role: decodedToken['custom:role']
      });

      router.push(routes.events.participantList);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Card className='w-[450px]'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>{isLogin ? 'Login' : 'Register'}</CardTitle>
        <CardDescription>
          {isLogin ? 'Welcome back!' : 'Create your account'}
        </CardDescription>
      </CardHeader>
      <CardContent className='bg-white/90 backdrop-blur-lg'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base'>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='email@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full'>
              {isLogin ? 'Login' : 'Register'}
            </Button>
          </form>
        </Form>
        <div className="mt-4 flex gap-2">
          <Button
            variant='link'
            className='w-full'
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Register"
              : 'Already have an account? Login'}
          </Button>

          {/* {isLogin && (
            <Button
              variant='link'
              className='w-full'
              onClick={() => router.push(routes.auth.organizer)}
            >
              Register as Organizer
            </Button>
          )} */}
        </div>
      </CardContent>
    </Card>
  );
}
