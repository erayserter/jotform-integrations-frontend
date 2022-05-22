import React, { useState, Fragment, useRef } from "react";
import { usePopper } from "react-popper";

import classes from "./IntegrationApp.module.css";

const IntegrationApp = (props) => {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
    placement: "bottom",
  });

  const clickHandler = (event) => {
    props.onAppSelect(props.id);
  };

  return (
    <div className={classes["app-container"]}>
      <img
        className={classes["app-image"]}
        onClick={clickHandler}
        alt=""
        src={props.img}
        ref={setReferenceElement}
      />
      <div ref={setPopperElement} style={styles.popper} {...attributes.popper}>
        {props.name}
        <div ref={setArrowElement} style={styles.arrow} />
      </div>
    </div>
  );
};

export default IntegrationApp;
