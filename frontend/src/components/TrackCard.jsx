import {
  Code2,
  Database,
  BrainCircuit,
  Smartphone,
  Palette,
  Cloud
} from "lucide-react"

function TrackCard({
  icon,
  title,
  description,
  technologies,
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-2 hover:shadow-xl">

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#0879D1]">
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-bold text-[#062B67]">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-slate-500">
        {description}
      </p>

      <p className="mt-5 text-xs font-bold uppercase tracking-wide text-emerald-600">
        {technologies}
      </p>

    </div>
  )
}

export {
  Code2,
  Database,
  BrainCircuit,
  Smartphone,
  Palette,
  Cloud
}

export default TrackCard