"use client";

import CarouselSkills from "@/components/UI/Carousel";
import { CircleCheck } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const skillsFE = [
  { name: "NextJS", className: "bg-black text-white" },
  { name: "ReactJS", className: "bg-cyan-200 text-cyan-700" },
  { name: "AntDesign", className: "bg-blue-100 text-blue-600" },
  { name: "Bootstrap", className: "bg-violet-200 text-violet-700" },
  { name: "MaterialUI", className: "bg-indigo-200 text-indigo-700" },
  { name: "Tailwind", className: "bg-sky-200 text-sky-700" },
  { name: "HTML", className: "bg-orange-100 text-orange-700" },
  { name: "JavaScript", className: "bg-yellow-300 text-black" },
  { name: "TypeScript", className: "bg-blue-500 text-white" },
  { name: "CSS", className: "bg-blue-100 text-blue-700" },
  { name: "SCSS", className: "bg-pink-100 text-pink-700" },
];
const skillsBE = [
  { name: "NodeJS", className: "bg-green-200 text-green-700" },
  { name: "ExpressJS", className: "bg-gray-200 text-gray-700" },
  { name: "NestJS", className: "bg-rose-200 text-rose-700" },
  { name: "Golang", className: "bg-sky-200 text-sky-700 " },
  { name: "MYSQL", className: "bg-slate-200 text-slate-700" },
  { name: "MongoDB", className: "bg-green-300 text-green-800" },
  { name: "PostgreSQL", className: "bg-blue-300 text-blue-800" },
  { name: "Prisma", className: "bg-zinc-800 text-white" },
  { name: "Supabase", className: "bg-emerald-200 text-emerald-700" },
];
const skillsTools = [
  { name: "Figma", className: "bg-pink-200 text-pink-700" },
  { name: "VS Code", className: "bg-blue-200 text-blue-700" },
  { name: "Postman", className: "bg-orange-200 text-orange-700" },
  { name: "APIdog", className: "bg-purple-200 text-purple-700" },
  { name: "AI Prompt", className: "bg-red-200 text-red-700" },
  { name: "CapCut", className: "bg-black text-white" },
  { name: "Canva", className: "bg-cyan-100 text-cyan-700" },
  { name: "Git", className: "bg-orange-100 text-orange-700" },
  { name: "GitHub", className: "bg-gray-900 text-white" },
  { name: "Vercel", className: "bg-black text-white" },
  { name: "Plesk", className: "bg-gray-200 text-gray-700" },
  { name: "Docker", className: "bg-blue-100 text-blue-700" },
];

