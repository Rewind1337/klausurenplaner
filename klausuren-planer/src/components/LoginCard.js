import React, { useEffect, useState } from "react";

import "../css/global.css";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

const LoginCard = (props) => {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  useEffect(() => {
    if (
      localStorage.getItem("user") !== "null" &&
      localStorage.getItem("user") !== null &&
      localStorage
    ) {
      let u = JSON.parse(localStorage.getItem("user"));

      fetch(props.api_link + "/users/username/" + u.username)
        .then((response) => response.json())
        .then((data) => {
          if (data.password === u.password) {
            localStorage.setItem("user", JSON.stringify(data));
            props.setLoggedInUser(
              JSON.parse(localStorage.getItem("user")).username +
                "|" +
                JSON.parse(localStorage.getItem("user")).lastname +
                "," +
                JSON.parse(localStorage.getItem("user")).firstname
            );
            if (data.admin) {
              props.setIsAdmin(true);
              props.doLogin();
            }
            if (!data.admin) {
              props.setIsAdmin(false);
              props.doLogin();
            }
          }
        });
    }
  }, []);

  return (
    <>
      <div className="p-col p-col-12">
        <span className="card-header p-text-uppercase">Klausurenplaner</span>
      </div>
      <hr />
      <div className="p-col p-col-12 p-my-2">
        <InputText
          className="w-100 align-left"
          value={loginUsername}
          placeholder="Benutzername"
          onChange={(e) => setLoginUsername(e.target.value)}
        />
      </div>
      <div className="p-col p-col-12 p-my-2">
        <InputText
          className="w-100 align-left"
          value={loginPassword}
          type="password"
          placeholder="Passwort"
          onChange={(e) => setLoginPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") props.tryLogin(loginUsername, loginPassword);
          }}
        />
      </div>
      <div className="p-col p-col-6 p-my-2">
        <Button
          className="w-100"
          label="Registrieren"
          icon="pi pi-cloud"
          onClick={() => {
            props.setCreatingAccount(true);
          }}
        />
      </div>
      <div className="p-col p-col-6 p-my-2">
        <Button
          className="w-100"
          label="Anmelden"
          icon="pi pi-sign-in"
          onClick={() => {
            props.tryLogin(loginUsername, loginPassword);
          }}
        />
      </div>
    </>
  );
};

export default LoginCard;
