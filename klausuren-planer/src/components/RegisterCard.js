import React, { useState, useEffect } from "react";

import "../css/global.css";

import Logo from "../bwshofheim.svg";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

import sha512 from "crypto-js/sha512";

const RegisterCard = (props) => {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword1, setRegisterPassword1] = useState("");
  const [registerPassword2, setRegisterPassword2] = useState("");
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");

  const [validRegUsername, setValidRegUsername] = useState(false);
  const [validRegPassword1, setValidRegPassword1] = useState(false);
  const [validRegPassword2, setValidRegPassword2] = useState(false);
  const [validRegFirstName, setValidRegFirstName] = useState(false);
  const [validRegLastName, setValidRegLastName] = useState(false);

  useEffect(() => {});

  const checkFirstName = (s) => {
    setValidRegFirstName(
      registerFirstName.match(/^(?=.*[a-zA-Z]).{2,128}$/) != null ? true : false
    );

    setRegisterFirstName(s);
  };
  const checkLastName = (s) => {
    setValidRegLastName(
      registerLastName.match(/^(?=.*[a-zA-Z]).{2,128}$/) != null ? true : false
    );

    setRegisterLastName(s);
  };

  const checkUsername = (s) => {
    setValidRegUsername(
      registerUsername.match(/^(?=.*[a-zA-Z]).{6,32}$/) != null ? true : false
    );

    setRegisterUsername(s);
  };

  const checkPassword1 = (s) => {
    setValidRegPassword1(
      registerPassword1.match(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,32}$/) !=
        null
        ? true
        : false
    );

    setRegisterPassword1(s);
  };

  const checkPassword2 = (s) => {
    setValidRegPassword2(registerPassword1 === registerPassword2);

    setRegisterPassword2(s);
  };

  return (
    <>
      <div className="p-col p-col-12">
        <img src={Logo} className="loginImg" alt="BWS Hofheim" />
        <span className="card-header p-text-uppercase">Registrieren</span>
      </div>
      <hr />
      <div className="p-col p-col-12 p-my-2">
        <InputText
          className={
            "w-100 align-left" + (validRegFirstName ? "" : " p-invalid")
          }
          value={registerFirstName}
          placeholder="Vorname"
          onChange={(e) => checkFirstName(e.target.value)}
          onKeyUp={(e) => {
            checkFirstName(e.target.value);
          }}
        />
      </div>
      <div className="p-col p-col-12 p-my-2">
        <InputText
          className={
            "w-100 align-left" + (validRegLastName ? "" : " p-invalid")
          }
          value={registerLastName}
          placeholder="Nachname"
          onChange={(e) => checkLastName(e.target.value)}
          onKeyUp={(e) => {
            checkLastName(e.target.value);
          }}
        />
      </div>
      <div className="p-col p-col-12 p-my-2">
        <InputText
          className={
            "w-100 align-left" + (validRegUsername ? "" : " p-invalid")
          }
          value={registerUsername}
          placeholder="Benutzername"
          onChange={(e) => checkUsername(e.target.value)}
          onKeyUp={(e) => {
            checkUsername(e.target.value);
          }}
        />
      </div>
      <div className="p-col p-col-12 p-my-2">
        <InputText
          className={
            "w-100 align-left" + (validRegPassword1 ? "" : " p-invalid")
          }
          type="password"
          value={registerPassword1}
          placeholder="Passwort"
          onChange={(e) => checkPassword1(e.target.value)}
          onKeyUp={(e) => {
            checkPassword1(e.target.value);
          }}
        />
      </div>
      <div className="p-col p-col-12 p-my-2">
        <InputText
          className={
            "w-100 align-left" + (validRegPassword2 ? "" : " p-invalid")
          }
          type="password"
          value={registerPassword2}
          placeholder="Passwort wiederholen"
          onChange={(e) => checkPassword2(e.target.value)}
          onKeyUp={(e) => {
            checkPassword2(e.target.value);
          }}
        />
      </div>
      <div className="p-col p-col-6 p-my-2">
        <Button
          className="w-100"
          label="Abbrechen"
          icon="pi pi-times"
          onClick={() => {
            props.setCreatingAccount(false);
          }}
        />
      </div>
      <div className="p-col p-col-6 p-my-2">
        <Button
          className="w-100"
          label="Erstellen"
          icon="pi pi-plus"
          onClick={() => {
            if (
              validRegPassword1 &&
              validRegPassword2 &&
              validRegUsername &&
              validRegFirstName &&
              validRegLastName
            ) {
              let registerPassword = sha512(registerPassword1).toString();
              props.tryRegister(
                registerUsername,
                registerPassword,
                registerFirstName,
                registerLastName
              );
            }
          }}
        />
      </div>
    </>
  );
};

export default RegisterCard;
