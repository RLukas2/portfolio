import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { User } from '@xbrk/db';
import { Avatar, AvatarFallback, AvatarImage } from '@xbrk/ui/avatar';
import { Button } from '@xbrk/ui/button';
import { Input } from '@xbrk/ui/input';
import { Send } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/query-keys';
import { $createGuestbookEntry } from '@/lib/server';

interface MessageFormProps {
  user: User;
}

export default function MessageForm({ user }: Readonly<MessageFormProps>) {
  const formRef = useRef<HTMLFormElement>(null);
  const queryClient = useQueryClient();
  const [error, setError] = useState<string>('');

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: { message: string }) => $createGuestbookEntry({ data }),
    onSuccess: () => {
      formRef.current?.reset();
      setError('');
      toast.success('Message posted');
    },
    onError: (error) => {
      toast.error(error.message);
      console.error(error);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.guestbook.list(),
      });
    },
  });

  const createMessageHandler = async (formData: FormData) => {
    const raw = (formData.get('message') as string) ?? '';
    const message = raw.trim();

    // Validation
    if (!message) {
      setError('Please enter a message.');
      return;
    }

    if (message.length < 3) {
      setError('Message must be at least 3 characters long.');
      return;
    }

    if (message.length > 500) {
      setError('Message must be less than 500 characters.');
      return;
    }

    setError('');
    const toastId = toast.loading('Sending your message ...');
    try {
      await mutateAsync({ message });
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="rounded-2xl border bg-card p-4">
      <form action={createMessageHandler} ref={formRef}>
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10 border">
            <AvatarImage alt={user.name} className="object-cover" height={40} src={user.image as string} width={40} />
            <AvatarFallback className="bg-primary/10 text-primary">{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="relative flex-1">
            <Input
              aria-describedby={error ? 'message-error' : undefined}
              aria-invalid={!!error}
              aria-label="Your message"
              className="h-12 rounded-xl border-none bg-muted pr-24 focus-visible:ring-1"
              name="message"
              onChange={() => setError('')}
              placeholder="Leave a message..."
              required
            />
            <Button
              className="absolute top-1/2 right-2 -translate-y-1/2 gap-2"
              disabled={isPending}
              size="sm"
              type="submit"
            >
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
        {error && (
          <p className="mt-2 text-destructive text-sm" id="message-error" role="alert">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
