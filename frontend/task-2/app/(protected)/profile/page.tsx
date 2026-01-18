'use client';

import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { getStoredUser, removeStoredToken } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { User, Mail, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { StoredUser } from '@/lib/auth';

function ProfileContent() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const handleLogout = () => {
    removeStoredToken();
    router.push('/');
    router.refresh();
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Profile
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your account information
          </p>
        </div>

        <Card className="shadow-lg border-2">
          <CardHeader>
            <div className="flex items-center gap-6 mb-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {user.firstName} {user.lastName}
                </CardTitle>
                <CardDescription className="text-base">@{user.username}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Username
              </Label>
              <div className="px-4 py-3 bg-muted rounded-lg text-foreground font-medium">
                {user.username}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <div className="px-4 py-3 bg-muted rounded-lg text-foreground font-medium">
                {user.email}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Full Name</Label>
              <div className="px-4 py-3 bg-muted rounded-lg text-foreground font-medium">
                {user.firstName} {user.lastName}
              </div>
            </div>

            <div className="pt-6 border-t">
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-full"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Note: Profile editing is not available with DummyJSON API</p>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
