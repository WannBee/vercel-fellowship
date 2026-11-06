import {
  Eye,
  Target,
  HeartHandshake,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  CalendarDays,
} from "lucide-react";
import {
  ABOUT,
  ANNOUNCEMENTS,
  FAQS,
  CONTACT,
} from "../constants/landingContent";

const Heading = ({ title, desc }) => (
  <div>
    <div className="flex items-center gap-3">
      <span className="w-1.5 h-7 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600" />
      <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{title}</h2>
    </div>
    {desc && <p className="text-sm mt-2 max-w-3xl text-slate-500">{desc}</p>}
  </div>
);
const fmtDate = (d) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export function AnnouncementSection() {
  return (
    <section id="pengumuman" className="space-y-5 scroll-mt-24">
      <Heading
        title="Pengumuman"
        desc="Informasi terbaru seputar program fellowship."
      />
      <div className="grid md:grid-cols-3 gap-4">
        {ANNOUNCEMENTS.map((a) => (
          <article
            key={a.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600">
                {a.tag}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <CalendarDays className="w-3.5 h-3.5" />
                {fmtDate(a.date)}
              </span>
            </div>
            <h3 className="font-bold text-slate-800 mt-3">{a.title}</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {a.summary}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AboutSection() {
  const icons = { visi: Eye, misi: Target, nilai: HeartHandshake };
  return (
    <section id="tentang" className="space-y-5 scroll-mt-24">
      <Heading title="Tentang Program" />
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-4 text-slate-600 leading-relaxed text-justify">
          {ABOUT.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="space-y-3">
          {ABOUT.highlights.map((h) => {
            const Icon = icons[h.key] || Target;
            return (
              <div
                key={h.key}
                className="flex gap-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-4"
              >
                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{h.title}</h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {h.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="space-y-5 scroll-mt-24">
      <Heading title="Pertanyaan yang Sering Diajukan" />
      <div className="space-y-3 max-w-3xl">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="group bg-white rounded-2xl border border-slate-200 shadow-sm"
          >
            <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4 font-semibold text-slate-800 [&::-webkit-details-marker]:hidden">
              {f.q}
              <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            <p className="px-5 pb-4 text-sm text-slate-600 leading-relaxed">
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function ContactSection() {
  const items = [
    { icon: MapPin, label: "Alamat", value: CONTACT.address },
    {
      icon: Phone,
      label: "Telepon",
      value: CONTACT.phone,
      href: `tel:${CONTACT.phone.replace(/[^+\d]/g, "")}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
    },
    { icon: Clock, label: "Jam Layanan", value: CONTACT.hours },
  ];
  return (
    <section id="kontak" className="space-y-5 scroll-mt-24">
      <Heading
        title="Kontak"
        desc="Hubungi kami untuk informasi lebih lanjut."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(({ icon: Icon, label, value, href }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
          >
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-4">
              {label}
            </p>
            {href ? (
              <a
                href={href}
                className="block mt-1 font-medium text-slate-800 hover:text-indigo-600 break-words"
              >
                {value}
              </a>
            ) : (
              <p className="mt-1 font-medium text-slate-800 break-words">
                {value}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
