import type { GuestbookType, UserType } from '@xbrk/types';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { containerVariants, itemVariants } from '@/lib/constants/framer-motion-variants';
import Message from './message';

interface MessageProps {
  messages: (GuestbookType & {
    user: Pick<UserType, 'id' | 'name' | 'image'>;
  })[];
}

export default function Messages({ messages }: Readonly<MessageProps>) {
  if (messages.length === 0) {
    return (
      <div className="mt-10 flex flex-col items-center justify-center gap-4 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <MessageSquare className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="font-medium text-lg">No messages yet</p>
          <p className="text-muted-foreground">Be the first to leave a message!</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div animate="visible" className="mt-8 space-y-2" initial="hidden" variants={containerVariants}>
      {messages.map((message) => (
        <motion.div key={message.id} variants={itemVariants}>
          <Message message={message} />
        </motion.div>
      ))}
    </motion.div>
  );
}
