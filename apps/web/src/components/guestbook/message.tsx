import { useSuspenseQuery } from '@tanstack/react-query';
import type { GuestbookType, UserType } from '@xbrk/types';
import { Avatar, AvatarFallback, AvatarImage } from '@xbrk/ui/avatar';
import Timestamp from '@/components/shared/timestamp';
import { authQueryOptions } from '@/lib/auth/queries';
import DeleteMessageButton from './delete-message-button';

interface MessageProps {
  message: GuestbookType & { user: Pick<UserType, 'id' | 'name' | 'image'> };
}

export default function Message({ message }: Readonly<MessageProps>) {
  const { id, message: body, user, createdAt } = message;
  const { data: currentUser } = useSuspenseQuery(authQueryOptions());

  return (
    <div className="glassmorphism group flex gap-4 rounded-xl p-5 transition-all hover:bg-muted/20">
      <Avatar className="h-10 w-10 border-border/50 shadow-sm">
        <AvatarImage alt={user.name} className="object-cover" height={40} src={user.image as string} width={40} />
        <AvatarFallback className="bg-primary/10 font-heading text-primary">
          {user.name?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-heading text-lg">{user.name}</span>
          <Timestamp datetime={createdAt.toString()} />
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed">{body}</p>
      </div>

      {(currentUser?.id === user.id || currentUser?.role === 'admin') && <DeleteMessageButton messageId={id} />}
    </div>
  );
}
