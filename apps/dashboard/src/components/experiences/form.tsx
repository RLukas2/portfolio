import { formOptions } from '@tanstack/react-form';
import type { Experience } from '@xbrk/db';
import { ExperienceType as ExperienceEnum, type ExperienceTypeValue } from '@xbrk/db/api-schemas';
import { withForm } from '@xbrk/ui/form';
import {
  FormCheckbox,
  FormDatePicker,
  FormImageUpload,
  type FormImageUploadField,
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
    type: ExperienceEnum.WORK as ExperienceTypeValue,
    isDraft: false,
    isOnGoing: false,
  },
});

export const ExperiencesForm = withForm({
  ...experienceFormOpts,
  props: {
    experience: undefined as Experience | undefined,
    isPending: false,
  },
  render({ form, experience, isPending }) {
    return (
      <>
        <form.AppField name="title">
          {(field) => <FormInput field={field} label="Title" placeholder="Software Engineer" required />}
        </form.AppField>

        <form.AppField name="institution">
          {(field) => <FormInput field={field} label="Institution" placeholder="Google" required />}
        </form.AppField>

        <form.AppField name="description">
          {(field) => (
            <FormTextarea field={field} label="Description" placeholder="A brief description of your experience" />
          )}
        </form.AppField>

        <form.AppField name="url">
          {(field) => <FormInput field={field} label="URL" placeholder="https://www.google.com" type="url" />}
        </form.AppField>

        <form.AppField name="thumbnail">
          {(field) => (
            <FormImageUpload
              field={field as FormImageUploadField}
              initialPreview={experience?.imageUrl}
              label="Image"
              name={field.name}
            />
          )}
        </form.AppField>

        <form.AppField name="type">
          {(field) => (
            <FormSelect
              field={field}
              label="Type"
              options={Object.values(ExperienceEnum).map((type) => ({
                value: type,
                label: type,
              }))}
              placeholder="Select a type"
            />
          )}
        </form.AppField>

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

        <div className="grid gap-8 md:grid-cols-2">
          <form.AppField name="isOnGoing">
            {(field) => (
              <FormCheckbox
                className=""
                description="This experience is currently ongoing"
                field={field}
                label="On Going"
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
        </div>

        <div>
          <form.Subscribe selector={(formState) => [formState.canSubmit, formState.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <FormSubmitButton
                canSubmit={canSubmit ?? false}
                isPending={isPending}
                isSubmitting={isSubmitting ?? false}
              />
            )}
          </form.Subscribe>
        </div>
      </>
    );
  },
});
