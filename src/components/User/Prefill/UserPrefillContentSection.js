import React, { useState } from "react";
import { useSelector } from "react-redux";

import classes from "../Content/List/UserContentSection.module.css";
import UserPrefillListItem from "./List/UserPrefillListItem";

const dummyArray = [...Array(10)];

const UserPrefillContentSection = ({ content, prefillsLoading, onClose }) => {
  const prefills = useSelector((state) => state.prefills.prefills);

  if (prefillsLoading)
    return (
      <div className={`grow-1 h-full mt-5`}>
        <div className={`w-full h-full flex flex-col py-1 md:py-4 px-5`}>
          {dummyArray.map((e) => (
            <div
              className={`flex justify-between items-center w-full h-8 radius-full bg-navy-25 mb-9`}
            ></div>
          ))}
        </div>
      </div>
    );

  return (
    <div className={`grow-1 h-full`}>
      <div
        className={`w-full h-full flex flex-col py-1 px-0.5 md:py-4 md:px-5`}
      >
        <ul className="px-3">
          {prefills.length !== 0 &&
            prefills.map((e) => {
              return (
                <UserPrefillListItem
                  key={e.contact_id}
                  url={e.url}
                  title={e.title}
                />
              );
            })}
        </ul>

        {prefills.length === 0 && (
          <div
            className={`flex items-center justify-center grow-1 h-full py-4 px-5 relative mt-8 md:mt-0`}
          >
            <div className={`line-height-xl text-center`}>
              <div
                className={`${classes["content--no-content-icon"]} bg-center bg-no-repeat inline-block relative mb-7 h-28 w-28`}
              ></div>
              <div
                className={`text-lg font-medium text-uppercase mb-1 color-navy-700`}
              >
                YOU DON'T HAVE ANY {content.value} YET!
              </div>
              <div
                className={`${classes["content--no-content-secondary-text"]} mb-7 text-lg text-lowercase color-navy-300`}
              >
                Your {content.value} will appear here.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPrefillContentSection;
