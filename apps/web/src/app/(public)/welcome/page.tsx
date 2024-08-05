import { Heading } from "@/components/typography/heading";

export default async function Welcome() {
  return (
    <div className="p-16 text-center">
      <Heading size="lg">
        Welcome to the <strong className="text-brand">Horarium</strong>
      </Heading>
    </div>
  );
}
