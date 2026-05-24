import React from "react";
import "./carousel.css";

function CarouselSkills({
  title,
  skillsList,
}: {
  title?: string;
  skillsList: {
    name: string;
    className: string;
  }[];
}) {
  return (
    <div>
      {title && (
        <h2 className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent text-2xl font-bold  text-center my-4">
          {title}
        </h2>
      )}
      <div className="">
        <div className=" flex flex-wrap justify-center items-center gap-4 py-4">
          {skillsList.map((skill) => (
            <p
              key={skill.name}
              className={` rounded-2xl px-5 py-6 flex justify-center items-center font-bold ${skill.className}`}
            >
              {skill.name}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CarouselSkills;
