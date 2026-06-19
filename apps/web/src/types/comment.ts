import type { Comment, CommentReaction, User } from '@xbrk/db';

export interface CommentWithRelations {
  comment: Comment;
  dislikesCount: number;
  likesCount: number;
  repliesCount: number;
  user: User | null;
  userReaction: CommentReaction | null;
}
