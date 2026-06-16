import { Button } from '@xbrk/ui/button';

import type { ComponentProps } from 'react';

interface FormSubmitButtonProps extends ComponentProps<typeof Button> {
  canSubmit: boolean;
  defaultText?: string;
  isPending: boolean;
  isSubmitting: boolean;
  loadingText?: string;
  processingText?: string;
}

export function FormSubmitButton({
  canSubmit,
  isPending,
  isSubmitting,
  defaultText = 'Submit',
  loadingText = 'Submitting...',
  processingText = 'Processing...',
  variant = 'default',
  size = 'default',
  className = 'w-full md:w-auto',
  ...props
}: Readonly<FormSubmitButtonProps>) {
  const buttonText = (() => {
    if (isSubmitting) {
      return loadingText;
    }

    if (isPending) {
      return processingText;
    }

    return defaultText;
  })();

  return (
    <Button
      {...props}
      className={className}
      disabled={!canSubmit || isPending || isSubmitting}
      size={size}
      type="submit"
      variant={variant}
    >
      {buttonText}
    </Button>
  );
}
