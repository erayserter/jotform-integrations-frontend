import React from "react";

import classes from "./UserPrefillListItem.module.css";

const UserPrefillListItem = ({ key, url, title }) => {
  return (
    <li
      className={`${classes["user-prefill-list-item"]} flex bg-white radius mb-2 relative`}
      key={key}
    >
      <div
        className={`${classes["user-prefill-list-item__icon"]} bg-yellow-400 bg-center bg-no-repeat bg-size-contain radius h-18 p-3 w-5 border-b border-dashed border-transparent max-w-full line-clamp-1 text-sm`}
      ></div>
      <div
        className={`${classes["user-prefill-list-item__content"]} flex flex-col justify-center ml-4 w-full border-b border-dashed border-transparent line-clamp-1 text-sm`}
      >
        <div
          className={`text-sm border-b border-dashed border-transparent max-w-full line-clamp-1`}
        >
          {title}
        </div>
        <a
          className="color-blue-400 inline-flex items-baseline text-xs line-height-md line-clamp-1"
          href={url}
          target="_blank"
          rel="noreferrer"
        >
          <span
            className={`${classes["user-prefill-list-item__link"]} text-xs max-w-72 md:max-w-88 lg:max-w-sm mr-1 inline-block whitespace-nowrap overflow-hidden`}
          >
            {url}
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.3579 15.3005C13.3579 15.5692 13.1403 15.786 12.8725 15.786H1.70036C1.43169 15.786 1.21494 15.5683 1.21494 15.3005V4.12842C1.21494 3.85975 1.4326 3.64299 1.70036 3.64299H9.71494L10.929 2.42896H1.21403C0.543716 2.42896 0 2.97268 0 3.64299V15.786C0 16.4563 0.543716 17 1.21403 17H13.357C14.0273 17 14.571 16.4563 14.571 15.786V6.07104L13.357 7.28506L13.3579 15.3005ZM10.929 0L13.1029 2.17395L7.28597 8.00273C7.10474 8.21403 6.99362 8.48998 6.99362 8.79235C6.99362 9.46266 7.53734 10.0064 8.20765 10.0064C8.51002 10.0064 8.78689 9.89618 8.99909 9.71312L14.8142 3.898L17 6.07195V0H10.929Z"
              fill="#0099FF"
            ></path>
          </svg>
        </a>
      </div>
    </li>
  );
};

export default UserPrefillListItem;
