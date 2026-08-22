function FeatureCard({
  icon,
  title,
  description,
}) {
  return (
    <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-500 group-hover:text-white">
        {icon}
      </div>

      <h3 className="text-lg font-bold text-[#062B67]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  )
}

export default FeatureCard