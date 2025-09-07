import React, { useState } from 'react';
import { useAuth } from '../contexts/EnhancedAuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { 
  User, 
  LogOut, 
  Settings, 
  Mail, 
  Phone, 
  Shield, 
  Calendar,
  MoreVertical,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';

const UserProfile: React.FC = () => {
  const { currentUser, signOut, updateUser, sendVerificationEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  if (!currentUser) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error('Failed to sign out: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendVerification = async () => {
    try {
      setIsLoading(true);
      await sendVerificationEmail();
      toast.success('Verification email sent! Check your inbox.');
    } catch (error: any) {
      toast.error('Failed to send verification email: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {/* User Profile Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={currentUser.photoURL || undefined} />
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  {currentUser.displayName ? getInitials(currentUser.displayName) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">
                  {currentUser.displayName || 'User'}
                </CardTitle>
                <CardDescription className="text-sm">
                  {currentUser.email}
                </CardDescription>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Account Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSendVerification} disabled={isLoading}>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Verification Email
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} disabled={isLoading}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* User Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Email Status</span>
            </div>
            <Badge variant={currentUser.emailVerified ? "default" : "secondary"}>
              {currentUser.emailVerified ? (
                <>
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Verified
                </>
              ) : (
                <>
                  <XCircle className="mr-1 h-3 w-3" />
                  Unverified
                </>
              )}
            </Badge>
          </div>

          <Separator />

          {/* User Information */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-gray-600">{currentUser.email}</p>
              </div>
            </div>

            {currentUser.phoneNumber && (
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-gray-600">{currentUser.phoneNumber}</p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Member Since</p>
                <p className="text-sm text-gray-600">
                  {formatDate(currentUser.metadata.creationTime)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Last Sign In</p>
                <p className="text-sm text-gray-600">
                  {formatDate(currentUser.metadata.lastSignInTime)}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSendVerification}
              disabled={isLoading || currentUser.emailVerified}
              className="flex-1"
            >
              {currentUser.emailVerified ? 'Email Verified' : 'Verify Email'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Signing Out...' : 'Sign Out'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Account Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {currentUser.emailVerified ? '100%' : '50%'}
              </p>
              <p className="text-xs text-gray-600">Profile Complete</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">Active</p>
              <p className="text-xs text-gray-600">Account Status</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
