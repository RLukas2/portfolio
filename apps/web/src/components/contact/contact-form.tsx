import { Button } from '@xbrk/ui/button';
import { useAppForm } from '@xbrk/ui/form';
import { Input } from '@xbrk/ui/input';
import { Textarea } from '@xbrk/ui/textarea';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ContactForm = ({ onMessageSent }: { onMessageSent?: () => void }) => {
  const form = useAppForm({
    defaultValues: {
      email: '',
      message: '',
      website: '', // Honeypot field - not validated on client
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
            website: values.value.website, // Include honeypot
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Network response was not ok');
        }

        toast.success('Message sent successfully!');
        form.reset();
        onMessageSent?.();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
        toast.error(message);
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
        <form.AppField
          name="email"
          validators={{
            onChange: ({ value }) => {
              if (!value) {
                return 'Email is required';
              }
              if (!EMAIL_REGEX.test(value)) {
                return 'Invalid email address';
              }
              return undefined;
            },
          }}
        >
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

        <form.AppField
          name="message"
          validators={{
            onChange: ({ value }) => {
              const trimmed = value.trim();
              if (!trimmed) {
                return 'Message is required';
              }
              if (trimmed.length < 2) {
                return 'Message must be at least 2 characters';
              }
              if (trimmed.length > 1000) {
                return 'Message must be less than 1000 characters';
              }
              return undefined;
            },
          }}
        >
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

        {/* Honeypot field - hidden from users, bots will fill it */}
        <form.AppField name="website">
          {(field) => (
            <div aria-hidden="true" className="hidden">
              <Input
                autoComplete="off"
                onChange={(e) => field.handleChange(e.target.value)}
                tabIndex={-1}
                type="text"
                value={field.state.value}
              />
            </div>
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
