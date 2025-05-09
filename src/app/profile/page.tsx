"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Button,
  FormFieldset,
  RadioInput,
  TextInput,
} from "@multiverse-io/stardust-react";

interface Account {
  legalFirstName: string;
  legalLastName: string;
  preferredName: string;
  pronouns: string;
}

const ACCOUNT: Account = {
  legalFirstName: "Thomas",
  legalLastName: "Pretty",
  preferredName: "Tom",
  pronouns: "Foo/Bar",
};

export default function ProfilePage() {
  const [account, setAccount] = useState(ACCOUNT);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const currentEditingSection = searchParams.get("editing-section");
    if (currentEditingSection) {
      setEditingSectionId(currentEditingSection);
    }
  }, [searchParams]);

  const handleEditSection = (sectionId: string) => {
    setEditingSectionId(sectionId);
    const params = new URLSearchParams(searchParams.toString());
    params.set("editing-section", sectionId);
    router.push(`?${params.toString()}`);
  };

  const handleCancelEditSection = () => {
    setEditingSectionId(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("editing-section");
    router.push(`?${params.toString()}`);
  };

  const handleUpdateAccount = (account: Account) => {
    setAccount(account);
    handleCancelEditSection();
  };

  return (
    <main>
      <h1>My account</h1>

      <h2>Personal information</h2>

      <LegalInformationSection
        account={account}
        onUpdate={handleUpdateAccount}
        isEditing={editingSectionId === "legal-information"}
        onEdit={() => handleEditSection("legal-information")}
        onCancelEdit={handleCancelEditSection}
      />

      <PreferencesSection
        account={account}
        onUpdate={handleUpdateAccount}
        isEditing={editingSectionId === "preferences"}
        onEdit={() => handleEditSection("preferences")}
        onCancelEdit={handleCancelEditSection}
      />
    </main>
  );
}

interface LegalInformationSectionProps {
  account: Account;
  onUpdate: (account: Account) => void;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
}

const legalInformationSchema = z.object({
  legalFirstName: z.string().min(1).max(10),
  legalLastName: z.string().min(1),
});

type LegalInformationSectionFormData = z.infer<typeof legalInformationSchema>;

function LegalInformationSection({
  account,
  onUpdate,
  isEditing,
  onEdit,
  onCancelEdit,
}: LegalInformationSectionProps) {
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

interface PreferencesSectionProps {
  account: Account;
  onUpdate: (account: Account) => void;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
}

const preferencesSchema = z.object({
  preferredName: z.string().min(1).max(10),
  pronouns: z.string().min(1),
  customPronouns: z.string().optional(),
});

type PreferencesSectionFormData = z.infer<typeof preferencesSchema>;

function PreferencesSection({
  account,
  onUpdate,
  isEditing,
  onEdit,
  onCancelEdit,
}: PreferencesSectionProps) {
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
