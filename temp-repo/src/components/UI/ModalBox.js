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
        className={`${classes["modal-content"]} absolute top-1/2 left-1/2 bg-white radius overflow-hidden`}
        ref={ref}
      >
        {props.children}
        <button
          className={`${classes["closeButton"]} absolute right-5 top-5 px-3 pt-3 pb-2 m-0 bg-navy-75 cursor-pointer`}
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
