import { redirect } from "next/navigation";

// The retail cart is replaced by the wholesale quote flow.
export default function CartPage() {
  redirect("/request-a-quote");
}
