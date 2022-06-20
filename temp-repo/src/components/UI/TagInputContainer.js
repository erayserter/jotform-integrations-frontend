import React, { useState } from "react";
import { MixedTags } from "@yaireo/tagify/dist/react.tagify";
import { usePopper } from "react-popper";

import classes from "./TagInputContainer.module.css";
import { useRef } from "react";

import useOnClickOutside from "../Hooks/useOnClickOutside";

const settings = {
  pattern: /@/,
  dropdown: {
    enabled: 1,
    position: "text",
  },
  duplicates: true,
};

const TagInputContainer = (props) => {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-end",
  });

  const [isToggled, setIsToggled] = useState(false);

  const tagRef = useRef();
  const openRef = useRef();

  useOnClickOutside(openRef, () => {
    setIsToggled(false);
  });

  return (
    <div className={classes["tag-input"]}>
      <div className={classes["tag-input__title"]}>
        <label>{props.label}</label>
      </div>
      <div className={classes["tag-input__input"]}>
        <MixedTags
          tagifyRef={tagRef}
          autoFocus={true}
          settings={{ ...settings, whitelist: props.whitelist }}
          className="myTags"
          onChange={(e) => {
            props.onChange(e.detail.value);
          }}
          value={props.defaultValue}
        />
        <div className={classes["input__form-fields"]}>
          <button
            ref={setReferenceElement}
            onClick={(event) => {
              setIsToggled((prev) => !prev);
            }}
          >
            <div className={classes["form-fields__icon"]}>
              <svg
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="formFields-icon"
              >
                <path
                  d="M5.318 6.569l-1.25 1.25a1.327 1.327 0 01-2.263-.938c0-.354.138-.687.388-.937l1.25-1.25a.442.442 0 00-.625-.625l-1.25 1.25A2.195 2.195 0 00.92 6.881 2.206 2.206 0 003.13 9.09c.565 0 1.131-.216 1.562-.646l1.25-1.25a.442.442 0 00-.625-.625zM9.089 3.128c0-.59-.23-1.146-.647-1.563a2.212 2.212 0 00-3.125 0l-1.25 1.25a.442.442 0 10.625.625l1.25-1.25a1.327 1.327 0 012.263.938c0 .354-.138.687-.388.937l-1.25 1.25a.442.442 0 00.625.625l1.25-1.25c.417-.418.647-.972.647-1.562z"
                  fill="currentColor"
                ></path>
                <path
                  d="M3.442 6.567a.44.44 0 00.625 0l2.5-2.5a.442.442 0 10-.625-.625l-2.5 2.5a.442.442 0 000 .625z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <div className={classes["form-fields__text"]}>Form Fields</div>
          </button>
          {isToggled && (
            <div
              className={classes["form-fields__popper"]}
              ref={setPopperElement}
              style={styles.popper}
              {...attributes.popper}
            >
              <div className={classes["popper__wrapper"]} ref={openRef}>
                <div className={classes["popper__list"]}>
                  <ul>
                    {props.whitelist.map((e) => {
                      return (
                        <li
                          onClick={(event) => {
                            if (props.defaultValue)
                              props.onChange(
                                props.defaultValue.substring(
                                  0,
                                  props.defaultValue.length
                                ) +
                                  "[[" +
                                  JSON.stringify(e) +
                                  "]]"
                              );
                            else
                              props.onChange("[[" + JSON.stringify(e) + "]]");
                          }}
                        >
                          {e.value}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagInputContainer;
