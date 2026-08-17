import logo from "../assets/logo.png";

const LeftPanel = () => {
  return (
    <div className="relative hidden min-h-screen overflow-hidden bg-[#062A5C] lg:flex lg:w-[38%] lg:flex-col lg:justify-between">
      
      {/* Decorative circles */}
      <div className="absolute -right-24 top-32 h-72 w-72 rounded-full bg-[#0B3D91]/40" />

      <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-[#0AA6A6]/20" />

      {/* Decorative green circle */}
      <div className="absolute -right-10 bottom-32 h-40 w-40 rounded-full bg-[#16B86A]/10" />

      {/* Dotted pattern */}
      <div className="absolute right-8 top-8 grid grid-cols-5 gap-2 opacity-40">
        {Array.from({ length: 25 }).map((_, index) => (
          <span
            key={index}
            className="h-1 w-1 rounded-full bg-[#16B86A]"
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 px-10 pt-10 xl:px-12">

        {/* Logo + name */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-lg">
            <img
              src={logo}
              alt="ASTUMSJ Bootcamp"
              className="h-10 w-10 object-contain"
            />
          </div>

          <div>
            <h1 className="text-lg font-bold text-white xl:text-xl">
              ASTUMSJ
            </h1>

            <p className="text-sm font-semibold tracking-wide text-[#16B86A]">
              SUMMER BOOTCAMP
            </p>
          </div>
        </div>

        {/* Message */}
        <div className="mt-24 max-w-md xl:mt-28">

          <h2 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
            Learn.
            <br />
            Practice.
            <br />

            <span className="text-[#16B86A]">
              Succeed.
            </span>
          </h2>

          <div className="mt-6 h-1 w-12 rounded-full bg-[#16B86A]" />

          <p className="mt-6 text-base leading-7 text-blue-100 xl:text-lg xl:leading-8">
            Empowering Muslim students to build real-world
            skills, solve problems, connect with mentors,
            and grow through technology.
          </p>

          {/* Small slogan */}
          <p className="mt-6 text-sm font-semibold tracking-wider text-[#0AA6A6]">
            LEARN • CODE • BUILD • LEAD
          </p>
        </div>
      </div>

      {/* Laptop image
      <div className="relative z-10 mt-6 flex justify-center">
        <img
          src="./Login-laptop.png"
          alt="ASTUMSJ Bootcamp dashboard"
          className="block w-full object-contain drop-shadow-2xl"
        />
      </div> */}

    </div>
  );
};

export default LeftPanel;