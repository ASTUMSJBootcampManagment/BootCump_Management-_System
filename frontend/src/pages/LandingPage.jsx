import {
  Award,
  BookOpen,
  BrainCircuit,
  Code2,
  Database,
  Laptop,
  Users,
  Wifi,
  Trophy,
  Video,
  UsersRound,
  CheckCircle2,
  ClipboardList,
  MessageCircle,
  Clock3
} from "lucide-react"

import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import FeatureCard from "../components/FeatureCard"
import TrackCard from "../components/TrackCard"
import SectionTitle from "../components/SectionTitle"
import Footer from "../components/Footer"


function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      <Navbar />

      <Hero />


      <section className="relative bg-white py-20">

        <div className="mx-auto grid max-w-7xl gap-5 px-5 md:grid-cols-2 lg:grid-cols-4 lg:px-8">

          <FeatureCard
            icon={<Award size={24} />}
            title="Expert Mentors"
            description="Learn from experienced mentors and successful developers."
          />

          <FeatureCard
            icon={<Laptop size={24} />}
            title="Hands-on Projects"
            description="Build real projects and develop practical software skills."
          />

          <FeatureCard
            icon={<Code2 size={24} />}
            title="Real-world Skills"
            description="Gain skills that prepare you for university and your career."
          />

          <FeatureCard
            icon={<Users size={24} />}
            title="Strong Community"
            description="Be part of a supportive Muslim technology community."
          />

        </div>

      </section>


      <section
        id="about"
        className="bg-slate-50 py-24"
      >

        <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 lg:grid-cols-2 lg:px-8">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
              About the Bootcamp
            </p>

            <h2 className="mt-4 text-4xl font-black text-[#062B67]">
              Learn beyond syntax.
              <span className="block text-emerald-500">
                Build real skills.
              </span>
            </h2>

            <p className="mt-6 leading-8 text-slate-600">
              ASTUMSJ Bootcamp is a three-month summer program
              created to empower Muslim students at Adama Science
              and Technology University with practical software
              development, problem-solving, and teamwork skills.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              Participants learn through live lectures, mentorship,
              competitive programming, team projects, and
              experience-sharing sessions.
            </p>

          </div>


          <div className="grid grid-cols-2 gap-5">

            <InfoBox
              icon={<Code2 />}
              title="Problem Solving"
              text="Codeforces and LeetCode practice."
            />

            <InfoBox
              icon={<Laptop />}
              title="Development"
              text="Frontend and backend development."
            />

            <InfoBox
              icon={<UsersRound />}
              title="Mentorship"
              text="Learn with experienced mentors."
            />

            <InfoBox
              icon={<Trophy />}
              title="Competitions"
              text="Weekly coding contests."
            />

          </div>

        </div>

      </section>


      <section
        id="tracks"
        className="bg-white py-24"
      >

        <div className="mx-auto max-w-7xl px-5 lg:px-8">

          <SectionTitle
            eyebrow="Our Tracks"
            title="Choose your learning path"
            description="Build your skills through structured technical learning and practical projects."
          />


          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <TrackCard
              icon={<BrainCircuit size={28} />}
              title="Problem Solving"
              description="Develop algorithmic thinking and improve your competitive programming skills."
              technologies="Codeforces • LeetCode"
            />

            <TrackCard
              icon={<Code2 size={28} />}
              title="Frontend Development"
              description="Learn how to build modern and responsive web applications."
              technologies="HTML • CSS • JavaScript • React"
            />

            <TrackCard
              icon={<Database size={28} />}
              title="Backend Development"
              description="Build APIs, manage databases and understand modern backend systems."
              technologies="Node.js • Express • MongoDB"
            />

          </div>

        </div>

      </section>


      <section
        id="program"
        className="bg-slate-50 py-24"
      >

        <div className="mx-auto max-w-7xl px-5 lg:px-8">

          <SectionTitle
            eyebrow="Program Highlights"
            title="More than just coding"
            description="The bootcamp combines technical learning, mentorship, collaboration and community."
          />


          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            <ProgramCard
              icon={<Video />}
              title="Live Lectures"
              text="Two live lectures every week."
            />

            <ProgramCard
              icon={<Trophy />}
              title="Weekly Contests"
              text="Practice problem solving through Codeforces contests."
            />

            <ProgramCard
              icon={<MessageCircle />}
              title="Experience Sharing"
              text="Learn from successful Muslim software developers."
            />

            <ProgramCard
              icon={<UsersRound />}
              title="Team Projects"
              text="Collaborate with other students on real projects."
            />

          </div>

        </div>

      </section>


      <section
        id="eligibility"
        className="bg-white py-24"
      >

        <div className="mx-auto max-w-7xl px-5 lg:px-8">

          <SectionTitle
            eyebrow="Eligibility"
            title="Are you ready to join?"
            description="Applicants should meet the following requirements."
          />


          <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">

            <Requirement
              icon={<GraduationCapIcon />}
              title="ASTU Student"
              text="You must be a Muslim student currently enrolled at ASTU."
            />

            <Requirement
              icon={<Laptop />}
              title="Personal Computer"
              text="You must have access to a personal computer or desktop."
            />

            <Requirement
              icon={<Wifi />}
              title="Reliable Internet"
              text="You need a stable internet connection for learning and communication."
            />

            <Requirement
              icon={<Clock3 />}
              title="5+ Hours Daily"
              text="You should be able to commit at least five hours each day."
            />

          </div>

        </div>

      </section>


      <section className="bg-slate-50 py-24">

        <div className="mx-auto max-w-7xl px-5 lg:px-8">

          <SectionTitle
            eyebrow="How to Join"
            title="Your journey starts here"
            description="The admission process is designed to select students who are ready to commit and learn."
          />


          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            <Step
              number="01"
              icon={<ClipboardList />}
              title="Apply"
              text="Submit the initial online application form."
            />

            <Step
              number="02"
              icon={<Video />}
              title="Interview"
              text="Selected candidates participate in a video interview."
            />

            <Step
              number="03"
              icon={<CheckCircle2 />}
              title="Join"
              text="Accepted students begin their bootcamp journey."
            />

          </div>

        </div>

      </section>


      <section className="relative overflow-hidden bg-[#062B67] py-24">

        <div className="absolute -left-20 top-0 h-60 w-60 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="absolute -right-20 bottom-0 h-60 w-60 rounded-full bg-emerald-500/20 blur-3xl" />


        <div className="relative mx-auto max-w-3xl px-5 text-center">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
            Start Your Journey
          </p>

          <h2 className="mt-4 text-4xl font-black text-white md:text-5xl">
            Ready to learn, code and build?
          </h2>

          <p className="mt-5 leading-7 text-blue-100">
            Join ASTUMSJ Bootcamp and become part of a community
            committed to learning technology and building the future.
          </p>

          <LinkButton />

        </div>

      </section>


      <Footer />

    </div>
  )
}



function InfoBox({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
        {icon}
      </div>

      <h3 className="mt-5 font-bold text-[#062B67]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>

    </div>
  )
}


function ProgramCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl bg-white p-7 shadow-sm">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <h3 className="mt-5 font-bold text-[#062B67]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>

    </div>
  )
}


function Requirement({ icon, title, text }) {
  return (
    <div className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-6">

      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        {icon}
      </div>

      <div>

        <h3 className="font-bold text-[#062B67]">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {text}
        </p>

      </div>

    </div>
  )
}


function Step({ number, icon, title, text }) {
  return (
    <div className="relative rounded-2xl bg-white p-7 text-center shadow-sm">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#062B67] text-white">
        {icon}
      </div>

      <p className="mt-5 text-sm font-bold text-emerald-600">
        {number}
      </p>

      <h3 className="mt-2 text-xl font-bold text-[#062B67]">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {text}
      </p>

    </div>
  )
}


function LinkButton() {
  return (
    <a
      href="/register"
      className="mt-8 inline-block rounded-xl bg-emerald-500 px-8 py-4 font-bold text-white transition hover:bg-emerald-600"
    >
      Register for the Bootcamp
    </a>
  )
}


function GraduationCapIcon() {
  return <BookOpen />
}


export default LandingPage