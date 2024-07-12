import { SignOutButton } from "../buttons/signOut";

export async function Header() {
  return (
    <div className="w-full p-4 bg-card justify-end">
      <SignOutButton />
    </div>
  );
}
