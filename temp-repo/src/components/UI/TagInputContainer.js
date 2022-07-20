import React, { useState } from "react";
import ReactDOM from "react-dom";
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
    // setIsToggled(false);
  });

  let str = "";
  let index = 0;
  if (props.defaultValue) {
    while (props.defaultValue.includes("[[", index)) {
      str += props.defaultValue.substring(
        index,
        props.defaultValue.indexOf("[[", index) + 2
      );
      index = props.defaultValue.indexOf("[[", index) + 2;
      let tag = { id: null, value: null };
      tag.id = props.defaultValue.substring(
        index,
        props.defaultValue.indexOf("]]", index)
      );

      tag.value = props.whitelist.find((e) => {
        return (
          e.id ===
          props.defaultValue.substring(
            index,
            props.defaultValue.indexOf("]]", index)
          )
        );
      }).value;

      str += JSON.stringify(tag);

      str += "]]";
      index = props.defaultValue.indexOf("]]", index) + 2;
    }
    if (index < props.defaultValue.length)
      str += props.defaultValue.substring(index);
  }

  const convertString = (str) => {
    let temp = "";
    let index = 0;
    while (str.includes("[[", index)) {
      temp += str.substring(index, str.indexOf("[[", index) + 2);
      index = str.indexOf("[[", index) + 2;
      let tag = JSON.parse(str.substring(index, str.indexOf("]]", index)));

      temp += tag.id + "]]";

      index = str.indexOf("]]", index) + 2;
    }
    if (index < str.length) temp += str.substring(index);
    return temp;
  };

  return (
    <div
      className={`${classes["tag-input"]} relative py-5 border-b border-solid`}
    >
      <div
        className={`${classes["tag-input__title"]} text-sm font-semibold mb-2`}
      >
        <label>{props.label}</label>
      </div>
      <div className={classes["tag-input__input"]}>
        <MixedTags
          tagifyRef={tagRef}
          autoFocus={true}
          settings={{ ...settings, whitelist: props.whitelist }}
          className="myTags"
          onChange={(e) => {
            const converted = convertString(
              e.detail.value.substring(0, e.detail.value.length - 1)
            );
            props.onChange(converted);
          }}
          value={str}
        />
        <div className={classes["input__form-fields"]}>
          <button
            className="absolute top-4 cursor-pointer right-0 duration-300 flex items-center justify-center radius py-2 pr-6 pl-2"
            ref={setReferenceElement}
            onClick={(event) => {
              setIsToggled((prev) => !prev);
            }}
          >
            <div
              className={`${classes["form-fields__icon"]} flex items-center justify-center color-white h-4 mr-1 w-4 radius-xl`}
            >
              <svg
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="formFields-icon"
                width="10px"
                height="10px"
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
          {isToggled &&
            ReactDOM.createPortal(
              <div
                className={`${classes["form-fields__popper"]} bg-white radius min-w-72 shadow-md`}
                ref={setPopperElement}
                style={styles.popper}
                {...attributes.popper}
              >
                <div
                  className={`${classes["popper__wrapper"]} overflow-x-hidden overflow-y-auto max-h-60 text-sm line-height-xl`}
                  ref={openRef}
                >
                  <div
                    className={`${classes["popper__list"]} px-3 w-full max-w-80`}
                  >
                    <ul className="my-3">
                      {props.whitelist.map((e) => {
                        return (
                          <li
                            className="flex cursor-pointer radius items-center justify-start max-w-72 line-height-xl duration-300 w-full p-2"
                            onClick={(event) => {
                              if (props.defaultValue) {
                                props.onChange(
                                  props.defaultValue + "[[" + e.id + "]]"
                                );
                              } else props.onChange("[[" + e.id + "]]");
                            }}
                          >
                            {e.value}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>,
              document.querySelector("#root")
            )}
        </div>
      </div>
    </div>
  );
};

export default TagInputContainer;
