'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, getStoredUser, removeStoredToken } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { Home, Hotel, Calendar, User, LogOut, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<ReturnType<typeof getStoredUser>>(null);

  useEffect(() => {
    const checkAuth = () => {
      setAuthenticated(isAuthenticated());
      setUser(getStoredUser());
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [pathname]);

  const handleLogout = () => {
    removeStoredToken();
    setAuthenticated(false);
    setUser(null);
    router.push('/');
    router.refresh();
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Hotel className="w-6 h-6" />
            HotelBooking
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              asChild
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
            </Button>
            <Button
              variant={isActive('/hotels') ? 'default' : 'ghost'}
              asChild
            >
              <Link href="/hotels">
                <Hotel className="w-4 h-4 mr-2" />
                Hotels
              </Link>
            </Button>
            {authenticated && (
              <>
                <Button
                  variant={isActive('/my-bookings') ? 'default' : 'ghost'}
                  asChild
                >
                  <Link href="/my-bookings">
                    <Calendar className="w-4 h-4 mr-2" />
                    My Bookings
                  </Link>
                </Button>
                <Button
                  variant={isActive('/profile') ? 'default' : 'ghost'}
                  asChild
                >
                  <Link href="/profile">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </Button>
              </>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {authenticated ? (
              <>
                <span className="hidden sm:inline text-sm text-muted-foreground">
                  {user?.firstName} {user?.lastName}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">
                    <LogIn className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Login</span>
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">
                    <UserPlus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Sign Up</span>
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
