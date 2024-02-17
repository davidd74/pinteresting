import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import logo from "../assets/logo.png";
import { GoSearch } from "react-icons/go";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { getUser } from "../utils/getUser";

const Navbar = () => {
  const user = getUser();

  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchSubmit = () => {
    navigate(`/search/${searchValue}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return (
    <nav className="flex items-center justify-between mt-6 rounded-full xs:bg-white xs:gap-5 xl:gap-10 xs:p-3 md:p-4 md:px-8">
      <div className="w-12 cursor-pointer">
        <Link to="/">
          <img src={logo} alt="logo-img" />
        </Link>
      </div>
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search"
          className="w-full pr-4 bg-slate-100 rounded-3xl pl-14 xs:py-2 md:py-3"
          value={searchValue}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <span onClick={handleSearchSubmit}>
            <GoSearch className="cursor-pointer xs:text-xl lg:text-2xl" />
          </span>
        </div>
      </div>
      <div>
        <Link to="/CreatePost">
          <AiOutlinePlusCircle className="cursor-pointer xs:text-3xl lg:text-4xl" />
        </Link>
      </div>
      <div className="cursor-pointer xs:w-14 md:w-12">
        <Link to={`/UserProfile/${user?.sub}`}>
          <img src={user?.picture} alt="user-pfp" className="rounded-full" />
          {console.log(user?.picture)}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
