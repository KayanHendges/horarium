import { cn } from "@/lib/utils";
import { SignOutButton } from "../buttons/signOut";

export async function Header() {
  return (
    <div
      className={cn(
        "w-full flex justify-between p-4 bg-card",
        "border-b-[1px] border-ring rounded-sm"
      )}
    >
      <div className="flex gap-4 items-center">
        <SignOutButton />
      </div>
    </div>
  );
}
