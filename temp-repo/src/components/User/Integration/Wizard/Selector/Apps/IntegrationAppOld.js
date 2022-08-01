import React, { useState, Fragment } from "react";
import { usePopper } from "react-popper";

import classes from "./IntegrationApp.module.css";

const IntegrationApp = (props) => {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom",
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
  });

  const clickHandler = (event) => {
    props.onAppSelect(props.appId);
  };

  return (
    <Fragment>
      <img
        className={classes["app-image"]}
        ref={setReferenceElement}
        onClick={clickHandler}
        alt=""
        src={props.appImg}
      />
      <div
        className={classes["popper"]}
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
      >
        {props.name}
        <div
          className={classes["arrow"]}
          ref={setArrowElement}
          style={styles.arrow}
          data-popper-arrow
        ></div>
      </div>
    </Fragment>
  );
};

export default IntegrationApp;
