"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

function Navbar() {
  const pathName = usePathname();
  const param = useParams();
  return (
    <div className="navbar bg-slate-200 text-sky-500 shadow-sm px-5">
      <Link
        href="/"
        className={
          "navbar-start flex gap-5 text-2xl font-bold " +
          (pathName === "/" ? "text-purple-500" : "")
        }
      >
        {" "}
        Panuwat_V
      </Link>

      <div className="navbar-end gap-5">
        <Link
          href="#intro"
          className={param.id === "intro" ? "text-purple-500" : ""}
        >
          Intro
        </Link>
        <Link
          href="#skills"
          className={param.id === "skills" ? "text-purple-500" : ""}
        >
          Skills
        </Link>
        <Link
          href="#experience"
          className={param.id === "experience" ? "text-purple-500" : ""}
          transitionTypes={["slide-in"]}
        >
          Experience
        </Link>
        <Link
          href="#projects"
          className={param.id === "projects" ? "text-purple-500" : ""}
        >
          Projects
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
