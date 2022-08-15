import React from "react";

const IntegrationApp = (props) => {
  const clickHandler = (event) => {
    props.onAppSelect(props.app);
  };

  return (
    <div className={`flex flex-col items-center overflow-hidden line-clamp-1`}>
      <img
        className={`block cursor-pointer`}
        onClick={clickHandler}
        alt={props.app.name}
        src={props.app.url}
        width="50px"
      />
      <span className="text-center">{props.app.name}</span>
    </div>
  );
};

export default IntegrationApp;
