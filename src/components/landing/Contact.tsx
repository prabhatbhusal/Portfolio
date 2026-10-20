import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { contactdata } from "@/lib/constants/data";
import { author } from "@/lib/seo/site";
import { Reveal } from "../motion";
import LocalTime from "../ui/LocalTime";
import ContactForm from "./ContactForm";

const EMAIL = author.email;

interface ContactProps {
  // off on the /contact page, which has its own masthead
  heading?: boolean;
}

const Contact = ({ heading = true }: ContactProps) => {
  const elsewhere = contactdata.filter(
    (item) => item.label !== "email" && item.label !== "location"
  );

  return (
    <section id="contact" className="relative isolate overflow-hidden">
      <span aria-hidden="true" className="aurora" />

      <div className="rail py-16 md:py-24">
        {heading && <div className="hairline mb-16 md:mb-24" />}

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          {/* left column — the invitation */}
          <div className="flex flex-col items-start">
            {heading && (
              <Reveal className="flex flex-col items-start gap-5">
                <p className="eyebrow">talk to me</p>
                <h2 className="display pixel-end text-4xl font-extrabold leading-[1.03] text-ink md:text-5xl lg:text-6xl">
                  Let&apos;s build something solid
                </h2>
              </Reveal>
            )}

            <Reveal delay={80}>
              <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink-soft md:text-base">
                Open to game and VR development first, then 3D props, virtual
                tours and LiDAR work — freelance or full time. Tell me what you
                are building.
              </p>
            </Reveal>

            {/* the email, as the largest thing on the page */}
            <Reveal delay={160} className="mt-10 w-full">
              <p className="text-[11px] leading-relaxed uppercase text-ink-faint font-semibold">
                write to me
              </p>

              <a
                href={`mailto:${EMAIL}`}
                className="wipe display mt-4 inline-block break-all text-2xl font-extrabold leading-tight text-ink transition-colors duration-300 hover:text-brand-ink sm:text-3xl md:text-[2.1rem]"
              >
                {EMAIL}
              </a>
            </Reveal>

            {/* where and when */}
            <Reveal delay={220} className="mt-10 w-full">
              <div className="surface flex flex-wrap items-center gap-x-8 gap-y-4 rounded-2xl px-6 py-5">
                <span className="flex items-center gap-2.5">
                  <MapPin size={16} strokeWidth={1.8} className="text-brand-ink" />
                  <span className="text-[14px] font-medium text-ink">
                    Kathmandu, Nepal
                  </span>
                </span>

                <span className="flex items-center gap-2.5">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-ok opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-ok" />
                  </span>
                  <span className="mono text-[13px] text-ink-soft">
                    <LocalTime className="text-ink" /> local · usually replies
                    within a day
                  </span>
                </span>
              </div>
            </Reveal>

            {/* everywhere else, one row each */}
            <Reveal delay={280} className="mt-6 w-full">
              <ul className="flex flex-col gap-2">
                {elsewhere.map((item) => {
                  const Icon = item.icon;
                  const external = item.url.startsWith("http");

                  return (
                    <li key={item.id}>
                      <Link
                        href={item.url}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="contact-row group"
                      >
                        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-ink-soft transition-colors duration-300 group-hover:border-(--brand-line) group-hover:text-brand-ink">
                          <Icon size={16} strokeWidth={1.8} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[14px] font-bold text-ink">{item.label}</span>
                          <span className="block truncate text-[12px] text-ink-faint">{item.value}</span>
                        </span>
                        <ArrowRight
                          size={16}
                          className="shrink-0 text-ink-faint transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand-ink"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>

          {/* right column — the form */}
          <Reveal delay={120}>
            <div className="surface rounded-[28px] p-6 md:p-8 lg:p-10">
              <div className="mb-8 flex items-baseline justify-between gap-4">
                <h3 className="display text-xl font-bold text-ink md:text-2xl">
                  Let&apos;s collaborate
                </h3>
                <span className="text-[11px] font-semibold uppercase leading-relaxed text-ink-faint">
                  4 fields
                </span>
              </div>

              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Contact;
