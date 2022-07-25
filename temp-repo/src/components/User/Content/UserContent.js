import React, { useState, useEffect } from "react";
import { usePopper } from "react-popper";

import useOnClickOutside from "../../Hooks/useOnClickOutside";

import classes from "./UserContent.module.css";

import UserContentNavigationItem from "./UserContentNavigationItem";
import UserContentSection from "./List/UserContentSection";
import Templates from "./List/Templates/Templates";
import { useRef } from "react";

import { useSelector, useDispatch } from "react-redux";
import { setIsIntegrationContent } from "../../../store/ui";

const LIST_ITEMS = [
  { header: "Integrations", value: "Integrations" },
  { header: "Templates", value: "Templates" },
  { header: "Keys", value: "Keys" },
  { header: "Favorites", value: "Favorite Integrations" },
  { header: "Trash", value: "Deleted Integrations" },
];

const SORT_LIST_ITEMS = [
  "Title [a-z]",
  "Title [z-a]",
  "Creation Date",
  "Last Edit",
  "Submission Count",
  "Unread",
  "Last Submission",
];

const FIRST_ITEM = 0;

const UserContent = (props) => {
  const dispatch = useDispatch();
  const [sectionContent, setSectionContent] = useState(LIST_ITEMS[FIRST_ITEM]);
  const [searchedWord, setSearchedWord] = useState("");
  const webhooks = useSelector((state) => state.webhooks.webhooks);
  const selectedWebhooks = useSelector(
    (state) => state.webhooks.selectedWebhooks
  );

  const [isSidebarMenuOpen, setIsSidebarMenuOpen] = useState(false);
  const [isSortingPopperOpen, setIsSortingPopperOpen] = useState(false);
  const [sortedItemsBy, setSortedItemsBy] = useState(
    SORT_LIST_ITEMS[FIRST_ITEM]
  );

  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-end",
    modifiers: [{ name: "offset", options: { offset: [0, 0] } }],
  });

  const ref = useRef();

  useOnClickOutside(ref, () => {
    setIsSortingPopperOpen(false);
  });

  const sectionContentHandler = (content) => {
    setIsSidebarMenuOpen(false);
    setSectionContent(content);
  };

  const clickHandler = (event) => {
    dispatch(setIsIntegrationContent({ isIntegrationContent: true }));
  };

  const hasEnabled =
    webhooks.filter((e) => {
      return (
        selectedWebhooks.includes(e.webhook_id) &&
        e.status.toLowerCase() === "enabled"
      );
    }).length !== 0;

  const hasDisabled =
    webhooks.filter((e) => {
      return (
        selectedWebhooks.includes(e.webhook_id) &&
        e.status.toLowerCase() === "disabled"
      );
    }).length !== 0;

  return (
    <main
      className={`${classes["user--main"]} bg-white items-stretch flex grow-1 shrink-1 h-full flex-col md:flex-row h-full`}
    >
      <div
        className={`grow-0 shrink-1 md:basis-76 min-w-76 bg-navy-25 border-navy-100 border-solid border-b border-r ${
          isSidebarMenuOpen ? "z-9" : "z-5"
        }`}
      >
        <div
          className={`${classes["user--sidebarbutton"]} flex justify-center pt-3 pr-5 pb-3 pl-5 md:pt-2 md:pr-3 md:pb-2 md:pl-3 items-center bg-navy-25 md:bg-white min-h-18 md:min-h-16 border-b border-solid border-navy-100`}
        >
          <button
            className="border border-solid radius border-orange-500 bg-orange-500 color-white inline-block font-normal min-h-11 p-3 text-uppercase duration-300 w-full overflow-hidden relative z-2 cursor-pointer"
            onClick={clickHandler}
          >
            Create New Integration
          </button>
        </div>
        <div
          className={`${classes["user--sidebarmenu"]} ${
            isSidebarMenuOpen && classes["isOpened"]
          } flex flex-col md:pt-3`}
        >
          <div class="md:hidden border-b border-solid border-navy-100 pt-5 pb-5 pr-4 pl-4">
            <svg
              width="157"
              height="29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="flex"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M109.849 21.651c-.975 0-1.904-.355-2.589-1.043-.682-.686-1.144-1.724-1.144-3.127 0-1.42.462-2.458 1.144-3.139.683-.683 1.612-1.032 2.589-1.032.977 0 1.906.349 2.59 1.032.681.681 1.143 1.719 1.143 3.139 0 1.42-.462 2.457-1.143 3.138-.684.683-1.613 1.032-2.59 1.032zm0-12.874c-4.953 0-8.704 3.644-8.704 8.704 0 5.027 3.75 8.704 8.704 8.704 4.954 0 8.704-3.677 8.704-8.704 0-5.06-3.751-8.704-8.704-8.704zM68.663 21.773c-.975 0-1.904-.356-2.589-1.044-.683-.685-1.144-1.723-1.144-3.127 0-1.42.462-2.457 1.143-3.138.684-.683 1.613-1.032 2.59-1.032.977 0 1.906.349 2.59 1.032.681.681 1.142 1.718 1.142 3.138s-.461 2.458-1.142 3.139c-.684.683-1.613 1.032-2.59 1.032zm0-12.875c-4.953 0-8.704 3.645-8.704 8.704 0 5.027 3.75 8.704 8.704 8.704 4.954 0 8.704-3.677 8.704-8.704 0-5.06-3.751-8.704-8.704-8.704zm63.427 17.233h4.942v-9.813c0-.811.254-1.518.701-2.018.444-.495 1.098-.81 1.95-.81.892 0 1.498.296 1.887.752.396.464.602 1.135.602 1.946v9.944h4.909v-9.814c0-.794.253-1.502.699-2.007.442-.501 1.088-.82 1.919-.82.91 0 1.515.296 1.899.75.391.463.59 1.134.59 1.947v9.944h4.813v-10.82c0-2.218-.73-3.828-1.878-4.88-1.142-1.049-2.663-1.514-4.196-1.514-1.086 0-2.084.185-2.98.635-.762.383-1.437.951-2.026 1.736-.953-1.551-2.694-2.371-4.752-2.371-1.5 0-3.237.595-4.331 1.752V9.318h-4.748V26.13zm-1.859-16.799v5.036l-.386-.077a6.08 6.08 0 00-1.225-.124c-1.048 0-1.979.257-2.647.88-.664.618-1.122 1.649-1.122 3.311v7.773h-4.928V9.319h4.799v1.623c1.187-1.427 3.031-1.704 4.188-1.704.371 0 .706.033 1.025.066l.296.03zM41.375 18.03h4.818l.055.053a.23.23 0 01.067.144c.093 1.055.508 1.85 1.128 2.38.617.528 1.416.774 2.248.774 1.016 0 1.847-.374 2.42-1.024.571-.647.868-1.544.868-2.56V3.712h5.21v14.23c0 4.554-3.486 8.364-8.461 8.364-2.486 0-4.57-.826-6.032-2.26-1.428-1.4-2.28-3.398-2.318-5.826l-.003-.192zm59.07-12.034l.274.078V2.26l-.126-.057c-.193-.088-.503-.167-.861-.225a7.867 7.867 0 00-1.226-.097c-1.7 0-3.61.562-4.598 1.574-.989 1.013-1.534 2.455-1.534 4.181v.806h-2.482v4.379h2.483v13.31h4.983v-13.31h3.361V8.442h-3.361v-.745c0-.776.271-1.222.618-1.482.358-.269.828-.362 1.256-.362.645 0 1.019.087 1.213.143zM88.109 22.198l.257-.079v3.83l-.118.057c-.181.088-.473.167-.81.225-.34.059-.742.098-1.152.098-1.596 0-3.381-.564-4.31-1.581-.93-1.016-1.442-2.465-1.442-4.198v-7.727h-2.333V8.465h2.333v-4.73h4.674v4.73h3.158v4.358h-3.158v7.667c0 .778.255 1.227.58 1.488.337.269.778.363 1.181.363.606 0 .957-.088 1.14-.143z"
                fill="#0A1551"
              ></path>
              <path
                d="M7.027 26.809c.532.516.156 1.4-.6 1.4H1.694C.76 28.21 0 27.474 0 26.569V21.98c0-.734.913-1.099 1.445-.582l5.582 5.41z"
                fill="#0A1551"
              ></path>
              <path
                d="M14.425 27.166a3.548 3.548 0 010-5.04l5.056-5.024a3.604 3.604 0 015.074 0 3.548 3.548 0 010 5.04l-5.056 5.024a3.604 3.604 0 01-5.074 0z"
                fill="#FFB629"
              ></path>
              <path
                d="M1.068 14.544a3.548 3.548 0 010-5.04l8.51-8.46a3.604 3.604 0 015.073 0 3.548 3.548 0 010 5.04l-8.51 8.46a3.604 3.604 0 01-5.073 0z"
                fill="#09F"
              ></path>
              <path
                d="M8.024 20.573a3.548 3.548 0 010-5.04L19.52 4.11a3.604 3.604 0 015.073 0 3.548 3.548 0 010 5.04L13.097 20.574a3.604 3.604 0 01-5.073 0z"
                fill="#FF6100"
              ></path>
            </svg>
          </div>
          <ul className="max-w-full md:max-w-76 pt-1 pr-3 pl-3 w-full">
            {LIST_ITEMS.map((item) => {
              return (
                <li
                  className="border-b border-solid border-gray-75"
                  key={item.header}
                >
                  <UserContentNavigationItem
                    item={item}
                    current={sectionContent}
                    sectionChange={sectionContentHandler}
                  />
                </li>
              );
            })}
          </ul>
        </div>
        {isSidebarMenuOpen && (
          <div
            onClick={(event) => setIsSidebarMenuOpen(false)}
            class="bg-black bg-opacity-40 fixed h-100vh left-0 top-0 w-100vw z-3"
          ></div>
        )}
      </div>
      <div
        className={`${classes["user--section-content"]} flex flex-col min-h-120 relative w-full`}
      >
        <div
          className={`${classes["user--section-toolbar"]} flex shrink-1 left-0 sticky right-0 top-0 z-5 bg-white border-b border-solid border-navy-100 py-3 md:py-2 px-5 md:px-1 min-h-16`}
        >
          <div
            className={`${classes["user--section-toolbar-wrapper"]} flex grow-1 shrink-1 justify-between pointer-events-none relative z-6`}
          >
            <button
              className={`${classes["user--folder"]} ${
                selectedWebhooks.length > 0 ? "hidden" : "block"
              } md:hidden bg-white border border-solid radius cursor-pointer shrink-0 h-11 w-11 mr-2 bg-no-repeat bg-center pointer-events-auto hover:bg-navy-25`}
              onClick={(event) => setIsSidebarMenuOpen(true)}
            ></button>
            <div
              className={`${classes["user--selection-menu"]} ${
                selectedWebhooks.length > 0 ? "flex" : "hidden"
              } grow-1 shrink-1 mr-2 pointer-events-auto items-start justify-start pl-0 md:pl-4`}
            >
              <button
                className={`${classes["user--trash"]} bg-white border border-solid radius text-sm font-semibold line-height-sm min-h-11 pt-3 pr-3 pb-3 pl-8 h-full bg-no-repeat shrink-0`}
                onClick={(event) => {
                  if (sectionContent.header === "Trash")
                    props.onStatusChangeWebhook("purge");
                  else props.onStatusChangeWebhook("delete");
                }}
              >
                <span className="whitespace-nowrap hidden lg:inline">
                  Move To Trash
                </span>
              </button>
              {sectionContent.header === "Trash" && (
                <div className={classes["trash-menu-only"]}>
                  <button
                    className={`${classes["user--restore"]} bg-white border border-solid radius text-sm font-semibold line-height-sm min-h-11 pt-3 pr-3 pb-3 pl-0 md:pl-8 h-full bg-center bg-no-repeat shrink-0 ml-2 min-w-11`}
                    onClick={(event) => {
                      props.onStatusChangeWebhook("enable");
                    }}
                  >
                    <span className="whitespace-nowrap hidden md:inline">
                      Restore
                    </span>
                  </button>
                </div>
              )}
              {sectionContent.header !== "Trash" && (
                <div className={classes["integrations-menu"]}>
                  <button
                    className={`${classes["user--disable"]} ${
                      !hasEnabled ? "opacity-50 pointer-events-none" : ""
                    } bg-white border border-solid radius text-sm font-semibold line-height-sm min-h-11 pt-3 pr-3 pb-3 pl-0 md:pl-8 h-full bg-center bg-no-repeat shrink-0 ml-2 min-w-11`}
                    onClick={(event) => {
                      props.onStatusChangeWebhook("disable");
                    }}
                  >
                    <span className="whitespace-nowrap hidden md:inline">
                      Disable
                    </span>
                  </button>
                  <button
                    className={`${classes["user--enable"]} ${
                      !hasDisabled ? "opacity-50 pointer-events-none" : ""
                    } bg-white border border-solid radius text-sm font-semibold line-height-sm min-h-11 pt-3 pr-3 pb-3 pl-0 md:pl-8 h-full bg-center bg-no-repeat shrink-0 ml-2 min-w-11`}
                    onClick={(event) => {
                      props.onStatusChangeWebhook("enable");
                    }}
                  >
                    <span className="whitespace-nowrap hidden md:inline">
                      Enable
                    </span>
                  </button>
                </div>
              )}
            </div>
            <div
              className={`${classes["user--sectionsearch"]} ${
                selectedWebhooks.length > 0 ? "hidden" : "flex"
              } md:flex pointer-events-auto ml-auto`}
            >
              <div className={classes["user--sectionsearch-sort"]}>
                <div
                  className={`${classes["user--sectionsearch-sort-wrapper"]} flex text-md`}
                  ref={ref}
                >
                  <button
                    ref={setReferenceElement}
                    onClick={(event) => {
                      setIsSortingPopperOpen((prev) => !prev);
                    }}
                    className={`${
                      isSortingPopperOpen
                        ? `${classes["user--sort-button-active"]} bg-navy-600 border-navy-600 radius-bl-0 radius-br-0`
                        : "bg-white border-gray-50"
                    } ml-0 border border-solid radius color-navy-700 text-sm font-semibold line-height-sm min-h-11 pt-3 pr-3 pb-3 pl-3 xs:pl-9 h-11 xs:h-auto w-11 xs:w-auto xs:bg-center bg-transparent bg-no-repeat my-0 mx-1 cursor-pointer pointer-events-auto`}
                  >
                    <span className="whitespace-nowrap pointer-events-auto hidden xs:inline">
                      Title [a-z]
                    </span>
                  </button>
                  {isSortingPopperOpen && (
                    <div
                      className={`${classes["user--sort-popper"]} bg-white relative z-6 min-w-68 shadow-xs radius`}
                      ref={setPopperElement}
                      style={styles.popper}
                      {...attributes.popper}
                    >
                      <ul
                        className={`${classes["user--sort-popper-list"]} border-0 radius-tr-none radius-tl radius-br radius-bl overflow-hidden p-0 bg-white`}
                      >
                        {SORT_LIST_ITEMS.map((e) => {
                          return (
                            <li
                              className={`${
                                sortedItemsBy === e &&
                                classes["active-sort-choice"]
                              } cursor-pointer duration-300 color-white bg-navy-600 hover:bg-navy-700 py-3 pr-10 pl-4`}
                              key={e}
                              onClick={(event) => {
                                setSortedItemsBy(e);
                                setIsSortingPopperOpen(false);
                              }}
                            >
                              {e}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div
                className={`${classes["user--sectionsearch-input"]} grow-1 shrink-1 relative pointer-events-auto min-w-24 md:min-w-60 mt-0 mr-0 mb-0 ml-2 md:mr-3`}
              >
                <input
                  className="block w-full bg-navy-25 bg-no-repeat border border-solid border-navy-25 radius color-navy-300 pointer-events-auto duration-300 py-3 px-9 min-h-9 text-sm"
                  type="text"
                  placeholder="Search Integration"
                  onChange={(event) => {
                    setSectionContent(LIST_ITEMS[FIRST_ITEM]);
                    setSearchedWord(event.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        {sectionContent.header === "Templates" ? (
          <Templates onTemplateSelect={props.onTemplateSelect} />
        ) : (
          <UserContentSection
            onIntegrationUpdate={props.onIntegrationUpdate}
            content={sectionContent}
            searchedWord={searchedWord}
            onSelect={props.onSelect}
            onFavorite={props.onFavorite}
            onStatusChangeWebhook={props.onStatusChangeWebhook}
          />
        )}
      </div>
    </main>
  );
};

export default UserContent;
