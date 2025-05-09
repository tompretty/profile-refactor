import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Account } from "@/models/account";
import {
  TextInput,
  Button,
  FormFieldset,
  RadioInput,
} from "@multiverse-io/stardust-react";
import { mapErrorToStardustErrors } from "@/utils/stardust";

interface ProfilePreferencesSectionProps {
  account: Account;
  onUpdate: (account: Account) => void;
  editingState: "not-editing" | "this-field" | "other-field";
  onEdit: () => void;
  onCancelEdit: () => void;
}

export function ProfilePreferencesSection({
  account,
  onUpdate,
  editingState,
  onEdit,
  onCancelEdit,
}: ProfilePreferencesSectionProps) {
  const isUsingCustomPronouns = !STANDARD_PRONOUNS.includes(account.pronouns);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      preferredName: account.preferredName,
      pronouns: isUsingCustomPronouns ? "Other" : account.pronouns,
      customPronouns: isUsingCustomPronouns ? account.pronouns : "",
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

  return (
    <EditableSection
      editingState={editingState}
      onEdit={onEdit}
      editForm={
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3>Preferences</h3>

          <TextInput
            {...register("preferredName")}
            id="preferredName"
            label="Preferred name"
            errors={mapErrorToStardustErrors(errors.preferredName?.message)}
          />

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <FormFieldset legend="Pronouns">
                {STANDARD_PRONOUNS.map((pronoun) => (
                  <RadioInput
                    {...register("pronouns")}
                    key={pronoun}
                    label={pronoun}
                    value={pronoun}
                    size="medium"
                  />
                ))}

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
                  errors={mapErrorToStardustErrors(
                    errors.customPronouns?.message
                  )}
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
      }
      display={
        <>
          <h3>Preferences</h3>

          <p>Preferred name: {account.preferredName}</p>
          <p>Pronouns: {account.pronouns}</p>
        </>
      }
    />
  );
}

// ---- Form schema ---- //

const preferencesSchema = z.object({
  preferredName: z.string().min(1).max(10),
  pronouns: z.string().min(1),
  customPronouns: z.string().optional(),
});

type PreferencesSectionFormData = z.infer<typeof preferencesSchema>;

// ---- Helpers ---- //

const STANDARD_PRONOUNS = ["He/Him", "She/Her", "They/Them"];

// ---- Components ---- //

interface EditableSectionProps {
  editingState: "not-editing" | "this-field" | "other-field";
  onEdit: () => void;
  editForm: JSX.Element;
  display: JSX.Element;
}

function EditableSection({
  editingState,
  onEdit,
  editForm,
  display,
}: EditableSectionProps) {
  if (editingState === "this-field") {
    return editForm;
  }

  return (
    <>
      {display}

      {editingState === "not-editing" && (
        <Button variant="secondary" onClick={onEdit}>
          Edit
        </Button>
      )}
    </>
  );
}
