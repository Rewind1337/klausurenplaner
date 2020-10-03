import React, { useState } from "react";

import "../css/global.css";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

const AccountSettings = (props) => {
  let loggedInUser = JSON.parse(localStorage.getItem("user"));

  const [firstname, setFirstname] = useState(loggedInUser.firstname);
  const [lastname, setLastname] = useState(loggedInUser.lastname);
  const [username, setUsername] = useState(loggedInUser.username);

  return (
    <>
      {props.visible && (
        <div className="p-grid">
          <div className="p-grid p-col-12">
            <div className="p-col p-col-12 p-my-2">
              <div className="examForm-label" style={{ top: "0px" }}>
                Vorname
              </div>
              <InputText
                className="w-100 align-left"
                type="text"
                readOnly
                value={firstname}
              />
              <Button label="Bearbeiten" icon="pi pi-pencil" />
            </div>
            <div className="p-col p-col-12 p-my-2">
              <div className="examForm-label" style={{ top: "0px" }}>
                Nachname
              </div>
              <InputText
                className="w-100 align-left"
                type="text"
                readOnly
                value={lastname}
              />
              <Button label="Bearbeiten" icon="pi pi-pencil" />
            </div>
            <div className="p-col p-col-12 p-my-2">
              <div className="examForm-label" style={{ top: "0px" }}>
                Benutzername
              </div>
              <InputText
                className="w-100 align-left"
                type="text"
                readOnly
                value={username}
              />
              <Button label="Bearbeiten" icon="pi pi-pencil" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountSettings;
