import React, { useState, useRef } from "react";
import { usePopper } from "react-popper";
import useOnClickOutside from "../Hooks/useOnClickOutside";

import classes from "./MatchFieldsContainer.module.css";

const MatchFieldsContainer = (props) => {
  const [referenceElementLeft, setReferenceElementLeft] = useState(null);
  const [popperElementLeft, setPopperElementLeft] = useState(null);
  let popper = usePopper(referenceElementLeft, popperElementLeft, {});
  const stylesLeft = popper.styles;
  const attributesLeft = popper.attributes;

  const [referenceElementRight, setReferenceElementRight] = useState(null);
  const [popperElementRight, setPopperElementRight] = useState(null);
  popper = usePopper(referenceElementRight, popperElementRight);
  const stylesRight = popper.styles;
  const attributesRight = popper.attributes;

  const [leftPopperOpen, setLeftPopperOpen] = useState(false);
  const [rightPopperOpen, setRightPopperOpen] = useState(false);

  const leftDropdownRef = useRef(null);
  const rightDropdownRef = useRef(null);

  useOnClickOutside(leftDropdownRef, () => {
    setLeftPopperOpen(false);
  });
  useOnClickOutside(rightDropdownRef, () => {
    setRightPopperOpen(false);
  });

  const [mappingChoices, setMappingChoices] = useState([
    {
      left: { placeholder: "Name", is_required: true, constant: true },
      right: {},
    },
  ]);

  const [searchLeft, setSearchLeft] = useState("");
  const [searchRight, setSearchRight] = useState("");

  return (
    <div className={classes["match-fields"]}>
      <div className={classes["match-fields__title"]}>
        <label>{props.label}</label>
      </div>
      <div className={classes["match-fields__container"]}>
        <div className={classes["match-fields__fields"]}>
          <div className={classes["fields__title"]}>
            <img src={props.apps.destination.img} />
            <div className={classes["fields__text"]}>
              <span>{props.apps.destination.name}</span>
            </div>
          </div>
          <div
            className={`${classes["fields__title"]} ${classes["fields__title--right"]}`}
          >
            <img src={props.apps.source.img} />
            <div className={classes["fields__text"]}>
              <span>{props.apps.source.name}</span>
            </div>
          </div>
          {mappingChoices.map((choice) => {
            return (
              <div className={classes["match-fields__mapping"]}>
                <div className={classes["mapping__leftside"]}>
                  <div className={classes["mapping__dropdown"]}>
                    <div
                      className={classes["dropdown__wrapper"]}
                      ref={leftDropdownRef}
                    >
                      <button
                        className={`${
                          choice.left.constant && classes["disabled"]
                        } ${classes["dropdown__button"]}`}
                        ref={setReferenceElementLeft}
                      >
                        <div
                          className={`${classes["dropdown__text"]} ${
                            !choice.left.placeholder && classes["placeholder"]
                          } ${choice.left.is_required && classes["required"]}`}
                        >
                          {choice.left.placeholder || "Please select..."}
                        </div>
                      </button>
                      {leftPopperOpen && (
                        <div
                          className={classes["dropdown__popper"]}
                          ref={setPopperElementLeft}
                          style={stylesLeft}
                          {...attributesLeft.popper}
                        >
                          <input
                            placeholder="Search fields..."
                            value={searchLeft}
                            onChange={(event) => {
                              setSearchLeft(event.target.value);
                            }}
                          ></input>
                          <ul>
                            <li
                              onClick={(event) => {
                                setLeftPopperOpen(false);
                              }}
                            >
                              Description
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className={classes["mapping__rightside"]}>
                  <div className={classes["mapping__dropdown"]}>
                    <div
                      className={classes["dropdown__wrapper"]}
                      ref={rightDropdownRef}
                    >
                      <button
                        className={`${
                          choice.right.constant && classes["disabled"]
                        } ${classes["dropdown__button"]}`}
                        ref={setReferenceElementRight}
                        onClick={(event) => {
                          if (!choice.right.constant) {
                            setRightPopperOpen((prev) => !prev);
                          }
                        }}
                      >
                        <div
                          className={`${classes["dropdown__text"]} ${
                            !choice.right.placeholder && classes["placeholder"]
                          } ${choice.right.is_required && classes["required"]}`}
                        >
                          {choice.right.placeholder || "Please select..."}
                        </div>
                      </button>
                      {rightPopperOpen && (
                        <div
                          className={classes["dropdown__popper"]}
                          ref={setPopperElementRight}
                          style={stylesRight.popper}
                          {...attributesRight.popper}
                        >
                          <input
                            placeholder="Search fields..."
                            value={searchRight}
                            onChange={(event) => {
                              setSearchRight(event.target.value);
                            }}
                          ></input>
                          <ul>
                            <li
                              onClick={(event) => {
                                setRightPopperOpen(false);
                              }}
                            >
                              Address
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className={classes["match-fields__add-mapping"]}>
            <button
              className={`${
                (!mappingChoices[0].right.placeholder ||
                  mappingChoices.length >= props.maxLength) &&
                classes["disabled"]
              }`}
              onClick={(event) => {
                if (
                  mappingChoices[0].right.placeholder &&
                  mappingChoices.length < props.maxLength
                )
                  setMappingChoices((prev) => [
                    ...prev,
                    { left: {}, right: {} },
                  ]);
              }}
            >
              + Add new field
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchFieldsContainer;
