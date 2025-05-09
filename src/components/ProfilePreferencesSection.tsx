import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Account } from "@/models/account";
import {
  TextInput,
  Button,
  RadioInput,
  FormFieldset,
} from "@multiverse-io/stardust-react";

interface ProfilePreferencesSectionProps {
  account: Account;
  onUpdate: (account: Account) => void;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
}

export function ProfilePreferencesSection({
  account,
  onUpdate,
  isEditing,
  onEdit,
  onCancelEdit,
}: ProfilePreferencesSectionProps) {
  const standardPronouns = ["He/Him", "She/Her", "They/Them"];
  const isCustomPronouns = !standardPronouns.includes(account.pronouns);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      preferredName: account.preferredName,
      pronouns: isCustomPronouns ? "Other" : account.pronouns,
      customPronouns: isCustomPronouns ? account.pronouns : "",
    },
    resolver: zodResolver(preferencesSchema),
  });

  const selectedPronouns = watch("pronouns");

  function onSubmit(data: PreferencesSectionFormData) {
    onUpdate({
      ...account,
      preferredName: data.preferredName,
      pronouns:
        data.pronouns === "Other" ? data.customPronouns! : data.pronouns,
    });
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Preferences</h3>

        <TextInput
          {...register("preferredName")}
          id="preferredName"
          label="Preferred name"
          errors={
            errors.preferredName?.message
              ? [errors.preferredName?.message]
              : undefined
          }
        />

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <FormFieldset legend="Pronouns">
              <RadioInput
                {...register("pronouns")}
                label="He/Him"
                value="He/Him"
                size="medium"
              />

              <RadioInput
                {...register("pronouns")}
                label="She/Her"
                value="She/Her"
                size="medium"
              />

              <RadioInput
                {...register("pronouns")}
                label="They/Them"
                value="They/Them"
                size="medium"
              />

              <RadioInput
                {...register("pronouns")}
                label="Other"
                value="Other"
                size="medium"
              />
            </FormFieldset>
          </div>

          {selectedPronouns === "Other" && (
            <div className="mt-2">
              <TextInput
                {...register("customPronouns")}
                id="customPronouns"
                label="Custom pronouns"
                errors={
                  errors.customPronouns?.message
                    ? [errors.customPronouns?.message]
                    : undefined
                }
              />
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <Button type="submit">Save</Button>

          <Button variant="secondary" onClick={onCancelEdit}>
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  return (
    <section>
      <h3>Preferences</h3>

      <p>Preferred name: {account.preferredName}</p>
      <p>Pronouns: {account.pronouns}</p>

      <Button variant="secondary" onClick={onEdit}>
        Edit
      </Button>
    </section>
  );
}

// ---- Form schema ---- //

const preferencesSchema = z.object({
  preferredName: z.string().min(1).max(10),
  pronouns: z.string().min(1),
  customPronouns: z.string().optional(),
});

type PreferencesSectionFormData = z.infer<typeof preferencesSchema>;
