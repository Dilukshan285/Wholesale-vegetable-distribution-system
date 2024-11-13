import { Link } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Dropdown } from "flowbite-react";
import { signoutSuccess } from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const apiURL = "http://localhost:3001";
  const navigate = useNavigate();
  

  const handleSignout = async () => {
    try {
      const res = await fetch(apiURL + "/api/auth/signout", {
        method: "POST",
        credentials: 'include', 
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        navigate("/sign-in");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <header className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-emerald-50 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-1 flex flex-col sm:flex-row items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
          <FaLeaf className="text-emerald-50 w-6 h-6" aria-hidden="true" />
          <span
            className="text-xl font-bold text-white"
            role="heading"
            aria-level="1"
          >
            G.S.P Traders
          </span>
        </div>

        {/* Navigation Section */}
        <nav className="flex-grow flex justify-center">
          <ul className="flex space-x-4 sm:space-x-8 justify-center items-center">
            <li>
              <Link
                className="hover:text-emerald-200 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 rounded-sm px-2 py-1"
                to="/"
                aria-label="Home"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-emerald-200 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 rounded-sm px-2 py-1"
                to="/products"
                aria-label="Products"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-emerald-200 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 rounded-sm px-2 py-1"
                to="/about"
                aria-label="About"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-emerald-200 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 rounded-sm px-2 py-1"
                to="/view-product"
                aria-label="About"
              >
                Offcut
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-emerald-200 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 rounded-sm px-2 py-1"
                to="/my-orders"
                aria-label="cart"
              >
                My orders
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-emerald-200 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 rounded-sm px-2 py-1"
                to="/cart"
                aria-label="cart"
              >
                Cart
              </Link>
            </li>
          </ul>
        </nav>

        {/* Sign In / User Profile Section */}
        <div className="hidden sm:flex items-center space-x-4">
          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={
                      currentUser.avatar
                    }
                    alt="user"
                    className="object-cover w-full h-full"
                  />
                </div>
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">
                  {currentUser.first_name} {currentUser.last_name}
                </span>
                <span className="block text-sm font-medium truncate">
                  {currentUser.email}
                </span>
              </Dropdown.Header>
              <Link to={"/dashboard/profile"}>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to="/sign-in">
              <button className="bg-yellow-300 text-emerald-800 hover:bg-yellow-400 active:bg-yellow-500 font-bold py-1.5 px-4 rounded-lg transition duration-300">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
