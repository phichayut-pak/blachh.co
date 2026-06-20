import Link from "next/link";
import { ArrowRight, Mail, MapPin, Store } from "lucide-react";

import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import type { Dictionary } from "@/lib/i18n";

const contactHeroImage =
  "https://images.unsplash.com/photo-1755001437609-bb2abcde9755?auto=format&fit=crop&w=1400&q=80";

const detailIcons = [Store, MapPin, Mail] as const;
const formFieldOrder = [
  "name",
  "business",
  "email",
  "website",
  "location",
  "orderInterest",
] as const;

interface ContactPageProps {
  dictionary: Dictionary["contact"];
}

export function ContactPage({ dictionary }: ContactPageProps) {
  const heroImageSrc = dictionary.hero.imageUrl || contactHeroImage;
  const mascotImageSrc = dictionary.emailCta.mascotImageUrl || "/mascots/BLACHH-02.png";

  return (
    <div className="bg-[#F7F3EE] text-[#2B211B]">
      <section className="border-b border-[#E2DDD5] px-5 py-14 sm:px-6 md:px-12 md:py-20 lg:px-16">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
          <div className="max-w-2xl">
            <p className="font-hanken text-xs uppercase tracking-[0.18em] text-[#8E857E] sm:text-sm">
              {dictionary.hero.eyebrow}
            </p>
            <h1 className="mt-3 font-libre text-[2.4rem] leading-[1.02] text-[#1C1C1A] sm:text-5xl md:text-[58px]">
              {dictionary.hero.title}
            </h1>
            <p className="mt-5 max-w-xl font-hanken text-sm leading-7 text-[#5A5A55] md:text-[15px]">
              {dictionary.hero.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#wholesale-inquiry"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-[#FFCAD4] px-6 font-hanken text-sm text-[#2B211B]"
              >
                {dictionary.hero.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="mailto:wholesale@blachh.co"
                className="font-hanken text-sm text-[#2B211B] underline underline-offset-4"
              >
                {dictionary.hero.secondaryCta}
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {dictionary.hero.details.map(({ label, value }, index) => {
                const Icon = detailIcons[index] ?? Store;

                return (
                  <div
                    key={label}
                    className="rounded-2xl border border-[#E2DDD5] bg-[#FBF7F2] px-4 py-4"
                  >
                    <Icon className="h-4 w-4 text-[#8CAF5A]" />
                    <p className="mt-4 font-hanken text-[11px] uppercase tracking-[0.18em] text-[#8E857E]">
                      {label}
                    </p>
                    <p className="mt-2 font-hanken text-sm leading-6 text-[#3F3731]">
                      {value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
            <ImageWithFallback
              src={heroImageSrc}
              fallbackSrc={contactHeroImage}
              alt={dictionary.hero.imageAlt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#2B211B14] via-transparent to-white/6" />
          </div>
        </div>
      </section>

      <section
        id="wholesale-inquiry"
        className="border-y border-[#E2DDD5] bg-[#FBF7F2] px-5 py-14 sm:px-6 md:px-12 md:py-18 lg:px-16"
      >
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div className="max-w-md">
            <p className="font-hanken text-xs uppercase tracking-[0.18em] text-[#8E857E] sm:text-sm">
              {dictionary.form.eyebrow}
            </p>
            <h2 className="mt-3 font-libre text-[2rem] leading-tight text-[#1C1C1A] md:text-[44px]">
              {dictionary.form.title}
            </h2>
            <p className="mt-4 font-hanken text-sm leading-7 text-[#5A5A55]">
              {dictionary.form.description}
            </p>

            <div className="mt-8 rounded-[1.75rem] border border-[#E2DDD5] bg-white p-5">
              <p className="font-hanken text-[11px] uppercase tracking-[0.18em] text-[#8E857E]">
                {dictionary.form.whatWeShareTitle}
              </p>
              <div className="mt-4 space-y-3 font-hanken text-sm leading-6 text-[#3F3731]">
                {dictionary.form.whatWeShareItems.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
          </div>

          <form className="rounded-[2rem] border border-[#E2DDD5] bg-white p-5 sm:p-6 md:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              {formFieldOrder.map((fieldKey) => {
                const field = dictionary.form.fields[fieldKey];

                return (
                  <label
                    key={fieldKey}
                    className="flex flex-col gap-2 font-hanken text-sm text-[#3F3731]"
                  >
                    <span>{field.label}</span>
                    <input
                      type={fieldKey === "email" ? "email" : "text"}
                      name={fieldKey}
                      placeholder={field.placeholder}
                      className="h-12 rounded-2xl border border-[#DDD5CC] bg-[#FBF9F6] px-4 text-sm text-[#2B211B] placeholder:text-[#9B938C]"
                    />
                  </label>
                );
              })}

              <label className="flex flex-col gap-2 font-hanken text-sm text-[#3F3731] md:col-span-2">
                <span>{dictionary.form.businessTypeLabel}</span>
                <select className="h-12 rounded-2xl border border-[#DDD5CC] bg-[#FBF9F6] px-5 text-sm text-[#2B211B]">
                  {dictionary.form.businessTypes.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 font-hanken text-sm text-[#3F3731] md:col-span-2">
                <span>{dictionary.form.messageLabel}</span>
                <textarea
                  name="message"
                  rows={6}
                  placeholder={dictionary.form.messagePlaceholder}
                  className="rounded-[1.5rem] border border-[#DDD5CC] bg-[#FBF9F6] px-4 py-3 text-sm leading-6 text-[#2B211B] placeholder:text-[#9B938C]"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-sm font-hanken text-xs leading-6 text-[#8E857E]">
                {dictionary.form.notice}
              </p>
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-[#8CAF5A] px-6 font-hanken text-sm text-[#F7F3EE]"
              >
                {dictionary.form.submit}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-6 md:px-12 md:py-18 lg:px-16">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-5 rounded-[2rem] border border-[#E2DDD5] bg-[#F3ECE3] px-6 py-8 text-center sm:px-8 md:flex-row md:items-center md:justify-between md:text-left">
          <div className="flex items-center gap-4">
            <ImageWithFallback
              src={mascotImageSrc}
              fallbackSrc="/mascots/BLACHH-02.png"
              alt={dictionary.emailCta.mascotAlt}
              width={84}
              height={80}
              className="h-auto w-16 shrink-0"
            />
            <div>
              <p className="font-libre text-2xl leading-tight text-[#1C1C1A]">
                {dictionary.emailCta.title}
              </p>
              <p className="mt-2 font-hanken text-sm leading-6 text-[#5A5A55]">
                {dictionary.emailCta.description}
              </p>
            </div>
          </div>

          <Link
            href="mailto:wholesale@blachh.co"
            className="inline-flex h-12 items-center justify-center rounded-sm border border-[#1C1C1A] px-6 font-hanken text-sm text-[#1C1C1A]"
          >
            {dictionary.emailCta.button}
          </Link>
        </div>
      </section>
    </div>
  );
}
