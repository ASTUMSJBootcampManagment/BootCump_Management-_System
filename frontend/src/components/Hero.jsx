import {
  ArrowRight,
  BookOpen,
  Code2,
  GraduationCap,
  Users,
} from "lucide-react";

import { Link } from "react-router-dom";

function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-180 overflow-hidden bg-linear-to-br from-slate-50 via-white to-teal-50 pt-32"
    >
      <div className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-emerald-100/50 blur-3xl" />

      <div className="absolute left-0 top-60 h-60 w-60 rounded-full bg-blue-100/50 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 pb-20 lg:grid-cols-2 lg:px-8">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white px-4 py-2 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            <span className="text-sm font-semibold text-[#062B67]">
              Empowering Muslim Youth
            </span>
          </div>

          <h1 className="max-w-2xl text-5xl font-black leading-[1.05] tracking-tight text-[#062B67] md:text-6xl">
            Learn Today,
            <span className="block text-emerald-500">Build Tomorrow.</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
            Join ASTUMSJ Bootcamp and gain real-world skills in coding,
            technology, and problem solving. Let's build a better future
            together.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/register"
              className="group flex items-center gap-2 rounded-xl bg-emerald-500 px-7 py-3.5 font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600"
            >
              Get Started
              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </Link>

            <a
              href="#about"
              className="rounded-xl border-2 border-slate-300 bg-white px-7 py-3.5 font-bold text-[#062B67] transition hover:border-[#062B67]"
            >
              Learn More
            </a>
          </div>
        </div>

        <div className="relative flex min-h-112.5 items-center justify-center">
          <div className="relative flex h-82.5 w-82.5 items-center justify-center rounded-full bg-white shadow-2xl shadow-[#062B67]/10">
            <div className="absolute inset-5 rounded-full border-2 border-dashed border-emerald-200" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#062B67] shadow-xl">
                <Code2 size={55} className="text-emerald-400" />
              </div>

              <div className="mt-5 flex items-center gap-2 text-[#062B67]">
                <BookOpen size={25} />

                <GraduationCap size={30} />

                <Users size={25} />
              </div>

              <p className="mt-3 font-bold text-[#062B67]">
                Learn • Code • Build
              </p>
            </div>
          </div>

          <div className="absolute right-0 top-16 w-44 rounded-3xl bg-[#062B67] p-5 shadow-2xl md:right-4">
            <Stat icon={<Users size={18} />} number="100+" label="Students" />

            <Stat
              icon={<GraduationCap size={18} />}
              number="10+"
              label="Mentors"
            />

            <Stat icon={<BookOpen size={18} />} number="8" label="Tracks" />
            <Stat icon={<Code2 size={18} />} number="3" label="Months" />
          </div>
        </div>
      </div>

      <div className="absolute -bottom-20 left-[-5%] h-40 w-[110%] rounded-[50%] bg-white" />
    </section>
  );
}

function Stat({ icon, number, label }) {
  return (
    <div className="mb-5 flex items-center gap-3 last:mb-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/30 text-blue-200">
        {icon}
      </div>

      <div>
        <p className="font-bold text-white">{number}</p>

        <p className="text-xs text-blue-100">{label}</p>
      </div>
    </div>
  );
}

export default Hero;
