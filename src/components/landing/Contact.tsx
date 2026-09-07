import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";

import { contactdata } from "@/lib/constants/data";
import Headerbanner from "../props/Headerbanner";
import Reveal from "../props/Reveal";
import LocalTime from "../ui/LocalTime";
import ContactForm from "./ContactForm";

const EMAIL = "prabhatbhusal777@gmail.com";

interface prop {
  // off on the /contact page, which has its own masthead
  heading?: boolean;
}

const Contact = ({ heading = true }: prop) => {
  const elsewhere = contactdata.filter(
    (item) => item.label !== "email" && item.label !== "location"
  );

  return (
    <section className="relative isolate overflow-hidden">
      <span aria-hidden="true" className="aurora" />

      <div className="rail py-16 md:py-24">
        {heading && <div className="hairline mb-16 md:mb-24" />}

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          {/* left column — the invitation */}
          <div className="flex flex-col items-start">
            {heading && (
              <Reveal>
                <div className="flex flex-col items-start gap-5">
                  <Headerbanner header="get in touch" />
                  <h2 className="display text-4xl font-extrabold leading-[1.03] text-ink md:text-5xl lg:text-6xl">
                    Let&apos;s build
                    <span className="block text-brand-ink">
                      something solid
                    </span>
                  </h2>
                </div>
              </Reveal>
            )}

            <Reveal delay={80}>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-soft md:text-base">
                Open to full-stack and geospatial work, freelance or full time.
                Tell me what you are building and I will tell you honestly
                whether I am the right person for it.
              </p>
            </Reveal>

            {/* the email, as the largest thing on the page */}
            <Reveal delay={160} className="mt-10 w-full">
              <p className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
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

            {/* everywhere else */}
            <Reveal delay={280} className="mt-6 w-full">
              <div className="flex flex-wrap gap-2">
                {elsewhere.map((item) => {
                  const Icon = item.icon;
                  const external = item.url.startsWith("http");

                  return (
                    <Link
                      key={item.id}
                      href={item.url}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                      className="btn-quiet lift group inline-flex h-11 items-center gap-2.5 rounded-full px-4 text-[13px] font-semibold"
                    >
                      <Icon size={15} strokeWidth={1.8} />
                      {item.label}
                      <ArrowUpRight
                        size={14}
                        strokeWidth={2.5}
                        className="opacity-50 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </Link>
                  );
                })}
              </div>
            </Reveal>
          </div>

          {/* right column — the form */}
          <Reveal delay={120}>
            <div className="surface rounded-[28px] p-6 md:p-8 lg:p-10">
              <div className="mb-8 flex items-baseline justify-between gap-4">
                <h3 className="display text-xl font-bold text-ink md:text-2xl">
                  Start a project
                </h3>
                <span className="mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
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
