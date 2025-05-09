"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams, useRouter } from "next/navigation";

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
  pronouns: "He/Him",
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

        <div className="flex flex-col gap-2">
          <label htmlFor="legalFirstName">Legal first name</label>
          <input
            id="legalFirstName"
            type="text"
            {...register("legalFirstName")}
          />
          <p className="text-red-500">{errors.legalFirstName?.message}</p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="legalLastName">Legal last name</label>
          <input
            id="legalLastName"
            type="text"
            {...register("legalLastName")}
          />
          <p className="text-red-500">{errors.legalFirstName?.message}</p>
        </div>

        <button type="submit">Save</button>

        <button type="button" onClick={onCancelEdit}>
          Cancel
        </button>
      </form>
    );
  }

  return (
    <section>
      <h3>Legal information</h3>

      <p>Legal first name: {account.legalFirstName}</p>
      <p>Legal last name: {account.legalLastName}</p>

      <button onClick={onEdit}>Edit</button>
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
});

type PreferencesSectionFormData = z.infer<typeof preferencesSchema>;

function PreferencesSection({
  account,
  onUpdate,
  isEditing,
  onEdit,
  onCancelEdit,
}: PreferencesSectionProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      preferredName: account.preferredName,
      pronouns: account.pronouns,
    },
    resolver: zodResolver(preferencesSchema),
  });

  function onSubmit(data: PreferencesSectionFormData) {
    onUpdate({
      ...account,
      preferredName: data.preferredName,
      pronouns: data.pronouns,
    });
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Legal information</h3>

        <div className="flex flex-col gap-2">
          <label htmlFor="preferredName">Preferred name</label>
          <input
            id="preferredName"
            type="text"
            {...register("preferredName")}
          />
          <p className="text-red-500">{errors.preferredName?.message}</p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="pronouns">Pronouns</label>
          <input id="pronouns" type="text" {...register("pronouns")} />
          <p className="text-red-500">{errors.pronouns?.message}</p>
        </div>

        <button type="submit">Save</button>

        <button type="button" onClick={onCancelEdit}>
          Cancel
        </button>
      </form>
    );
  }

  return (
    <section>
      <h3>Preferences</h3>

      <p>Preferred name: {account.preferredName}</p>
      <p>Pronouns: {account.pronouns}</p>

      <button onClick={onEdit}>Edit</button>
    </section>
  );
}
