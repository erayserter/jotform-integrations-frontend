import React, { useState, useRef, useEffect } from "react";
import { usePopper } from "react-popper";
import useOnClickOutside from "../Hooks/useOnClickOutside";

import classes from "./MatchFieldsContainer.module.css";

const MatchFieldsContainer = (props) => {
  const [referenceElementLeft, setReferenceElementLeft] = useState(null);
  const [popperElementLeft, setPopperElementLeft] = useState(null);
  let popper = usePopper(referenceElementLeft, popperElementLeft, {
    placement: "bottom",
  });
  const stylesLeft = popper.styles;
  const attributesLeft = popper.attributes;

  const [referenceElementRight, setReferenceElementRight] = useState(null);
  const [popperElementRight, setPopperElementRight] = useState(null);
  popper = usePopper(referenceElementRight, popperElementRight, {
    placement: "bottom",
  });
  const stylesRight = popper.styles;
  const attributesRight = popper.attributes;

  const [leftPopperOpen, setLeftPopperOpen] = useState({});
  const [rightPopperOpen, setRightPopperOpen] = useState({});

  const leftDropdownRef = useRef(null);
  const rightDropdownRef = useRef(null);

  useOnClickOutside(leftDropdownRef, () => {
    setLeftPopperOpen({});
  });
  useOnClickOutside(rightDropdownRef, () => {
    setRightPopperOpen({});
  });

  const [mappingChoices, setMappingChoices] = useState([
    {
      left: { id: 0, placeholder: "Name", is_required: true, constant: true },
      right: {},
    },
  ]);

  useEffect(() => {
    if (props.default) setMappingChoices(props.default);
  }, [props.default]);

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
          {mappingChoices.map((choice, index) => {
            return (
              <div className={classes["match-fields__mapping"]} key={index}>
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
                        onClick={(event) => {
                          if (!choice.left.constant) {
                            setLeftPopperOpen((prev) => {
                              return { ...prev, [index]: !prev[index] };
                            });
                          }
                        }}
                      >
                        <div
                          className={`${classes["dropdown__text"]} ${
                            !choice.left.placeholder && classes["placeholder"]
                          } ${choice.left.is_required && classes["required"]}`}
                        >
                          {choice.left.placeholder || "Please select..."}
                        </div>
                      </button>
                      {leftPopperOpen[index] && (
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
                            {props.datas.destination
                              .filter((data) => {
                                if (searchLeft !== "")
                                  return (
                                    data.value.includes(searchLeft) &&
                                    !mappingChoices.find(
                                      (element) => element.left.id == data.id
                                    )
                                  );
                                return !mappingChoices.find(
                                  (element) => element.left.id == data.id
                                );
                              })
                              .map((data) => {
                                return (
                                  <li
                                    onClick={(event) => {
                                      setLeftPopperOpen((prev) => {
                                        return { ...prev, [index]: false };
                                      });
                                      const changed = [...mappingChoices];
                                      changed[index] = {
                                        ...mappingChoices[index],
                                        left: {
                                          id: data.id,
                                          placeholder: data.value,
                                          constant: false,
                                          is_required: false,
                                        },
                                      };
                                      setMappingChoices(changed);
                                      props.onChange(changed);
                                    }}
                                    key={`${index}-${data}-left`}
                                  >
                                    {data.value}
                                  </li>
                                );
                              })}
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
                            setRightPopperOpen((prev) => {
                              return { ...prev, [index]: !prev[index] };
                            });
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
                      {rightPopperOpen[index] && (
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
                            {props.datas.source
                              .filter((data) => {
                                if (searchRight !== "")
                                  return (
                                    data.value.includes(searchRight) &&
                                    !mappingChoices.find(
                                      (element) => element.right.id == data.id
                                    )
                                  );
                                return !mappingChoices.find(
                                  (element) => element.right.id == data.id
                                );
                              })
                              .map((data) => {
                                return (
                                  <li
                                    onClick={(event) => {
                                      setRightPopperOpen((prev) => {
                                        return { ...prev, [index]: false };
                                      });
                                      const changed = [...mappingChoices];
                                      changed[index] = {
                                        ...mappingChoices[index],
                                        right: {
                                          id: data.id,
                                          placeholder: data.value,
                                          constant: false,
                                          is_required: false,
                                        },
                                      };
                                      setMappingChoices(changed);
                                      props.onChange(changed);
                                    }}
                                    key={`${index}-${data}-right`}
                                  >
                                    {data.value}
                                  </li>
                                );
                              })}
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
                (mappingChoices.find(
                  (element) =>
                    !element.left.placeholder || !element.right.placeholder
                ) ||
                  mappingChoices.length >= props.maxLength) &&
                classes["disabled"]
              }`}
              onClick={(event) => {
                if (
                  !mappingChoices.find(
                    (element) =>
                      !element.left.placeholder || !element.right.placeholder
                  ) &&
                  mappingChoices.length < props.maxLength
                ) {
                  setMappingChoices([
                    ...mappingChoices,
                    { left: {}, right: {} },
                  ]);
                  props.onChange([...mappingChoices, { left: {}, right: {} }]);
                }
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
