import logo from "../assets/logo.png";
const LeftPanel = () => {
  return (
    <div className="relative hidden min-h-screen overflow-hidden bg-[#01071d] lg:flex lg:w-[38%] lg:flex-col lg:justify-between">
      <div className="absolute -right-24 top-32 h-72 w-72 rounded-full bg-blue-900/30" />

      <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-blue-900/30" />

      <div className="absolute right-8 top-8 grid grid-cols-5 gap-2 opacity-40">
        {Array.from({ length: 25 }).map((_, index) => (
          <span key={index} className="h-1 w-1 rounded-full bg-blue-400" />
        ))}
      </div>

      <div className="relative z-10 px-10 pt-10 xl:px-12">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg">
            <img
              src={logo}
              alt="Bootcamp Management System Logo"
              className="h-12 w-12 object-contain"
            />
          </div>

          <h1 className="text-lg font-semibold text-white xl:text-xl">
            ASTUMSJ Summer BootCamp
          </h1>
        </div>

        <div className="mt-24 max-w-md xl:mt-28">
          <h2 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
            Learn.
            <br />
            Practice.
            <br />
            <span className="text-[#4f7cff]">Succeed.</span>
          </h2>

          <div className="mt-6 h-1 w-12 rounded-full bg-[#4f7cff]" />

          <p className="mt-6 text-base leading-7 text-blue-100 xl:text-lg xl:leading-8">
            Empowering learners to build skills, connect with mentors, manage
            courses, and achieve their goals.
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-6 flex justify-center ">
        <img
          src="./Login-laptop.png"
          alt="Bootcamp dashboard"
          className="block w-full  object-contain drop-shadow-2xl"
        />
      </div>
    </div>
  );
};

export default LeftPanel;
