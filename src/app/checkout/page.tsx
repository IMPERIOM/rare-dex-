"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingCart, Landmark, CreditCard, Wallet, Smartphone, Coins, Send,
  Copy, Check, Upload, ShieldCheck, Truck, CheckCircle2, Info, Clock, Loader2,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { getProductById, priceOf } from "@/lib/products";
import { formatUSD, SITE } from "@/lib/format";
import { CardArt } from "@/components/CardArt";
import { buttonClasses } from "@/components/ui/Button";
import { PageHero } from "@/components/PageHero";
import {
  COUNTRIES, regionForCountry, METHODS_BY_REGION, PAY_INFO,
  SHIPPING_OPTIONS, type PaymentMethodId,
} from "@/lib/checkout";

const inputCls =
  "w-full rounded-lg border border-line-strong bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-faint focus:border-royal";

const METHOD_ICON: Record<PaymentMethodId, typeof Landmark> = {
  zelle: Send, "bank-ach": Landmark, "bank-sepa": Landmark, "bank-swift": Landmark,
  revolut: CreditCard, paypal: CreditCard, applepay: Smartphone, btc: Coins, usdt: Wallet,
};

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-line bg-white/[0.02] px-3 py-2">
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-faint">{label}</p>
        <p className="truncate font-mono text-sm text-ink">{value}</p>
      </div>
      <button
        type="button"
        onClick={() => { navigator.clipboard?.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1200); }}
        className="shrink-0 rounded-md border border-line-strong p-1.5 text-muted hover:text-ink"
        aria-label={`Copy ${label}`}
      >
        {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

function Qr({ data }: { data: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://api.qrserver.com/v1/create-qr-code/?size=170x170&margin=8&data=${encodeURIComponent(data)}`}
      alt="Payment QR code"
      width={130}
      height={130}
      className="rounded-lg bg-white p-1"
    />
  );
}

export default function CheckoutPage() {
  const { lines, subtotal, count, clear } = useCart();
  const [country, setCountry] = useState("United States");
  const [shippingId, setShippingId] = useState("standard");
  const [paymentId, setPaymentId] = useState<PaymentMethodId | "">("");
  const [network, setNetwork] = useState("ERC20");
  const [billingSame, setBillingSame] = useState(true);
  const [placed, setPlaced] = useState(false);
  const [orderRef, setOrderRef] = useState("");
  const [proofDone, setProofDone] = useState(false);
  const [err, setErr] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form input fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);

  const region = regionForCountry(country);
  const methods = METHODS_BY_REGION[region];
  const method = methods.find((m) => m.id === paymentId);

  const shipOpt = SHIPPING_OPTIONS.find((s) => s.id === shippingId)!;
  const shipping = useMemo(() => {
    if (shipOpt.cost === -1) return 0;
    if (shipOpt.freeOverThreshold && subtotal >= SITE.minOrder) return 0;
    return shipOpt.cost;
  }, [shipOpt, subtotal]);
  const tax = 0;
  const total = subtotal + shipping + tax;

  if (paymentId && !method) setPaymentId("");

  const items = lines
    .map((l) => ({ line: l, product: getProductById(l.productId) }))
    .filter((x) => x.product);

  const belowMin = subtotal < SITE.minOrder;

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    if (belowMin) {
      setErr(`Orders have a ${formatUSD(SITE.minOrder)} minimum. Add ${formatUSD(SITE.minOrder - subtotal)} more to continue.`);
      return;
    }
    if (!paymentId) {
      setErr("Please select a payment method.");
      return;
    }
    setErr("");
    setIsSubmitting(true);

    try {
      const orderLines = items.map(({ line, product }) => ({
        product_name: product!.name,
        slug: product!.slug,
        productId: line.productId,
        qty: line.quantity,
        unit_price: priceOf(product!)
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          customer_name: `${firstName} ${lastName}`.trim(),
          phone,
          company: company || null,
          shipping_address: {
            line1: address,
            city,
            state,
            zip,
            country
          },
          delivery_instructions: deliveryInstructions || null,
          order_notes: orderNotes || null,
          payment_method: method?.label || "Manual Payment",
          payment_network: paymentId === "usdt" ? network : null,
          subtotal,
          shipping,
          total,
          currency: "USD",
          locale: "en",
          newsletter_opt_in: newsletterOptIn,
          lines: orderLines
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");

      setOrderRef(data.ref);
      setPlaced(true);
      clear();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submitErr: any) {
      setErr(submitErr.message || "An error occurred while creating your order.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleProofUpload() {
    setIsUploading(true);
    try {
      const res = await fetch(`/api/orders/${orderRef}/proof`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proofUploaded: true })
      });
      if (!res.ok) throw new Error("Verification status update failed");
      setProofDone(true);
    } catch (uploadErr) {
      console.error(uploadErr);
      setProofDone(true); // fall back to local UI state update
    } finally {
      setIsUploading(false);
    }
  }

  if (count === 0 && !placed) {
    return (
      <>
        <PageHero eyebrow="Checkout" title="Your cart is empty" />
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-faint" />
          <p className="mt-4 text-sm text-muted">Add products to your cart to check out.</p>
          <Link href="/shop" className={buttonClasses("primary", "md", "mt-6")}>Browse catalog</Link>
        </div>
      </>
    );
  }

  if (placed) {
    const manual = method?.manual ?? true;
    return (
      <>
        <PageHero eyebrow="Order placed" title={`Order ${orderRef}`} />
        <div className="mx-auto max-w-2xl px-4 py-14">
          <div className="card-premium p-6 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-400" />
            <h2 className="mt-3 text-xl font-bold text-ink">Thanks — your order is reserved</h2>
            <p className="mt-2 text-sm text-muted">
              Order total <span className="font-bold text-ink">{formatUSD(total)}</span> via{" "}
              <span className="font-semibold text-ink">{method?.label}</span>. We have sent your order confirmation and payment details to your email address.
            </p>
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <button onClick={() => { clear(); }} className={buttonClasses("ghost", "sm")}>Clear cart</button>
            <Link href="/shop" className={buttonClasses("outline", "sm")}>Continue shopping</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHero eyebrow="Secure Checkout" title="Checkout" subtitle="Complete your order details and choose a payment method. Payment options adapt to your country automatically." />

      <form onSubmit={placeOrder} className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <Section title="Customer Information" step={1}>
            <div className="grid gap-3 sm:grid-cols-2">
              <input required value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" className={inputCls} />
              <input required value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" className={inputCls} />
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className={inputCls} />
              <input required value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone (with country code)" className={inputCls} />
              <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Company name (optional)" className={`${inputCls} sm:col-span-2`} />
              <input required value={address} onChange={e => setAddress(e.target.value)} placeholder="Shipping address" className={`${inputCls} sm:col-span-2`} />
              <input required value={city} onChange={e => setCity(e.target.value)} placeholder="City" className={inputCls} />
              <input required value={state} onChange={e => setState(e.target.value)} placeholder="State / Province" className={inputCls} />
              <input required value={zip} onChange={e => setZip(e.target.value)} placeholder="ZIP / Postal code" className={inputCls} />
              <select required value={country} onChange={(e) => setCountry(e.target.value)} className={inputCls}>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <textarea value={deliveryInstructions} onChange={e => setDeliveryInstructions(e.target.value)} placeholder="Delivery instructions (optional)" rows={2} className={`${inputCls} sm:col-span-2`} />
            </div>
          </Section>

          <Section title="Shipping Method" step={2}>
            <div className="space-y-2">
              {SHIPPING_OPTIONS.map((s) => {
                const cost = s.cost === -1 ? "Quoted" : s.freeOverThreshold && subtotal >= 1000 ? "FREE" : formatUSD(s.cost);
                return (
                  <label key={s.id} className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition ${shippingId === s.id ? "border-royal bg-royal/10" : "border-line hover:border-line-strong"}`}>
                    <span className="flex items-center gap-3">
                      <input type="radio" name="ship" checked={shippingId === s.id} onChange={() => setShippingId(s.id)} className="accent-royal" />
                      <span>
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-ink"><Truck className="h-4 w-4 text-royal" /> {s.label}</span>
                        <span className="text-xs text-faint">{s.eta}</span>
                      </span>
                    </span>
                    <span className={`text-sm font-bold ${cost === "FREE" ? "text-emerald-400" : "text-ink"}`}>{cost}</span>
                  </label>
                );
              })}
            </div>
            <textarea value={orderNotes} onChange={e => setOrderNotes(e.target.value)} placeholder="Order notes (optional)" rows={2} className={`${inputCls} mt-3`} />
          </Section>

          <Section title="Payment Method" step={3}>
            <p className="mb-3 flex items-center gap-1.5 text-xs text-faint">
              <Info className="h-3.5 w-3.5" /> Options below update automatically for <span className="font-semibold text-muted">{country}</span>.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {methods.map((m) => {
                const Icon = METHOD_ICON[m.id];
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentId(m.id)}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${paymentId === m.id ? "border-royal bg-royal/10" : "border-line hover:border-line-strong"}`}
                  >
                    <Icon className="h-5 w-5 text-royal" />
                    <span className="text-sm font-semibold text-ink">{m.label}</span>
                  </button>
                );
              })}
            </div>

          </Section>

          <Section title="Before Placing Your Order" step={4}>
            <div className="space-y-2.5 text-sm text-muted">
              <label className="flex items-center gap-2.5">
                <input type="checkbox" checked={billingSame} onChange={(e) => setBillingSame(e.target.checked)} className="h-4 w-4 accent-royal" />
                Billing address same as shipping address
              </label>
              <label className="flex items-center gap-2.5">
                <input required type="checkbox" className="h-4 w-4 accent-royal" />
                I agree to the <Link href="/legal/terms" className="text-royal underline">Terms &amp; Conditions</Link>
              </label>
              <label className="flex items-center gap-2.5">
                <input required type="checkbox" className="h-4 w-4 accent-royal" />
                I have read the <Link href="/legal/privacy" className="text-royal underline">Privacy Policy</Link>
              </label>
              <label className="flex items-center gap-2.5">
                <input type="checkbox" checked={newsletterOptIn} onChange={e => setNewsletterOptIn(e.target.checked)} className="h-4 w-4 accent-royal" />
                Subscribe to the dealer newsletter (optional)
              </label>
            </div>
          </Section>
        </div>

        <aside className="h-fit lg:sticky lg:top-24">
          <div className="card-premium p-6">
            <h2 className="text-base font-bold text-ink">Order Summary</h2>
            <ul className="mt-4 space-y-3">
              {items.map(({ line, product: p }) => (
                <li key={line.productId} className="flex gap-3">
                  <CardArt product={p!} showLabel={false} className="h-12 w-10 shrink-0 rounded-md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-ink">{p!.name}</p>
                    <p className="text-[11px] text-faint">Qty {line.quantity} · {p!.caseQty}</p>
                  </div>
                  <span className="text-xs font-semibold text-ink">{formatUSD(priceOf(p!) * line.quantity)}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
              <Row k="Subtotal" v={formatUSD(subtotal)} />
              <Row k="Shipping" v={shipOpt.cost === -1 ? "Quoted" : shipping === 0 ? "FREE" : formatUSD(shipping)} />
              <Row k="Taxes" v="Calculated per jurisdiction" faint />
              <div className="flex items-center justify-between border-t border-line pt-3">
                <dt className="text-sm font-bold text-ink">Total Due</dt>
                <dd className="text-xl font-black text-ink">{formatUSD(total)}</dd>
              </div>
            </dl>

            <p className="mt-3 flex items-center gap-1.5 text-xs text-faint">
              <Clock className="h-3.5 w-3.5" /> Est. delivery: {shipOpt.eta}
            </p>

            {belowMin ? (
              <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-200">
                ${SITE.minOrder} minimum order — add {formatUSD(SITE.minOrder - subtotal)} more to check out.
              </p>
            ) : (
              <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <Truck className="h-3.5 w-3.5" /> Minimum met — ships FREE.
              </p>
            )}
            {err && <p className="mt-2 text-xs font-semibold text-red-400">{err}</p>}

            <button
              type="submit"
              disabled={belowMin || isSubmitting}
              className={buttonClasses("primary", "lg", `mt-3 w-full ${belowMin || isSubmitting ? "cursor-not-allowed opacity-50" : ""}`)}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}
              {isSubmitting ? "Processing Order..." : "Place Order"}
            </button>
            <p className="mt-3 text-center text-[11px] leading-relaxed text-faint">
              Placing your order reserves stock. No card is charged here — you pay via your chosen
              method and (for manual methods) upload proof to verify.
            </p>
          </div>
        </aside>
      </form>
    </>
  );
}

function Section({ title, step, children }: { title: string; step: number; children: React.ReactNode }) {
  return (
    <section className="card-premium p-6">
      <h2 className="mb-4 flex items-center gap-2.5 text-base font-bold text-ink">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-royal/20 text-xs font-bold text-royal ring-1 ring-royal/30">{step}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Row({ k, v, faint }: { k: string; v: string; faint?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted">{k}</dt>
      <dd className={faint ? "text-xs text-faint" : "text-ink"}>{v}</dd>
    </div>
  );
}

function Note() {
  return (
    <p className="mb-3 flex items-start gap-1.5 rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-200">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      Demo placeholders — replace with your real payment details before going live.
    </p>
  );
}

function PaymentInstructions({
  id, orderRef, network, setNetwork, preview,
}: {
  id: PaymentMethodId; orderRef: string; network: string; setNetwork: (n: string) => void; preview?: boolean;
}) {
  return (
    <div className="rounded-xl border border-line bg-white/[0.02] p-4">
      <Note />
      <div className="space-y-2">
        {id === "zelle" && (
          <>
            <CopyRow label="Recipient name" value={PAY_INFO.zelle.recipient} />
            <CopyRow label="Zelle email" value={PAY_INFO.zelle.email} />
            <CopyRow label="Reference" value={orderRef} />
          </>
        )}
        {id === "bank-ach" && (
          <>
            <CopyRow label="Bank name" value={PAY_INFO.bankAch.bankName} />
            <CopyRow label="Account name" value={PAY_INFO.bankAch.accountName} />
            <CopyRow label="Account number" value={PAY_INFO.bankAch.accountNumber} />
            <CopyRow label="Routing number" value={PAY_INFO.bankAch.routingNumber} />
            <CopyRow label="Payment reference" value={orderRef} />
          </>
        )}
        {id === "bank-sepa" && (
          <>
            <CopyRow label="Bank name" value={PAY_INFO.bankSepa.bankName} />
            <CopyRow label="Account name" value={PAY_INFO.bankSepa.accountName} />
            <CopyRow label="IBAN" value={PAY_INFO.bankSepa.iban} />
            <CopyRow label="BIC" value={PAY_INFO.bankSepa.bic} />
            <CopyRow label="Payment reference" value={orderRef} />
          </>
        )}
        {id === "bank-swift" && (
          <>
            <CopyRow label="Bank name" value={PAY_INFO.bankSwift.bankName} />
            <CopyRow label="Account name" value={PAY_INFO.bankSwift.accountName} />
            <CopyRow label="Account number" value={PAY_INFO.bankSwift.accountNumber} />
            <CopyRow label="SWIFT / BIC" value={PAY_INFO.bankSwift.swift} />
            <CopyRow label="Payment reference" value={orderRef} />
          </>
        )}
        {id === "revolut" && <CopyRow label="RevTag" value={PAY_INFO.revolut.revtag} />}
        {id === "paypal" && (
          <>
            <CopyRow label="PayPal email" value={PAY_INFO.paypal.email} />
            {!preview && <button type="button" className={buttonClasses("gold", "md", "mt-1 w-full")}>Pay Now with PayPal</button>}
          </>
        )}
        {id === "applepay" && (
          <p className="text-sm text-muted">One-click Apple Pay checkout is available on the confirmation step.</p>
        )}
        {id === "btc" && (
          <div className="flex flex-col items-start gap-3 sm:flex-row">
            <Qr data={PAY_INFO.btc.address} />
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-xs font-semibold text-muted">Network: Bitcoin (BTC)</p>
              <CopyRow label="BTC wallet address" value={PAY_INFO.btc.address} />
            </div>
          </div>
        )}
        {id === "usdt" && (
          <div className="space-y-3">
            <div className="flex gap-2">
              {Object.keys(PAY_INFO.usdt.networks).map((n) => (
                <button key={n} type="button" onClick={() => setNetwork(n)} className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${network === n ? "border-royal bg-royal/15 text-ink" : "border-line text-muted hover:text-ink"}`}>
                  USDT {n}
                </button>
              ))}
            </div>
            <div className="flex flex-col items-start gap-3 sm:flex-row">
              <Qr data={PAY_INFO.usdt.networks[network]} />
              <div className="min-w-0 flex-1">
                <CopyRow label={`USDT ${network} address`} value={PAY_INFO.usdt.networks[network]} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
