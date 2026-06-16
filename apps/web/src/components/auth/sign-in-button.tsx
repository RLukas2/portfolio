import { Button } from '@xbrk/ui/button';
import { LogIn } from 'lucide-react';
import { useSignInModal } from '@/hooks/use-sign-in-modal';

export default function SignInButton() {
  const { setOpen } = useSignInModal();
  return (
    <div className="glassmorphism mb-8 flex flex-col items-center gap-4 rounded-2xl p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <LogIn className="h-8 w-8 text-primary" />
      </div>
      <div className="space-y-2">
        <p className="font-heading text-2xl">Sign in to leave a message</p>
        <p className="text-lg text-muted-foreground">Join the conversation and share your thoughts</p>
      </div>
      <Button aria-label="Sign in button" className="mt-4" onClick={() => setOpen(true)} size="lg">
        Sign In
      </Button>
    </div>
  );
}
