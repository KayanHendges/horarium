import { Heading } from "@/components/typography/heading";

export default async function Product() {
  return (
    <div className="p-16 text-center">
      <Heading size="lg">
        Welcome to the <strong className="text-brand">Product</strong>
      </Heading>
    </div>
  );
}
