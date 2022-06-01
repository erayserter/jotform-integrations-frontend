import React, { forwardRef } from "react";

import classes from "./ModalBox.module.css";

import useOnClickOutside from "../Hooks/useOnClickOutside";

const ModalBox = forwardRef(function ModalBox(props, ref) {
  useOnClickOutside(ref, () => props.onModalBoxClose(false));

  return (
    <div className={classes["modalbox"]}>
      <div className={classes["modal-content"]} ref={ref}>
        {props.children}
        <button
          className={classes["closeButton"]}
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
});

export default ModalBox;
