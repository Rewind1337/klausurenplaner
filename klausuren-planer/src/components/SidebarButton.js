import React from "react";

import "../css/global.css";

import { Button } from "primereact/button";

const SidebarButton = (props) => {
  return (
    <>
      {props.expand && (
        <Button
          onClick={() => {
            props.f();
          }}
          className="w-100"
          label={props.label}
          icon={props.icon}
        />
      )}
      {!props.expand && (
        <Button
          onClick={() => {
            props.click();
          }}
          className="w-100"
          icon={props.icon}
        />
      )}
    </>
  );
};

export default SidebarButton;
