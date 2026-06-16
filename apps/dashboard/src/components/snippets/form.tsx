import { formOptions } from '@tanstack/react-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@xbrk/ui/card';
import { withForm } from '@xbrk/ui/form';
import { generateSlug } from '@xbrk/utils';
import { FormCheckbox, FormInput, FormMDXEditor, FormSlug, FormSubmitButton, FormTextarea } from '../form';

export const snippetFormOpts = formOptions({
  defaultValues: {
    title: '',
    slug: '',
    description: '',
    category: '',
    code: '',
    isDraft: false,
  },
});

export const SnippetsForm = withForm({
  ...snippetFormOpts,
  render({ form }) {
    return (
      <div className="grid gap-6 lg:grid-cols-3 lg:grid-flow-dense lg:gap-8">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Snippet Information</CardTitle>
              <CardDescription>The core details of your code snippet.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form.AppField
                listeners={{
                  onChange: ({ value }) => {
                    const slug = generateSlug(value);
                    form.setFieldValue('slug', slug);
                  },
                }}
                name="title"
              >
                {(field) => <FormInput field={field} label="Title" placeholder="Snippet Title" required />}
              </form.AppField>

              <form.AppField name="slug">
                {(field) => (
                  <FormSlug field={field} label="Slug" placeholder="snippet-title" urlPath="/snippets/your-slug" />
                )}
              </form.AppField>

              <form.AppField name="description">
                {(field) => (
                  <FormTextarea field={field} label="Description" placeholder="A brief description of your snippet" />
                )}
              </form.AppField>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Code Content</CardTitle>
              <CardDescription>Write the actual snippet code below.</CardDescription>
            </CardHeader>
            <CardContent>
              <form.AppField name="code">
                {(field) => (
                  <FormMDXEditor
                    field={field}
                    label=""
                    placeholder="```javascript
const add = (a, b) => a + b;
```"
                  />
                )}
              </form.AppField>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Classification & Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form.AppField name="category">
                {(field) => <FormInput field={field} label="Category" placeholder="React" required />}
              </form.AppField>

              <form.AppField name="isDraft">
                {(field) => (
                  <FormCheckbox
                    description="This snippet won't be visible to visitors"
                    field={field}
                    label="Save as Draft"
                  />
                )}
              </form.AppField>
            </CardContent>
          </Card>
        </div>

        <div className="hidden">
          <form.Subscribe selector={(formState) => [formState.canSubmit, formState.isSubmitting]}>
            {([canSubmit, isPending, isSubmitting]) => (
              <FormSubmitButton
                canSubmit={canSubmit ?? false}
                id="hidden-submit-btn"
                isPending={isPending ?? false}
                isSubmitting={isSubmitting ?? false}
              />
            )}
          </form.Subscribe>
        </div>
      </div>
    );
  },
});
