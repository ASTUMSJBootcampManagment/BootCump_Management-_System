const Card = ({
  title,
  value,
  description,
  icon: Icon,
  iconBg = "bg-blue-50",
  iconColor = "text-blue-600",
}) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold text-[#14213d]">
            {value}
          </h3>

          {description && (
            <p className="mt-1 text-xs font-medium text-green-500">
              {description}
            </p>
          )}
        </div>

        {Icon && (
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
          >
            <Icon className="text-xl" />
          </div>
        )}

      </div>
    </div>
  );
};

export default Card;
