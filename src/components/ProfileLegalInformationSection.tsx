import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Account } from "@/models/account";
import { TextInput, Button } from "@multiverse-io/stardust-react";

interface ProfileLegalInformationSectionProps {
  account: Account;
  onUpdate: (account: Account) => void;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
}

export function ProfileLegalInformationSection({
  account,
  onUpdate,
  isEditing,
  onEdit,
  onCancelEdit,
}: ProfileLegalInformationSectionProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      legalFirstName: account.legalFirstName,
      legalLastName: account.legalLastName,
    },
    resolver: zodResolver(legalInformationSchema),
  });

  function onSubmit(data: LegalInformationSectionFormData) {
    onUpdate({
      ...account,
      legalFirstName: data.legalFirstName,
      legalLastName: data.legalLastName,
    });
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Legal information</h3>

        <TextInput
          {...register("legalFirstName")}
          id="legalFirstName"
          label="Legal first name"
          errors={
            errors.legalFirstName?.message
              ? [errors.legalFirstName?.message]
              : undefined
          }
        />

        <TextInput
          {...register("legalLastName")}
          id="legalLastName"
          label="Legal last name"
          errors={
            errors.legalLastName?.message
              ? [errors.legalLastName?.message]
              : undefined
          }
        />

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
      <h3>Legal information</h3>

      <p>Legal first name: {account.legalFirstName}</p>
      <p>Legal last name: {account.legalLastName}</p>

      <Button variant="secondary" onClick={onEdit}>
        Edit
      </Button>
    </section>
  );
}

// ---- Form schema ---- //

const legalInformationSchema = z.object({
  legalFirstName: z.string().min(1).max(10),
  legalLastName: z.string().min(1),
});

type LegalInformationSectionFormData = z.infer<typeof legalInformationSchema>;
