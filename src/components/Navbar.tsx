import React from "react";

function Navbar() {
  return (
    <nav className="flex justify-center bg-slate-700">
      <div className="ml-auto m-4">
        <img src="/logo.png" className="ml-auto w-48" />
        <a
          href="https://eyad.vercel.app"
          target="_blank"
          className="m-2 px-3 py-1 hover:border-b-2 hover:border-white ease-linear duration-200 border-b-2 border-slate-700 text-white cursor-pointer "
        >
          Demo by @Eyad
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
