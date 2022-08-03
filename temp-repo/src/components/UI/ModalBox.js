import React, { useRef } from "react";

import classes from "./ModalBox.module.css";

import useOnClickOutside from "../Hooks/useOnClickOutside";

const ModalBox = (props) => {
  const ref = useRef();

  useOnClickOutside(ref, () => props.onModalBoxClose(false));

  return (
    <div
      className={`${classes["modalbox"]} fixed z-2 left-0 top-0 w-full h-full overflow-auto`}
    >
      <div
        id="modal-content"
        className={`${classes["modal-content"]} flex flex-col grow-1 absolute top-0 left-0 w-full h-full md:max-w-md md:h-auto md:top-1/2 md:left-1/2 bg-white radius overflow-auto`}
        ref={ref}
      >
        {props.children}
        <button
          className={`absolute cursor-pointer top-4 right-4 md:top-5 md:right-5 p-3 m-0 bg-navy-75 radius-full`}
          onClick={() => props.onModalBoxClose(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 17 16"
            width="16"
            height="16"
          >
            <path
              d="M9.514 8l6.438-6.408a.933.933 0 10-1.32-1.319L8.225 6.711 1.817.273a.933.933 0 00-1.319 1.32L6.936 8.03.498 14.408a.933.933 0 101.32 1.319l6.437-6.438 6.377 6.438a.933.933 0 001.32-1.32L9.514 8z"
              fill="#A8AAB5"
              fillRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ModalBox;
