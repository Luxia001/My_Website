import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

interface routeingI {
  classStyle?: string;
}

function Routing(classStyle: routeingI) {
  const param = useParams();
  return (
    <div className={" flex gap-5 " + classStyle.classStyle}>
      {" "}
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
  );
}

export default Routing;
