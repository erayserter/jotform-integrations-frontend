import React from "react";

import classes from "./IntegrationHeader.module.css";

import IntegrationTitle from "./IntegrationTitle";
import IntegrationAppCard from "../Wizard/IntegrationAppCard";
import { useDispatch } from "react-redux";
import { setCurrentContent } from "../../../../store/ui";

const TEMPLATE_IMG = (
  <svg
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 162 204"
    class="jfWizard-list-item-icon-svg"
    width="120"
    height="147"
  >
    <rect width="162" height="204" rx="4" fill="#fff"></rect>
    <rect x="9" y="9" width="144" height="46" rx="4" fill="#09F"></rect>
    <circle cx="35" cy="28" r="11" fill="#FFB629"></circle>
    <path
      d="M115.7 22.39L85 55h64l-28.871-32.544a3 3 0 00-4.429-.066z"
      fill="#9EDC36"
    ></path>
    <path
      d="M89.754 29.875L66 55h50.5L94.174 29.94a3 3 0 00-4.42-.065z"
      fill="#78BB07"
    ></path>
    <rect x="9" y="90" width="144" height="14" rx="7" fill="#C8C8E3"></rect>
    <rect x="9" y="137" width="144" height="14" rx="7" fill="#C8C8E3"></rect>
    <rect x="9" y="67" width="68" height="14" rx="7" fill="#E6E6F5"></rect>
    <rect x="9" y="114" width="68" height="14" rx="7" fill="#E6E6F5"></rect>
  </svg>
);

const IntegrationHeader = (props) => {
  const dispatch = useDispatch();

  const PREFILL_URL = require("../../../../assets/prefill.svg");
  const PrefillImage = (
    <img src={`../src/assets/prefill.svg`} alt="prefill-icon" />
  );

  return (
    <>
      <IntegrationTitle
        title="Create An Integration"
        subtitle="Select applications to easly create an integration between them."
      />
      <div
        className={`${classes["integration-header__body"]} flex flex-col grow-1 min-h-76`}
      >
        <div
          className={`${classes["integration-header__cards"]} flex flex-col m-0 justify-center items-center duration-700 delay-500`}
        >
          <IntegrationAppCard
            first={true}
            text="Create with Wizard"
            onClick={() => {
              dispatch(setCurrentContent({ currentContent: "wizard" }));
            }}
          />
          <IntegrationAppCard
            text="Create Prefill"
            img={PrefillImage}
            onClick={() => {
              dispatch(setCurrentContent({ currentContent: "prefill" }));
            }}
          />
          <IntegrationAppCard
            text="Use Template"
            img={TEMPLATE_IMG}
            onClick={() => {
              dispatch(setCurrentContent({ currentContent: "template" }));
            }}
          />
        </div>
      </div>
    </>
  );
};

export default IntegrationHeader;
