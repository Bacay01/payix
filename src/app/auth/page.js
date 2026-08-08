import Image from "next/image";
import { CircleDot } from "@/components/icons";
import { AuthForm } from "@/components/auth/auth-form";


export const metadata = {
  title: "Sign in — Payix",
  description: "Sign in to Payix or create a free account.",
};

export default function AuthPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Left: form */}
      <div className="flex flex-col px-6 py-8">
        <a href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <CircleDot size={16} />
          </span>
          <span className="text-lg font-semibold tracking-tight">Payix</span>
        </a>

        <div className="flex flex-1 items-center justify-center py-12">
          <AuthForm />
        </div>
      </div>

      {/* Right: image + testimonial */}
      <div className="relative hidden lg:block">
        <Image
          src="/James.png"
          alt=""
          fill
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-md">
          <p className="text-sm leading-relaxed text-white">
            &ldquo;Payix has transformed the way I manage money. Payouts that
            used to take days now land in seconds. I recommend it to anyone
            running a business.&rdquo;
          </p>
          <p className="mt-3 text-xs text-white/70">James Carter — Business Owner</p>
        </div>
      </div>
    </main>
  );
}