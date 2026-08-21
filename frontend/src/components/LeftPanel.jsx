import logo from "../assets/astumsj-logo.png";
const LeftPanel = () => {
  return (
    <div className="relative hidden min-h-screen overflow-hidden bg-[#062A5C] lg:flex lg:w-[38%] lg:flex-col lg:justify-between">
      <div className="absolute -right-24 top-32 h-72 w-72 rounded-full bg-[#0b3d91]/40" />

      <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-[#0aa6a6]/20" />

      <div className="absolute right-8 top-8 grid grid-cols-5 gap-2 opacity-40">
        {Array.from({ length: 25 }).map((_, index) => (
          <span key={index} className="h-1 w-1 rounded-full bg-[#16b86a]" />
        ))}
      </div>

      <div className="relative z-10 px-10 pt-10 xl:px-12">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">
            <img
              src={logo}
              alt="ASTUMSJ Bootcamp"
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white xl:text-xl">
              ASTUMSJ
            </h1>
            <p className="text-sm font-semibold tracking-wide text-[#16b86a]">
              SUMMER BOOTCAMP
            </p>
          </div>
        </div>

        <div className="mt-24 max-w-md xl:mt-28">
          <h2 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
            Learn.
            <br />
            Practice.
            <br />
            <span className="text-[#16b86a]">Succeed.</span>
          </h2>

          <div className="mt-6 h-1 w-12 rounded-full bg-[#16b86a]" />

          <p className="mt-6 text-base leading-7 text-blue-100 xl:text-lg xl:leading-8">
            Empowering Muslim to build real-world skills, connect with mentors,
            and grow through technology.
          </p>
          <p className="mt-6 text-sm font-semibold tracking-wider text-[#0aa6a6]">
            LEARN.CODE.BUILD.LEAD
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
