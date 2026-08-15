function SectionTitle({
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="mx-auto mb-14 max-w-2xl text-center">

      <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-black text-[#062B67] md:text-4xl">
        {title}
      </h2>

      <p className="mt-4 leading-7 text-slate-500">
        {description}
      </p>

    </div>
  )
}

export default SectionTitle