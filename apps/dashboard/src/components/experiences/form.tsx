import { formOptions, type ValidationErrorMap } from '@tanstack/react-form';
import { ExperienceType as ExperienceTypeEnum, type ExperienceTypeValue } from '@xbrk/db/schema';
import type { ExperienceType } from '@xbrk/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@xbrk/ui/card';
import { withForm } from '@xbrk/ui/form';
import {
  FormCheckbox,
  FormDatePicker,
  FormImageUpload,
  FormInput,
  FormSelect,
  FormSubmitButton,
  FormTextarea,
} from '../form';

export const experienceFormOpts = formOptions({
  defaultValues: {
    title: '',
    institution: '',
    description: '',
    thumbnail: '',
    startDate: '',
    endDate: '',
    url: '',
    type: ExperienceTypeEnum.WORK as ExperienceTypeValue,
    isDraft: false,
    isOnGoing: false,
  },
});

interface FormField {
  handleBlur: () => void;
  handleChange: (value: string) => void;
  setErrorMap: (errorMap: ValidationErrorMap) => void;
}

export const ExperiencesForm = withForm({
  ...experienceFormOpts,
  props: {
    experience: undefined as ExperienceType | undefined,
  },
  render({ form, experience }) {
    return (
      <div className="grid gap-6 lg:grid-flow-dense lg:grid-cols-3 lg:gap-8">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Experience Details</CardTitle>
              <CardDescription>Core information about your role and company.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form.AppField name="title">
                {(field) => <FormInput field={field} label="Title" placeholder="Software Engineer" required />}
              </form.AppField>

              <form.AppField name="institution">
                {(field) => <FormInput field={field} label="Institution" placeholder="Google" required />}
              </form.AppField>

              <form.AppField name="description">
                {(field) => (
                  <FormTextarea
                    field={field}
                    label="Description"
                    placeholder="A brief description of your role and achievements"
                  />
                )}
              </form.AppField>

              <form.AppField name="url">
                {(field) => (
                  <FormInput field={field} label="Company URL" placeholder="https://www.google.com" type="url" />
                )}
              </form.AppField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
              <CardDescription>When did you work here?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-8 md:grid-cols-2">
                <form.AppField name="startDate">
                  {(field) => <FormDatePicker field={field} label="Start Date" placeholder="Pick a start date" />}
                </form.AppField>
                <form.AppField name="endDate">
                  {(field) => (
                    <FormDatePicker
                      disabled={form.getFieldValue('isOnGoing')}
                      field={field}
                      label="End Date"
                      placeholder="Pick an end date"
                    />
                  )}
                </form.AppField>
              </div>

              <form.AppField name="isOnGoing">
                {(field) => (
                  <FormCheckbox description="This experience is currently ongoing" field={field} label="On Going" />
                )}
              </form.AppField>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Logo / Media</CardTitle>
            </CardHeader>
            <CardContent>
              <form.AppField name="thumbnail">
                {(field) => (
                  <FormImageUpload
                    field={field as FormField}
                    initialPreview={experience?.imageUrl}
                    label="Company Logo"
                    name={field.name}
                  />
                )}
              </form.AppField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form.AppField name="type">
                {(field) => (
                  <FormSelect
                    field={field}
                    label="Type"
                    options={Object.values(ExperienceTypeEnum).map((type) => ({
                      value: type,
                      label: type,
                    }))}
                    placeholder="Select a type"
                  />
                )}
              </form.AppField>

              <form.AppField name="isDraft">
                {(field) => (
                  <FormCheckbox
                    description="This experience won't be visible to visitors"
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
