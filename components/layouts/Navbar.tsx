"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Routing from "./Routing";
import { Menu, ChevronRight } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const pathName = usePathname();
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <div className="navbar-center navbar bg-slate-200 text-sky-500 shadow-sm flex justify-between">
      <Link
        href="#"
        className={
          "navbar-start flex gap-5 text-2xl font-bold " +
          (pathName === "/" ? "text-purple-500" : "")
        }
      >
        {" "}
        Panuwat_V
      </Link>

      <div className="navbar-end hidden md:flex">
        <Routing></Routing>
      </div>
      <div className="flex w-full justify-end md:hidden">
        <button
          className=" bg-white rounded-full p-2"
          onClick={() => setOpenMenu(!openMenu)}
        >
          {!openMenu ? <Menu /> : <ChevronRight color="#de0d0d" />}
        </button>
      </div>
      <div className="md:hidden ">
        {openMenu && (
          <div
            className="absolute left-0 top-14 bg-white text-end p-5 w-full h-screen"
            onClick={() => setOpenMenu(!openMenu)}
          >
            <Routing classStyle="grid"></Routing>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
