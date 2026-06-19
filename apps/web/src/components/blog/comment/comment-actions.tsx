import { useMutation } from '@tanstack/react-query';
import { Button } from '@xbrk/ui/button';
import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useCommentContext } from '@/contexts/comment';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useSignInModal } from '@/hooks/use-sign-in-modal';
import { $reactToComment } from '@/lib/server';

export default function CommentActions() {
  const { isAuthenticated, isLoading } = useCurrentUser();
  const { setOpen } = useSignInModal();
  const { comment, setIsReplying } = useCommentContext();
  const { mutate: reactMutation } = useMutation({
    mutationFn: (data: { id: string; like: boolean }) => $reactToComment({ data }),
    onError: (_error) => {
      toast.error('Failed to react to comment');
    },
  });

  const handleCommentReaction = (like: boolean) => {
    if (!(isAuthenticated || isLoading)) {
      setOpen(true);
      return;
    }
    reactMutation({ id: comment.comment.id, like });
  };

  const handleReply = () => {
    if (!(isAuthenticated || isLoading)) {
      setOpen(true);
      return;
    }
    setIsReplying(true);
  };

  return (
    <div className="flex gap-1">
      <Button className="gap-1" onClick={() => handleCommentReaction(true)} size="sm" variant="secondary">
        <ThumbsUpIcon className="size-4" />
        {comment.likesCount}
      </Button>

      <Button className="gap-1" onClick={() => handleCommentReaction(false)} size="sm" variant="secondary">
        <ThumbsDownIcon className="size-4" />
        {comment.dislikesCount}
      </Button>

      {!comment.comment.parentId && (
        <Button
          className="font-medium text-muted-foreground text-xs"
          onClick={handleReply}
          size="sm"
          variant="secondary"
        >
          Reply
        </Button>
      )}
    </div>
  );
}