export default function Home() {
  return (
    <div className="">
      <section
        className="relative min-h-screen overflow-hidden bg-base-100"
        id="intro"
      >
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
      <section
        className="relative p-5"
        id="skills"
      >
        {/* Background Glow */}
        <div className="absolute left-0 items-center w-full h-full bg-cyan-500/10 blur-3xl rounded-full"></div>

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
          <CarouselSkills
            title="Frontend Technologies"
            skillsList={skillsFE}
          />
          <CarouselSkills
            title="Backend Technologies"
            skillsList={skillsBE}
          />
          <CarouselSkills
            title="Tools"
            skillsList={skillsTools}
          />
        </div>
      </section>
      <section className="container m-auto p-5">
        <div className="divider divider-info text-blue-950 text-2xl md:text-4xl font-bold">
          <span className="text-red-400">
            Lan<span className="text-cyan-400">guage</span>
          </span>
          <span>Skills</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="bg-base-200 border border-base-300 rounded-3xl p-8 shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 rounded-full bg-red-400"></div>
              <p className="text-2xl font-bold text-white">Thai</p>
            </div>

            <p className="text-lg text-cyan-400 font-semibold">
              Native Speaker
            </p>

            <div className="mt-5">
              <progress
                className="progress progress-accent"
                value="100"
                max="100"
              ></progress>
            </div>
          </div>

          <div className="bg-base-200 border border-base-300 rounded-3xl p-8 shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 rounded-full bg-cyan-400"></div>
              <p className="text-2xl font-bold text-white">English</p>
            </div>

            <p className="text-lg text-cyan-400 font-semibold">A2 Level</p>

            <div className="mt-5">
              <progress
                className="progress progress-accent"
                value="50"
                max="100"
              ></progress>
            </div>
          </div>

          <div className="bg-base-200 border border-base-300 rounded-3xl p-8 shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 rounded-full bg-pink-400"></div>
              <p className="text-2xl font-bold text-white">Japanese</p>
            </div>

            <p className="text-lg text-cyan-400 font-semibold">studying N4</p>

            <div className="mt-5">
              <progress
                className="progress progress-accent"
                value="60"
                max="100"
              ></progress>
            </div>
          </div>
        </div>
      </section>
      <section
        className="bg-slate-800  p-5"
        id="experience"
      >
        <div className="container text-pretty m-auto">
          <p className="text-4xl md:text-6xl font-bold mt-3 text-transparent bg-linear-30 from-emerald-500 from-40% to-slate-900 bg-clip-text text-center py-5">
            Experience
          </p>
          <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
            <li>
              <div className="timeline-middle">
                <CircleCheck className="text-success" />
              </div>
              <div className="timeline-start mb-10 md:text-end  w-full">
                <time className="font-mono italic">2019</time>

                <div className="card lg:card-side bg-base-100 shadow-sm">
                  <figure className="w-full">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/5/54/Logo_of_Silpakorn_University.svg"
                      alt="University Logo"
                      className="object-contain p-5 bg-white"
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">
                      Silpakorn University [ 2019 - 2023 ]
                    </h2>
                    <p>Faculty of SCIENCE</p>
                    <p>BACHELOR OF SCIENCE</p>
                    <p>GPA : 2.64</p>
                    <div className="text-start">
                      <p>Thesis</p>
                      <p>
                        Developing a parasite classification system using
                        Convolutional Neural Networks (CNN) to analyze parasite
                        shapes in images. Building a web interface with Angular
                        to upload images, which are then processed by a
                        pre-trained AI model. Returning classification results
                        to the web interface for users to view analysis outcomes
                        directly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="bg-success" />
            </li>
            <li>
              <div className="timeline-middle">
                <CircleCheck className="text-success" />
              </div>
              <div className="timeline-end mb-10  w-full">
                <time className="font-mono italic">2023</time>

                <div className="card lg:card-side bg-base-100 shadow-sm">
                  <figure className="w-full">
                    <img
                      src="https://media.licdn.com/dms/image/v2/C510BAQG-UViz7dMvwg/company-logo_200_200/company-logo_200_200/0/1630626476395?e=1781136000&v=beta&t=15Iugghs2D7MAcwMWudPghGYvnFcOKr1iRf6LfWjZyY"
                      alt="Grows IT Logo"
                      className=" object-contain p-5 bg-white"
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">Grows IT [ 2023 - 2024 ]</h2>
                    <p>Frontend Developer</p>
                    <ul className="list-disc">
                      <li>
                        Translated UX/UI designs into high-quality code,
                        developing responsive user interfaces and interactive
                        front-end functionalities using Angular, React and
                        Next.js.
                      </li>
                      <li>
                        Analyzed technical challenges and engineered effective
                        solutions to optimize web application workflows and meet
                        operational requirements.
                      </li>
                      <li>
                        {" "}
                        Collaborated closely with QA/Testing teams to
                        efficiently troubleshoot, debug, and resolve reported
                        software defects.{" "}
                      </li>
                      <li>
                        Seamlessly integrated backend RESTful APIs, ensuring
                        smooth data synchronization, efficient state management,
                        and dynamic content rendering.
                      </li>
                      <li>
                        Managed source code and version control utilizing Git,
                        collaborating with the team through branch management
                        and pull requests.
                      </li>
                      <li>
                        Utilized Docker to containerize and test localized
                        development environments, ensuring cross- platform
                        consistency and reliable deployment.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <hr className="bg-success" />
            </li>
            <li>
              <div className="timeline-middle">
                <CircleCheck className="text-success" />
              </div>
              <div className="timeline-start mb-10 md:text-end w-full">
                <time className="font-mono italic">2025</time>

                <div className="card lg:card-side bg-base-100 shadow-sm">
                  <figure className="w-full">
                    <img
                      src="https://imp.imperialplaza.co.th/ImperialWorld-logo.png"
                      alt="Imperial World Logo"
                      className=" object-contain p-5 bg-white"
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">
                      Imperial world plaza [ 2025 - 2026 ]
                    </h2>
                    <p>System analyst and developer</p>
                    <ul className="list-disc text-start">
                      <li>
                        Collaborated with stakeholders to gather user
                        requirements, analyze technical challenges, and
                        translate them into functional system solutions.
                      </li>
                      <li>
                        Architected end-to-end system structures, including
                        relational database schemas (SQL) and intuitive UX/UI
                        layouts to ensure optimal user experience.
                      </li>
                      <li>
                        Developed and implemented responsive front-end
                        interfaces and scalable back-end APIs using React,
                        Next.js, Node.js, and NestJS with MySQL.
                      </li>
                      <li>
                        Conducted thorough testing, debugging, and
                        troubleshooting to ensure software quality, high
                        performance, and system reliability.
                      </li>
                      <li>
                        Managed application deployment and server configuration
                        on production environments via the Plesk platform.
                      </li>
                      <li>
                        Provided internal IT support and technical assistance to
                        maintain smooth day-to-day organizational operations.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <hr className="bg-success" />
            </li>

            <li>
              <div className="timeline-middle">
                <CircleCheck className="text-info" />
              </div>
              <div className="timeline-end mb-10 w-full">
                <time className="font-mono italic">2026</time>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
