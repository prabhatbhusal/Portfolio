import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { getProjects } from "@/lib/content";
import FactGrid from "@/components/props/FactGrid";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, projectSchema } from "@/lib/seo/schema";
import { pageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ slug: string }>;
};

// every one is prerendered at build
export async function generateStaticParams() {
  return (await getProjects()).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = (await getProjects()).find((item) => item.slug === slug);

  if (!project) return { title: "Not found" };

  return pageMetadata({
    title: project.title,
    description: project.description,
    path: `/work/${slug}`,
  });
}

const Page = async ({ params }: Props) => {
  const { slug } = await params;
  const workprojects = await getProjects();
  const project = workprojects.find((item) => item.slug === slug);

  if (!project) notFound();

  const index = workprojects.findIndex((item) => item.slug === slug);
  const next = workprojects[(index + 1) % workprojects.length];

  const facts = [
    { id: 1, label: "year", value: project.year ?? "—" },
    { id: 2, label: "role", value: project.role ?? "—" },
    { id: 3, label: "domain", value: project.sector },
    { id: 4, label: "type", value: project.stack },
  ];

  return (
    <main>
      <JsonLd data={projectSchema(project)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
          { name: project.title, path: `/work/${slug}` },
        ])}
      />

      <div className="rail pt-10 md:pt-14">
        <Link
          href="/work"
          className="group inline-flex items-center gap-2 text-[13px] font-semibold text-ink-soft transition-colors duration-300 hover:text-ink"
        >
          <ArrowLeft
            size={15}
            strokeWidth={2.5}
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          />
          all projects
        </Link>
      </div>

      <section className="rail flex flex-col items-start gap-6 pb-12 pt-8 md:pb-16 md:pt-10">
        <div className="flex flex-wrap items-center gap-2">
          {project.featured && (
            <span className="borderbg brand-bg rounded-full px-2.5 py-0.5 mono text-[10px] uppercase tracking-wider text-brand-ink">
              featured
            </span>
          )}
          <span className="chip rounded-full px-2.5 py-0.5 mono text-[10px] uppercase tracking-wider">
            {project.badge}
          </span>
        </div>

        <h1 className="display max-w-3xl text-4xl font-extrabold leading-[1.03] text-ink sm:text-5xl md:text-6xl">
          {project.title}
        </h1>

        <p className="max-w-2xl text-[15px] leading-relaxed text-ink-soft md:text-lg md:leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {project.live && (
            <Link
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="btn-solid group inline-flex h-11 items-center gap-2 rounded-full px-5 text-[14px] font-semibold"
            >
              view live
              <ArrowUpRight
                size={16}
                strokeWidth={2.5}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          )}

          {project.github && (
            <Link
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="btn-quiet group inline-flex h-11 items-center gap-2 rounded-full px-5 text-[14px] font-semibold"
            >
              source on github
              <ArrowUpRight
                size={16}
                strokeWidth={2.5}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          )}

          {project.artstation && (
            <Link
              href={project.artstation}
              target="_blank"
              rel="noreferrer"
              className="btn-quiet group inline-flex h-11 items-center gap-2 rounded-full px-5 text-[14px] font-semibold"
            >
              view on artstation
              <ArrowUpRight
                size={16}
                strokeWidth={2.5}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          )}
        </div>
      </section>

      {/* sketchfab shows a still with a play button until clicked, and lazy
          loading keeps even that off the network until it is near */}
      {project.embed && (
        <section className="rail pb-12 md:pb-16">
          <div className="surface aspect-video overflow-hidden rounded-2xl">
            <iframe
              src={project.embed}
              title={`${project.title}, 3D model`}
              loading="lazy"
              allow="autoplay; fullscreen; xr-spatial-tracking"
              allowFullScreen
              className="size-full"
            />
          </div>
        </section>
      )}

      <section className="rail">
        <FactGrid facts={facts} />
      </section>

      <section className="rail grid grid-cols-1 gap-12 py-16 md:py-24 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
        <div>
          <h2 className="display text-2xl font-bold text-ink md:text-3xl">
            What it took
          </h2>

          {project.highlights && (
            <ul className="mt-8 flex flex-col gap-6">
              {project.highlights.map((highlight, idx) => (
                <li key={idx} className="flex gap-4">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-(--hud)" />
                  <p className="max-w-xl text-[15px] leading-relaxed text-ink-soft">
                    {highlight}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="surface h-fit rounded-2xl p-6 md:p-8">
          <h3 className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
            built with
          </h3>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.skills.map((skill) => (
              <span
                key={skill}
                className="chip rounded-full px-2.5 py-1 mono text-[11px]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="rail pb-8">
        <div className="hairline mb-10" />

        <Link
          href={`/work/${next.slug}`}
          className="surface group flex flex-col gap-2 rounded-2xl p-6 md:p-8"
        >
          <span className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
            next project
          </span>

          <span className="display flex items-center gap-3 text-xl font-bold text-ink transition-colors duration-300 group-hover:text-brand-ink md:text-2xl">
            {next.title}
            <ArrowUpRight
              size={20}
              strokeWidth={2.5}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </Link>
      </section>
    </main>
  );
};

export default Page;
