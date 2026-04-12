import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@xbrk/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@xbrk/ui/avatar';
import { Badge } from '@xbrk/ui/badge';
import { Button } from '@xbrk/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@xbrk/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@xbrk/ui/dialog';
import { Input } from '@xbrk/ui/input';
import { Label } from '@xbrk/ui/label';
import { Separator } from '@xbrk/ui/separator';
import {
  CalendarIcon,
  ClockIcon,
  EditIcon,
  LogOutIcon,
  MailIcon,
  ShieldIcon,
  TrashIcon,
  UserIcon,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import PageHeading from '@/components/shared/page-heading';
import authClient from '@/lib/auth/client';

export const Route = createFileRoute('/(public)/profile/')({
  component: ProfilePage,
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({
        to: '/signin',
        search: {
          error: undefined,
          error_description: undefined,
          message: undefined,
          returnTo: undefined,
        },
      });
    }
  },
  head: () => ({
    meta: [
      { title: 'Profile' },
      {
        name: 'description',
        content: 'Manage your profile and account settings',
      },
    ],
  }),
});

const WHITESPACE_REGEX = /\s+/;

const getInitials = (name: string) => {
  return name
    .trim()
    .split(WHITESPACE_REGEX)
    .filter(Boolean)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();
};

const AT_SYMBOL_REGEX = /^@/;
const TWITTER_HANDLE_REGEX = /^[a-zA-Z0-9_]+$/;

function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = Route.useRouteContext();

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    twitterHandle: user?.twitterHandle || '',
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    twitterHandle: '',
  });

  if (!user) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <div className="space-y-2 text-center">
          <h1 className="font-semibold text-2xl">Access Denied</h1>
          <p className="text-muted-foreground">You need to be logged in to view your profile.</p>
        </div>
        <Button
          onClick={() =>
            router.navigate({
              to: '/signin',
              search: { error: undefined, error_description: undefined, message: undefined, returnTo: undefined },
            })
          }
        >
          Sign In
        </Button>
      </div>
    );
  }

  const validateForm = () => {
    const errors = { name: '', twitterHandle: '' };
    let isValid = true;

    // Name validation
    if (!editForm.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    } else if (editForm.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
      isValid = false;
    } else if (editForm.name.trim().length > 100) {
      errors.name = 'Name must be less than 100 characters';
      isValid = false;
    }

    // Twitter handle validation
    if (editForm.twitterHandle.trim()) {
      if (editForm.twitterHandle.trim().length < 3) {
        errors.twitterHandle = 'Twitter handle must be at least 3 characters';
        isValid = false;
      } else if (editForm.twitterHandle.trim().length > 15) {
        errors.twitterHandle = 'Twitter handle must be less than 15 characters';
        isValid = false;
      } else if (!TWITTER_HANDLE_REGEX.test(editForm.twitterHandle.trim())) {
        errors.twitterHandle = 'Twitter handle can only contain letters, numbers, and underscores';
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleEditSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const newName = editForm.name.trim();
      const newTwitterHandle = editForm.twitterHandle.trim();

      if (
        (!newName || newName === user.name) &&
        (!newTwitterHandle || newTwitterHandle === (user.twitterHandle || ''))
      ) {
        toast.info('No changes to save');
        setIsEditing(false);
        return;
      }

      await authClient.updateUser({
        name: newName,
        twitterHandle: newTwitterHandle || null,
      });
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      await router.invalidate();
      toast.success('Profile updated successfully');
      setFormErrors({ name: '', twitterHandle: '' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile');
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await authClient.deleteUser({
        callbackURL: '/',
      });
      toast.success('Account deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete account');
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      await router.navigate({ to: '/' });
      await router.invalidate();
      toast.success('Signed out successfully');
    } catch (_error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeading description={'Manage your account settings and preferences'} title={'Profile'} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Your personal information and account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage alt={user.name} src={user.image || ''} />
                <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    <ShieldIcon className="mr-1 h-3 w-3" />
                    {user.role || 'user'}
                  </Badge>
                  {user.emailVerified && (
                    <Badge variant="outline">
                      <MailIcon className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MailIcon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Email</p>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Member since</p>
                  <p className="text-muted-foreground text-sm">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Last updated</p>
                  <p className="text-muted-foreground text-sm">{new Date(user.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>

              {user.twitterHandle && (
                <div className="flex items-center gap-3">
                  <X className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">Twitter</p>
                    <a
                      className="text-blue-600 text-sm underline hover:text-blue-800"
                      href={`https://twitter.com/${user.twitterHandle}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      @{user.twitterHandle}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>Manage your account settings and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Dialog
              onOpenChange={(open) => {
                setIsEditing(open);
                if (open) {
                  setEditForm({
                    name: user.name,
                    twitterHandle: user.twitterHandle || '',
                  });
                }
              }}
              open={isEditing}
            >
              <DialogTrigger asChild>
                <Button className="w-full justify-start" variant="outline">
                  <EditIcon className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>Update your personal information</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      aria-describedby={formErrors.name ? 'name-error' : undefined}
                      aria-invalid={!!formErrors.name}
                      id="name"
                      onChange={(e) => {
                        setEditForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }));
                        setFormErrors((prev) => ({ ...prev, name: '' }));
                      }}
                      placeholder="Enter your name"
                      value={editForm.name}
                    />
                    {formErrors.name && (
                      <p className="text-destructive text-sm" id="name-error" role="alert">
                        {formErrors.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitterHandle">Twitter Handle</Label>
                    <Input
                      aria-describedby={formErrors.twitterHandle ? 'twitter-error' : undefined}
                      aria-invalid={!!formErrors.twitterHandle}
                      id="twitterHandle"
                      onChange={(e) => {
                        setEditForm((prev) => ({
                          ...prev,
                          twitterHandle: e.target.value.replace(AT_SYMBOL_REGEX, ''),
                        }));
                        setFormErrors((prev) => ({ ...prev, twitterHandle: '' }));
                      }}
                      placeholder="Enter your Twitter handle (without @)"
                      value={editForm.twitterHandle}
                    />
                    {formErrors.twitterHandle ? (
                      <p className="text-destructive text-sm" id="twitter-error" role="alert">
                        {formErrors.twitterHandle}
                      </p>
                    ) : (
                      <p className="text-muted-foreground text-xs">Enter your Twitter handle without the @ symbol</p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setIsEditing(false)} variant="outline">
                    Cancel
                  </Button>
                  <Button onClick={handleEditSubmit}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button className="w-full justify-start" onClick={handleSignOut} variant="outline">
              <LogOutIcon className="mr-2 h-4 w-4" />
              Sign Out
            </Button>

            <Separator />

            <AlertDialog onOpenChange={setIsDeleting} open={isDeleting}>
              <AlertDialogTrigger asChild>
                <Button className="w-full justify-start" variant="destructive">
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove all your data
                    from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
