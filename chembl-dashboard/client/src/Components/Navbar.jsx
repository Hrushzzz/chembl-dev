import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/molecule.png";

function Navbar() {
  return (
    <div>
      <nav className="bg-green-100 p-4 text-white flex flex-row justify-between items-center">
        <div className="flex items-center space-x-2 text-xl font-bold">
          <Link to="/">
            <img className="w-[50px]" src={Logo} alt="Logo" />
          </Link>
          <Link to="/" className="text-purple-600 hover:text-black-900">
            chEMBL dashboard
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
