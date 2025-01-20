import { useEffect, useState } from "react";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link, matchPath, useLocation } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import { ACCOUNT_TYPE } from "../../utils/constants";
import ProfileDropdown from "../core/Auth/ProfileDropdown";


function Navbar() {
  const location = useLocation();
  const [courseCategories, setCourseCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.profile.user);
  const { totalItems } = useSelector((state) => state.cart);

  const fetchAllCategories = async () => {
    try {
      setIsLoading(true);
      const response = await apiConnector("GET", categories.GET_ALL_CATEGORIES_API);
      setCourseCategories(response?.data?.categories);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchAllCategories();
  }, []);


  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${location.pathname !== "/" ? "bg-richblack-800" : ""
        } transition-all duration-200`}
    >
      <div className="flex items-center justify-between w-11/12 max-w-maxContent">
        {/* Logo */}
        <Link to="/">
          {/* <img src={logo} alt="Logo" width={160} height={32} isLoading="lazy" /> */}
          <h1 className="text-white font-semibold fill-richblack-5 text-xl">CourseCloud</h1>
        </Link>
        {/* Navigation links */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${matchRoute("/catalog/:catalogName")
                        ? "text-yellow-25"
                        : "text-richblack-25"
                        }`}
                    >
                      <p>{link.title}</p>
                      <BsChevronDown />
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]" style={{ "overflowY": "scroll" }}>
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {isLoading ? (
                          <p className="text-center">Loading...</p>
                        ) : courseCategories.length ? (
                          <>
                            {courseCategories
                              ?.filter((subLink) => subLink?.courses?.length > 0)?.map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.categoryName.split(" ").join("-").toLowerCase()}`}
                                  className="py-4 pl-4 bg-transparent rounded-lg hover:bg-richblack-50"
                                  key={i}
                                >
                                  <p>{subLink.categoryName}</p>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${matchRoute(link?.path)
                        ? "text-yellow-25"
                        : "text-richblack-25"
                        }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        {/* Login / Signup / Dashboard */}
        <div className="items-center hidden gap-x-4 md:flex">
          {user && user?.userRole !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute grid w-5 h-5 overflow-hidden text-xs font-bold text-center text-yellow-100 rounded-full -bottom-2 -right-2 place-items-center bg-richblack-600">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {!user && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Log in
              </button>
            </Link>
          )}
          {!user && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Sign up
              </button>
            </Link>
          )}
          {user && <ProfileDropdown />}
        </div>
        <button className="mr-4 md:hidden">
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
        </button>
      </div>
    </div>
  )
}

export default Navbar
