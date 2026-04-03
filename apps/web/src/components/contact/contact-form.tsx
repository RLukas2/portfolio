import { Button } from '@xbrk/ui/button';
import { useAppForm } from '@xbrk/ui/form';
import { Input } from '@xbrk/ui/input';
import { Textarea } from '@xbrk/ui/textarea';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { contactSchema } from '@/lib/validators';

export const ContactForm = ({ onMessageSent }: { onMessageSent?: () => void }) => {
  const form = useAppForm({
    defaultValues: {
      email: '',
      message: '',
    },
    validators: {
      onChange: contactSchema,
    },
    onSubmit: async (values) => {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: values.value.email,
            message: values.value.message,
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        toast.success('Message sent successfully!');
        form.reset();
        onMessageSent?.();
      } catch {
        toast.error('Something went wrong. Please try again.');
      }
    },
  });

  return (
    <form.AppForm>
      <form
        className="flex w-full flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.AppField name="email">
          {(field) => (
            <field.FormItem>
              <field.FormLabel>Email</field.FormLabel>
              <field.FormControl>
                <Input
                  autoComplete="email"
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="your@email.com"
                  type="email"
                  value={field.state.value}
                />
              </field.FormControl>
              <field.FormMessage />
            </field.FormItem>
          )}
        </form.AppField>

        <form.AppField name="message">
          {(field) => (
            <field.FormItem>
              <field.FormLabel>Message</field.FormLabel>
              <field.FormControl>
                <Textarea
                  className="h-32"
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Tell me about your project..."
                  value={field.state.value}
                />
              </field.FormControl>
              <field.FormMessage />
            </field.FormItem>
          )}
        </form.AppField>

        <Button className="group w-full" disabled={form.state.isSubmitting} type="submit" variant="default">
          <Send className="mr-2 h-4 w-4" />
          {form.state.isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </form.AppForm>
  );
};
