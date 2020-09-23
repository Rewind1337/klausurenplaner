import React, { useState } from "react";

import "primereact/resources/themes/saga-orange/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "../css/global.css";

import Logo from "../bwshofheim.svg";
import SidebarButton from "./SidebarButton";
import ExamForm from "./ExamForm";
import ImportForm from "./ImportForm";
import Home from "./Home";
import LoginCard from "./LoginCard";
import RegisterCard from "./RegisterCard";

import { Dialog } from "primereact/dialog";

import { HashRouter as Router, Redirect, Route } from "react-router-dom";
import sha512 from "crypto-js/sha512";

const App = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);

  const [examFormVisibility, setExamFormVisibility] = useState(false);
  const [homeVisibility, setHomeVisibility] = useState(false);

  const [importDialogVisible, setImportDialogVisible] = useState(false);
  const [accountSettingsVisible, setAccountSettingsVisible] = useState(false);

  const [redirect, setRedirect] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const [loggedInUser, setLoggedInUser] = useState("");

  const api_link = "http://localhost:8080";
  const [isAdmin, setIsAdmin] = useState(false);

  const accountSettingsBody = (
    <ImportForm
      visible={true}
      api_link={api_link}
      isAdmin={isAdmin}
    ></ImportForm>
  );

  const importDialogBody = (
    <ImportForm
      visible={true}
      api_link={api_link}
      isAdmin={isAdmin}
    ></ImportForm>
  );

  const tryLogin = (username, password) => {
    const user = {
      username: username,
      password: password,
    };

    fetch(api_link + "/users/username/" + user.username)
      .then((response) => response.json())
      .then((data) => {
        if (data.password === sha512(password).toString()) {
          localStorage.setItem("user", JSON.stringify(data));
          setLoggedInUser(
            JSON.parse(localStorage.getItem("user")).username +
              "|" +
              JSON.parse(localStorage.getItem("user")).lastname +
              "," +
              JSON.parse(localStorage.getItem("user")).firstname
          );
          if (data.userrole.id === 2) setIsAdmin(true);
          doLogin();
        }
      })
      .catch(() => {
        // TODO
      });
  };

  const tryRegister = (username, password, firstname, lastname) => {
    const user = {
      username: username,
      password: password,
      firstname: firstname,
      lastname: lastname,
      isAdmin: false,
    };

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    };

    fetch(api_link + "/users/add", options)
      .then((response) => response.json())
      .then((data) => {
        doRegister();
      })
      .catch(() => {
        // TODO
      });
  };

  const doLogin = () => {
    setLoggedIn(true);
    setRedirect(true);
    setHomeVisibility(true);
  };

  const doLogout = () => {
    localStorage.setItem("user", "null");
    setRedirect(false);
    setHomeVisibility(false);
    setLoggedIn(false);
  };

  const doRegister = () => {
    setCreatingAccount(false);
  };

  const switchToHome = () => {
    setHomeVisibility(true);
    setExamFormVisibility(false);
  };

  const openImporter = () => {
    setImportDialogVisible(true);
  };

  const openAccountSettings = () => {
    setAccountSettingsVisible(true);
  };

  const switchToExamForm = () => {
    setHomeVisibility(false);
    setExamFormVisibility(true);
  };

  return (
    <Router>
      <Route exact path="/">
        {redirect && <Redirect to="/index" />}
        <div className="floating-card loginCard">
          <div className="p-grid">
            {!creatingAccount && (
              <LoginCard
                setLoggedInUser={setLoggedInUser}
                setCreatingAccount={setCreatingAccount}
                tryLogin={tryLogin}
                doLogin={doLogin}
                api_link={api_link}
                setIsAdmin={setIsAdmin}
              />
            )}
            {creatingAccount && (
              <RegisterCard
                setCreatingAccount={setCreatingAccount}
                tryRegister={tryRegister}
              />
            )}
          </div>
        </div>
      </Route>
      <Route exact path="/index">
        {!loggedIn && <Redirect to="/" />}
        <div className={"container" + (sidebarExpanded ? " active" : "")}>
          <div
            className={"sidebar" + (sidebarExpanded ? " active" : "")}
            onMouseEnter={() => {
              setSidebarExpanded(true);
            }}
            onMouseLeave={() => {
              setSidebarExpanded(false);
            }}
          >
            <div className="sidebar-header">
              <img src={Logo} className="logo" />
            </div>
            <div className="sidebar-content">
              <div className="sidebar-top"></div>
              <div className="sidebar-mid">
                <SidebarButton
                  expand={sidebarExpanded}
                  f={switchToHome}
                  label="Home"
                  icon="pi pi-home"
                />
                <SidebarButton
                  expand={sidebarExpanded}
                  f={openAccountSettings}
                  label="Profil"
                  icon="pi pi-user"
                />
                {isAdmin && (
                  <>
                    <SidebarButton
                      expand={sidebarExpanded}
                      f={switchToExamForm}
                      label="Erstellen"
                      icon="pi pi-plus"
                    />
                    <SidebarButton
                      expand={sidebarExpanded}
                      f={openImporter}
                      label="Importieren"
                      icon="pi pi-external-link"
                      className="flip-180"
                    />
                  </>
                )}
              </div>
              <div className="sidebar-bot">
                <div className="w-100">
                  {sidebarExpanded && (
                    <span className={isAdmin ? "text-admin" : "text-light"}>
                      {loggedInUser}
                    </span>
                  )}
                </div>
                <SidebarButton
                  expand={sidebarExpanded}
                  f={doLogout}
                  label="Ausloggen"
                  icon="pi pi-sign-out"
                />
              </div>
            </div>
          </div>
          <Home
            visible={homeVisibility}
            setExamVisibility={setExamFormVisibility}
            setHomeVisibility={setHomeVisibility}
            api_link={api_link}
            isAdmin={isAdmin}
          />
          <ExamForm
            visible={examFormVisibility}
            setExamFormVisibility={setExamFormVisibility}
            setHomeVisibility={setHomeVisibility}
            api_link={api_link}
            isAdmin={isAdmin}
          />

          <Dialog
            header="Einträge Importieren"
            visible={importDialogVisible}
            footer={<></>}
            style={{ width: "65vw" }}
            onHide={() => {
              setImportDialogVisible(false);
            }}
            isAdmin={isAdmin}
          >
            {importDialogBody}
          </Dialog>

          <Dialog
            header="Profil bearbeiten"
            visible={accountSettingsVisible}
            footer={<></>}
            style={{ width: "45vw" }}
            onHide={() => {
              setAccountSettingsVisible(false);
            }}
            isAdmin={isAdmin}
          >
            {accountSettingsBody}
          </Dialog>
        </div>
      </Route>
    </Router>
  );
};

export default App;