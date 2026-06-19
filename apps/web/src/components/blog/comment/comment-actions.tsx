import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@xbrk/ui';
import { Button } from '@xbrk/ui/button';
import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useCommentContext } from '@/contexts/comment';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useSignInModal } from '@/hooks/use-sign-in-modal';
import { queryKeys } from '@/lib/query-keys';
import { $reactToComment } from '@/lib/server';
import type { CommentWithRelations } from '@/types/misc';

interface CommentReactionResult {
  commentId: string;
  dislikesCount: number;
  likesCount: number;
  userReaction: CommentWithRelations['userReaction'];
}

function patchCommentReaction(comments: CommentWithRelations[] | undefined, result: CommentReactionResult) {
  if (!comments) {
    return comments;
  }

  return comments.map((item) =>
    item.comment.id === result.commentId
      ? {
          ...item,
          dislikesCount: result.dislikesCount,
          likesCount: result.likesCount,
          userReaction: result.userReaction,
        }
      : item,
  );
}

export default function CommentActions() {
  const { isAuthenticated, isLoading } = useCurrentUser();
  const { setOpen } = useSignInModal();
  const { comment, setIsReplying } = useCommentContext();
  const queryClient = useQueryClient();
  const userLiked = comment.userReaction?.like === true;
  const userDisliked = comment.userReaction?.like === false;
  const { mutate: reactMutation } = useMutation({
    mutationFn: (data: { id: string; like: boolean }) =>
      $reactToComment({ data }) as unknown as Promise<CommentReactionResult>,
    onSuccess: (result) => {
      queryClient.setQueryData(
        queryKeys.comment.byArticle(comment.comment.articleId),
        (comments: CommentWithRelations[] | undefined) => patchCommentReaction(comments, result),
      );

      if (comment.comment.parentId) {
        queryClient.setQueryData(
          queryKeys.comment.byArticleAndParent(comment.comment.articleId, comment.comment.parentId),
          (comments: CommentWithRelations[] | undefined) => patchCommentReaction(comments, result),
        );
      }
    },
    onError: (_error) => {
      toast.error('Failed to react to comment');
    },
  });

  const handleCommentReaction = (like: boolean) => {
    if (isLoading) {
      return;
    }
    if (!isAuthenticated) {
      setOpen(true);
      return;
    }
    reactMutation({ id: comment.comment.id, like });
  };

  const handleReply = () => {
    if (isLoading) {
      return;
    }
    if (!isAuthenticated) {
      setOpen(true);
      return;
    }
    setIsReplying(true);
  };

  return (
    <div className="flex gap-1">
      <Button
        className={cn(
          'gap-1',
          userLiked &&
            'border-rose-300/50 bg-rose-50/80 text-rose-500 shadow-sm dark:border-rose-800/50 dark:bg-rose-950/50 dark:text-rose-400',
        )}
        disabled={isLoading}
        onClick={() => handleCommentReaction(true)}
        size="sm"
        variant="secondary"
      >
        <ThumbsUpIcon className={cn('size-4', userLiked && 'fill-current')} />
        {comment.likesCount}
      </Button>

      <Button
        className={cn(
          'gap-1',
          userDisliked &&
            'border-sky-300/50 bg-sky-50/80 text-sky-500 shadow-sm dark:border-sky-800/50 dark:bg-sky-950/50 dark:text-sky-400',
        )}
        disabled={isLoading}
        onClick={() => handleCommentReaction(false)}
        size="sm"
        variant="secondary"
      >
        <ThumbsDownIcon className={cn('size-4', userDisliked && 'fill-current')} />
        {comment.dislikesCount}
      </Button>

      {!comment.comment.parentId && (
        <Button
          className="font-medium text-muted-foreground text-xs"
          disabled={isLoading}
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
