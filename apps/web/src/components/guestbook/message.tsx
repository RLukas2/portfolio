import { useSuspenseQuery } from '@tanstack/react-query';
import type { GuestbookType, UserType } from '@xbrk/types';
import { Avatar, AvatarFallback, AvatarImage } from '@xbrk/ui/avatar';
import Timestamp from '@/components/shared/timestamp';
import { authQueryOptions } from '@/lib/auth/queries';
import DeleteMessageButton from './delete-message-button';
import { cn } from '@xbrk/ui';

interface MessageProps {
  message: GuestbookType & { user: Pick<UserType, 'id' | 'name' | 'image'> };
}

export default function Message({ message }: Readonly<MessageProps>) {
  const { id, message: body, user, createdAt } = message;
  const { data: currentUser } = useSuspenseQuery(authQueryOptions());

  const isCurrentUser = currentUser?.id === user.id;

  return (
    <div className={cn("group flex gap-3 sm:gap-4 w-full", isCurrentUser ? "flex-row-reverse" : "flex-row")}>
      <Avatar className="h-10 w-10 shrink-0 border border-white/10 shadow-sm">
        <AvatarImage alt={user.name} className="object-cover" height={40} src={user.image as string} width={40} />
        <AvatarFallback className="bg-primary/10 text-primary">{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className={cn("flex flex-col gap-1 max-w-[85%] sm:max-w-[75%]", isCurrentUser ? "items-end" : "items-start")}>
        <div className={cn("flex items-baseline gap-2", isCurrentUser ? "flex-row-reverse" : "flex-row")}>
          <span className="font-medium text-sm text-foreground/80">{user.name}</span>
          <Timestamp datetime={createdAt.toString()} />
        </div>

        <div className="relative group/bubble">
          <div className={cn(
            "px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed shadow-sm",
            isCurrentUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-card/60 backdrop-blur-md border border-white/5 text-foreground rounded-tl-sm"
          )}>
            {body}
          </div>

          {(isCurrentUser || currentUser?.role === 'admin') && (
            <div className={cn(
              "absolute top-1/2 -translate-y-1/2 opacity-0 group-hover/bubble:opacity-100 transition-opacity",
              isCurrentUser ? "-left-10" : "-right-10"
            )}>
              <DeleteMessageButton messageId={id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
