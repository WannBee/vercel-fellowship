import {
  Users,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Youtube,
  Send,
  Heart,
} from "lucide-react";

<footer className="bg-slate-900 text-slate-400">
  <div className="max-w-7xl mx-auto px-4 py-12">
    {/* Top Section: Brand + Newsletter */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-slate-800">
      {/* Brand & Description */}
      <div>
        <div className="flex items-center gap-2 text-white font-semibold text-xl mb-4">
          <Users className="w-6 h-6 text-indigo-400" />
          FellowshipApp
        </div>
        <p className="text-sm leading-relaxed mb-4 max-w-md">
          Platform komunitas yang menghubungkan fellowship untuk bertumbuh
          bersama dalam iman, pelayanan, dan persaudaraan.
        </p>
        {/* Social Media Icons */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            aria-label="Facebook"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 hover:bg-indigo-500 text-slate-400 hover:text-white transition-colors"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href="#"
            aria-label="Twitter"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 hover:bg-indigo-500 text-slate-400 hover:text-white transition-colors"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            href="#"
            aria-label="Instagram"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 hover:bg-indigo-500 text-slate-400 hover:text-white transition-colors"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="#"
            aria-label="Youtube"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 hover:bg-indigo-500 text-slate-400 hover:text-white transition-colors"
          >
            <Youtube className="w-4 h-4" />
          </a>
          <a
            href="#"
            aria-label="Linkedin"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 hover:bg-indigo-500 text-slate-400 hover:text-white transition-colors"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href="#"
            aria-label="Github"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 hover:bg-indigo-500 text-slate-400 hover:text-white transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Newsletter */}
      <div className="md:text-right">
        <h3 className="text-white font-semibold mb-2">
          Berlangganan Newsletter
        </h3>
        <p className="text-sm mb-4">
          Dapatkan update terbaru langsung ke email kamu.
        </p>
        <form className="flex items-center gap-2 md:justify-end">
          <input
            type="email"
            placeholder="Email kamu..."
            className="flex-1 max-w-xs px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
          >
            <Send className="w-4 h-4" />
            Kirim
          </button>
        </form>
      </div>
    </div>

    {/* Middle Section: Navigation Links */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-b border-slate-800">
      {/* Company */}
      <div>
        <h3 className="text-white font-semibold mb-4">Perusahaan</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="#" className="hover:text-indigo-400 transition-colors">
              Tentang Kami
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-indigo-400 transition-colors">
              Tim Kami
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-indigo-400 transition-colors">
              Karir
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-indigo-400 transition-colors">
              Blog
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-indigo-400 transition-colors">
              Press
            </a>
          </li>
        </ul>
      </div>

      {/* Services */}
      <div>
        <h3 className="text-white font-semibold mb-4">Layanan</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="#" className="hover:text-indigo-400 transition-colors">
              Fellowship
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-indigo-400 transition-colors">
              Komunitas
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-indigo-400 transition-colors">
              Event
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-indigo-400 transition-colors">
              Mentoring
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-indigo-400 transition-colors">
              Donasi
            </a>
          </li>
        </ul>
      </div>

      {/* Support */}
      <div>
        <h3 className="text-white font-semibold mb-4">Bantuan</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="#" className="hover:text-indigo-400 transition-colors">
              FAQ
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-indigo-400 transition-colors">
              Panduan
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-indigo-400 transition-colors">
              Pusat Bantuan
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-indigo-400 transition-colors">
              Kebijakan Privasi
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-indigo-400 transition-colors">
              Syarat & Ketentuan
            </a>
          </li>
        </ul>
      </div>

      {/* Contact */}
      <div>
        <h3 className="text-white font-semibold mb-4">Kontak</h3>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 text-indigo-400 flex-shrink-0" />
            <span>Jl. Fellowship No. 123, Jakarta Selatan, Indonesia</span>
          </li>
          <li className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <a
              href="tel:+62211234567"
              className="hover:text-indigo-400 transition-colors"
            >
              +62 21 1234 567
            </a>
          </li>
          <li className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <a
              href="mailto:hello@fellowshipapp.com"
              className="hover:text-indigo-400 transition-colors"
            >
              hello@fellowshipapp.com
            </a>
          </li>
        </ul>
      </div>
    </div>

    {/* Bottom Section: Copyright */}
    <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
      <p className="text-center sm:text-left">
        © {new Date().getFullYear()}{" "}
        <span className="text-white font-semibold">FellowshipApp</span>. All
        rights reserved.
      </p>
      <p className="flex items-center gap-1">
        Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> in
        Indonesia
      </p>
    </div>
  </div>
</footer>;
