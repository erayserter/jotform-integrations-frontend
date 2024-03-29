import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import configurations from "../../config";
import { setIsLoggedIn } from "../../store/user";
import { usePopper } from "react-popper";
import useOnClickOutside from "../Hooks/useOnClickOutside";

const Navbar = (props) => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [
      { name: "arrow", options: { element: arrowElement } },
      { name: "offset", options: { offset: [-62, 0] } },
    ],
  });
  const accountMenuRef = useRef();
  useOnClickOutside({ accountMenuRef }, () => setShowAccountMenu(false));

  const expandMenuHandler = (event) => {
    setIsExpanded((prev) => !prev);
  };

  const logoutHandler = async () => {
    const response = await fetch(
      "https://" +
        configurations.DEV_RDS_NAME +
        ".jotform.dev/intern-api/logout"
    ).then((data) => data.json());

    if (response.responseCode === 200) {
      dispatch(setIsLoggedIn({ isLoggedIn: false }));
    }
  };

  return (
    <header
      className={`navbar min-h-18 flex items-center z-8 shrink-1 justify-between color-white w-full max-w-100vw mx-auto ${
        isExpanded
          ? "isExpanded flex-wrap h-100vh absolute bg-white"
          : "bg-navy-700"
      }`}
    >
      <div
        className={
          "navbar-logo flex items-center m-0 p-0 xs:px-5 md:px-3 lg:px-5"
        }
      >
        <Link
          className="logo block my-5 mr-3 ml-5 w-7 h-7 xs:m-0 xs:w-40 max-h-14 md:flex xs:h-full p-0 overflow-hidden"
          to="/"
        >
          <svg
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 367 66"
            class="xs:max-w-full xs:w-full w-40"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M256.78 50.67a8.46 8.46 0 01-6.05-2.44c-1.6-1.6-2.68-4.03-2.68-7.31 0-3.32 1.08-5.74 2.68-7.34a8.47 8.47 0 016.05-2.4c2.28 0 4.45.8 6.05 2.4 1.6 1.6 2.67 4.02 2.67 7.34 0 3.32-1.07 5.74-2.67 7.34a8.47 8.47 0 01-6.05 2.4zm0-30.1c-11.58 0-20.35 8.52-20.35 20.35 0 11.75 8.77 20.35 20.35 20.35 11.58 0 20.35-8.6 20.35-20.35 0-11.83-8.77-20.35-20.35-20.35zM160.5 50.95a8.46 8.46 0 01-6.05-2.44c-1.6-1.6-2.67-4.02-2.67-7.3 0-3.32 1.08-5.75 2.67-7.34a8.47 8.47 0 016.06-2.41c2.28 0 4.45.81 6.05 2.4 1.6 1.6 2.67 4.03 2.67 7.34 0 3.32-1.08 5.75-2.67 7.34a8.47 8.47 0 01-6.06 2.41zm0-30.1c-11.57 0-20.34 8.53-20.34 20.35 0 11.76 8.77 20.35 20.34 20.35 11.58 0 20.35-8.6 20.35-20.35 0-11.82-8.77-20.34-20.34-20.34zM308.77 61.14h11.55V38.2c0-1.9.6-3.55 1.64-4.71a5.9 5.9 0 014.56-1.9c2.08 0 3.5.7 4.41 1.76.93 1.08 1.4 2.65 1.4 4.55v23.24h11.48V38.2c0-1.85.6-3.5 1.64-4.69a5.78 5.78 0 014.48-1.92c2.13 0 3.54.7 4.44 1.76.92 1.08 1.38 2.65 1.38 4.55v23.24H367v-25.3c0-5.17-1.7-8.94-4.39-11.4-2.67-2.45-6.23-3.54-9.8-3.54-2.55 0-4.88.44-6.97 1.49-1.79.9-3.36 2.22-4.74 4.06-2.23-3.63-6.3-5.55-11.1-5.55-3.52 0-7.57 1.4-10.13 4.1v-3.16h-11.1v39.3zM304.42 21.87v11.77l-.9-.18c-1.07-.21-2-.29-2.86-.29-2.45 0-4.63.6-6.19 2.06-1.55 1.45-2.62 3.86-2.62 7.74v18.17h-11.52v-39.3h11.22v3.8c2.77-3.34 7.08-4 9.79-4 .86 0 1.65.09 2.4.16l.68.07zM96.72 42.2h11.26l.13.13c.08.08.14.2.15.33a7.98 7.98 0 002.64 5.57 8 8 0 005.26 1.8 7.3 7.3 0 005.65-2.39 8.91 8.91 0 002.03-5.98V8.74h12.18V42c0 10.65-8.15 19.55-19.78 19.55-5.8 0-10.68-1.93-14.1-5.28-3.34-3.27-5.33-7.94-5.42-13.62v-.45zM234.8 14.07l.64.19V5.34l-.3-.13a8.63 8.63 0 00-2.01-.53c-.85-.14-1.85-.23-2.87-.23-3.97 0-8.43 1.32-10.74 3.69-2.31 2.36-3.59 5.73-3.59 9.77v1.88h-5.8v10.24h5.8v31.11h11.65V30.03h7.86V19.79h-7.86v-1.74c0-1.81.63-2.86 1.44-3.46a4.92 4.92 0 012.94-.85c1.5 0 2.38.2 2.84.33zM205.96 51.95l.6-.19v8.95l-.28.14c-.42.2-1.1.39-1.89.53-.8.13-1.73.22-2.7.22-3.72 0-7.9-1.32-10.07-3.7-2.17-2.37-3.37-5.75-3.37-9.8V30.03h-5.45V19.84h5.45V8.8h10.93v11.05h7.38v10.2h-7.38v17.91c0 1.82.6 2.87 1.36 3.48.78.63 1.81.85 2.76.85 1.41 0 2.23-.2 2.66-.33z"
              class="jl-text"
              fill="#fff"
            ></path>
            <path
              d="M16.43 62.73c1.24 1.2.36 3.27-1.4 3.27H3.95A3.9 3.9 0 010 62.16V51.44c0-1.72 2.13-2.57 3.38-1.36l13.05 12.65z"
              class="jl-pen-tip"
              fill="#fff"
            ></path>
            <path
              d="M33.72 63.56a8.3 8.3 0 010-11.78l11.82-11.74a8.42 8.42 0 0111.86 0 8.3 8.3 0 010 11.78L45.58 63.56a8.42 8.42 0 01-11.86 0z"
              class="jl-pen-bottom"
              fill="#FFB629"
            ></path>
            <path
              d="M2.5 34.05a8.3 8.3 0 010-11.78L22.39 2.5a8.42 8.42 0 0111.86 0 8.3 8.3 0 010 11.78l-19.9 19.77a8.42 8.42 0 01-11.85 0z"
              class="jl-pen-top"
              fill="#09F"
            ></path>
            <path
              d="M18.76 48.15a8.3 8.3 0 010-11.78l26.87-26.7a8.42 8.42 0 0111.86 0 8.3 8.3 0 010 11.78l-26.87 26.7a8.42 8.42 0 01-11.86 0z"
              class="jl-pen-middle"
              fill="#FF6100"
            ></path>
          </svg>
        </Link>
      </div>
      <div className="menu-mobile flex md:hidden justify-center items-center ml-3 flex-nowrap">
        <button
          className={`mobile__hamburger mr-0 h-16 w-12 cursor-pointer relative bg-transparent`}
          onClick={expandMenuHandler}
        >
          <label
            className={
              "pointer-events-none absolute top-2/4 left-2/4 color-white cursor-pointer" +
              (isExpanded ? " active" : "")
            }
          >
            <div className="bar-wrapper absolute h-full w-full left-0 top-0">
              <div className="bar top-bar absolute h-full w-full left-0 top-0"></div>
              <div className="bar middle-bar absolute h-full w-full left-0 top-0"></div>
              <div className="bar bottom-bar absolute h-full w-full left-0 top-0"></div>
            </div>
          </label>
        </button>
      </div>
      <div
        className={`menu md:flex color-white mx-2 my-0 w-full ${
          isExpanded
            ? "justify-start flex flex-col overflow-x-hidden overflow-y-auto pb-6"
            : "justify-end hidden"
        }`}
      >
        {isLoggedIn && (
          <div ref={accountMenuRef}>
            <ul
              className="p-0 m-0 items-center flex-nowrap justify-end"
              ref={setReferenceElement}
            >
              <li className="menu-list-item cursor-pointer p-3 relative w-18 h-18">
                <div
                  onClick={(e) => setShowAccountMenu((prev) => !prev)}
                  className={`menu-list-item__link radius-full border-2 border-solid border-black border-opacity-30 w-12 h-12 cursor-pointer p-0 bg-no-repeat bg-size-cover my-0 mx-auto inline-block relative whitespace-nowrap line-height-70 font-normal`}
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/a/AATXAJw7-enkIx0trd2ZVHHpIU_2BzI70ZqeA5gqR_QU=s96-c")`,
                  }}
                ></div>
              </li>
            </ul>
            {showAccountMenu && (
              <div>
                <div
                  ref={setPopperElement}
                  style={styles.popper}
                  {...attributes.popper}
                  className="border-x border-b border-navy-100 radius-lg color-black bg-white"
                >
                  <div className="py-3 px-6 flex flex-row">
                    <div
                      className={`menu-list-item__link radius-full border-2 border-solid border-black border-opacity-30 w-12 h-12 p-0 bg-no-repeat bg-size-cover my-0 mx-auto inline-block relative whitespace-nowrap line-height-70 font-normal`}
                      style={{
                        backgroundImage: `url("https://lh3.googleusercontent.com/a/AATXAJw7-enkIx0trd2ZVHHpIU_2BzI70ZqeA5gqR_QU=s96-c")`,
                      }}
                    ></div>
                    <div className="flex flex-col justify-center pl-3">
                      <p className="color-navy-300">Hello,</p>
                      <p>Bahadır Ersöz</p>
                    </div>
                  </div>
                  <Link
                    to="/login"
                    className={`color-red-400 inline-block relative px-4 whitespace-nowrap py-3 px-6 ${
                      isExpanded ? "w-full font-normal line-height-6xl" : ""
                    }`}
                    onClick={logoutHandler}
                  >
                    Logout
                  </Link>
                  <div ref={setArrowElement} style={styles.arrow} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
