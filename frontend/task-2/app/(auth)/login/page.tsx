'use client';

import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import { Hotel } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/30 via-background to-background px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-2">
          <CardHeader className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold mb-2">
              <Hotel className="w-8 h-8 text-primary" />
              HotelBooking
            </Link>
            <CardTitle className="text-3xl">Welcome Back</CardTitle>
            <CardDescription className="text-base">
              Sign in to continue to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              For testing, use any username/password (DummyJSON API)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
