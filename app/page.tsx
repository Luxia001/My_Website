import Link from "next/link";

const skills = [
  { name: "Figma", className: "bg-pink-200 text-pink-700" },
  { name: "VS Code", className: "bg-blue-200 text-blue-700" },
  { name: "Postman", className: "bg-orange-200 text-orange-700" },
  { name: "APIdog", className: "bg-purple-200 text-purple-700" },
  { name: "AI Prompt", className: "bg-red-200 text-red-700" },
  { name: "NextJS", className: "bg-black text-white" },
  { name: "ReactJS", className: "bg-cyan-200 text-cyan-700" },
  { name: "NestJS", className: "bg-rose-200 text-rose-700" },
  { name: "AntDesign", className: "bg-blue-100 text-blue-600" },
  { name: "Bootstrap", className: "bg-violet-200 text-violet-700" },
  { name: "MaterialUI", className: "bg-indigo-200 text-indigo-700" },
  { name: "Tailwind", className: "bg-sky-200 text-sky-700" },
  { name: "HTML", className: "bg-orange-100 text-orange-700" },
  { name: "JavaScript", className: "bg-yellow-300 text-black" },
  { name: "TypeScript", className: "bg-blue-500 text-white" },
  { name: "CSS", className: "bg-blue-100 text-blue-700" },
  { name: "SCSS", className: "bg-pink-100 text-pink-700" },
  { name: "Node", className: "bg-green-200 text-green-800" },
  { name: "MYSQL", className: "bg-slate-200 text-slate-700" },
  { name: "Postgresql", className: "bg-indigo-100 text-indigo-700" },
  { name: "MongoDB", className: "bg-green-100 text-green-700" },
  { name: "Prisma", className: "bg-zinc-800 text-white" },
  { name: "Supabase", className: "bg-emerald-200 text-emerald-700" },
  { name: "Git", className: "bg-orange-100 text-orange-700" },
  { name: "GitHub", className: "bg-gray-900 text-white" },
  { name: "Vercel", className: "bg-black text-white" },
  { name: "Plesk", className: "bg-gray-200 text-gray-700" },
  { name: "Docker", className: "bg-blue-100 text-blue-700" },
  { name: "CapCut", className: "bg-black text-white" },
  { name: "Canva", className: "bg-cyan-100 text-cyan-700" },
];

export default function Home() {
  return (
    <div className="">
      <section className="relative min-h-screen overflow-hidden bg-base-100">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-cyan-500/10 blur-3xl rounded-full"></div>

        <div className="relative z-10 hero min-h-screen px-5 py-20">
          <div className="hero-content flex-col lg:flex-row gap-16 max-w-7xl">
            {/* Profile Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400/20 blur-3xl rounded-full"></div>

              <img
                src="profile.jpg"
                alt="profile"
                className="
            relative
            w-[240px] md:w-[320px]
            rounded-[2rem]
            border border-cyan-400/20
            shadow-[0_0_50px_rgba(34,211,238,0.25)]
            object-cover
          "
              />
            </div>

            {/* Content */}
            <div className="max-w-3xl">
              {/* Intro */}
              <div className="mb-6">
                <p className="uppercase tracking-[0.4em] text-cyan-400 text-sm font-semibold">
                  Full Stack Developer
                </p>

                <h1 className="mt-4 text-5xl md:text-7xl text-rotate font-black leading-tight">
                  <span>
                    <span className="block text-white">Hello World</span>
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      I&apos;m Panuwat
                    </span>
                  </span>
                </h1>
              </div>

              {/* Description */}
              <div className="bg-base-200/70 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
                <p className="text-base md:text-lg text-gray-300 leading-loose">
                  My name is{" "}
                  <span className="text-cyan-400 font-semibold">
                    Panuwat Wichitsiriwat
                  </span>
                  , a passionate Full Stack Developer with experience in
                  frontend and backend technologies. I enjoy building efficient,
                  scalable, and user-friendly applications that solve real-world
                  problems. I focus on clean architecture, responsive UI/UX, and
                  continuous learning to deliver high-quality solutions.
                </p>

                {/* Buttons */}
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  href={"mailto:panuwat.wichitsiriwat@gmail.com"}
                  className="btn btn-info text-white px-8"
                >
                  Contact Me
                </Link>

                <Link
                  href={"https://github.com/Luxia001"}
                  target="_blank"
                  className="btn btn-outline btn-info px-8"
                >
                  GitHub
                </Link>

                <Link
                  href={"https://www.linkedin.com/in/panuwat-v/"}
                  target="_blank"
                  className="btn btn-outline btn-primary px-8"
                >
                  LinkedIn
                </Link>
              </div>
              {/* Quick Contact */}
              <div className="md:flex gap-5 mt-10">
                <div className=" ">
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-lg font-semibold mt-2">092-947-3729</p>
                </div>

                <div className="">
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-lg font-semibold mt-2 break-all">
                    panuwat.wichitsiriwat@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="relative overflow-hidden py-20 px-5">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-3xl rounded-full"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <p className="text-sm tracking-[0.4em] uppercase text-cyan-400 font-semibold">
              Expertise
            </p>

            <h2 className="text-4xl md:text-6xl font-bold mt-3">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                My Skills
              </span>
            </h2>

            <p className="text-gray-400 mt-5 max-w-2xl mx-auto text-sm md:text-base">
              Technologies and tools I use to build modern, scalable, and
              beautiful web applications.
            </p>
          </div>

          {/* Skills */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-5">
            {skills.map((skill) => (
              <div
                key={skill.name}
                className={`
            group relative overflow-hidden rounded-2xl
            border border-white/10
            backdrop-blur-md
            px-5 py-6
            flex justify-center items-center
            transition-all duration-300
            hover:-translate-y-2
            hover:shadow-[0_10px_40px_rgba(34,211,238,0.15)]
            ${skill.className}
          `}
              >
                {/* Glow Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-br from-white/10 to-transparent"></div>

                {/* Text */}
                <p className="relative z-10 text-sm md:text-lg font-semibold tracking-wide">
                  {skill.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
