import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-28 text-center">
      <p className="text-6xl font-black text-gradient">404</p>
      <h1 className="mt-4 text-2xl font-extrabold text-ink">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-2 text-sm text-muted">
        The page or product you&apos;re looking for may have moved or sold out.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/" className={buttonClasses("primary", "lg")}>Back home</Link>
        <Link href="/shop" className={buttonClasses("outline", "lg")}>Browse catalog</Link>
      </div>
    </div>
  );
}
