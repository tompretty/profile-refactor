"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Account } from "@/models/account";
import { ProfileLegalInformationSection } from "@/components/ProfileLegalInformationSection";
import { ProfilePreferencesSection } from "@/components/ProfilePreferencesSection";

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

      <ProfileLegalInformationSection
        account={account}
        onUpdate={handleUpdateAccount}
        editingState={getEditingState(editingSectionId, "legal-information")}
        onEdit={() => handleEditSection("legal-information")}
        onCancelEdit={handleCancelEditSection}
      />

      <ProfilePreferencesSection
        account={account}
        onUpdate={handleUpdateAccount}
        editingState={getEditingState(editingSectionId, "preferences")}
        onEdit={() => handleEditSection("preferences")}
        onCancelEdit={handleCancelEditSection}
      />
    </main>
  );
}

// ---- Helpers ---- //

function getEditingState(editingSectionId: string | null, sectionId: string) {
  if (!editingSectionId) {
    return "not-editing";
  }

  if (editingSectionId === sectionId) {
    return "this-field";
  }

  return "other-field";
}
