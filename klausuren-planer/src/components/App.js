import React, { useState } from "react";

import "primereact/resources/themes/saga-orange/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "../css/global.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Logo from "../bwshofheim.svg";
import SidebarButton from "./SidebarButton";
import ExamForm from "./ExamForm";
import ImportForm from "./ImportForm";
import AccountSettings from "./AccountSettings";
import TableWrapper from "./TableWrapper";
import CalendarWrapper from "./CalendarWrapper";
import LoginCard from "./LoginCard";
import RegisterCard from "./RegisterCard";

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

import { HashRouter as Router, Redirect, Route } from "react-router-dom";
import sha512 from "crypto-js/sha512";

const App = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);

  const [examFormVisibility, setExamFormVisibility] = useState(false);
  const [homeVisibility, setTableWrapperVisibility] = useState(false);
  const [calendarVisibility, setCalendarVisibility] = useState(false);

  const [importDialogVisible, setImportDialogVisible] = useState(false);
  const [accountSettingsVisible, setAccountSettingsVisible] = useState(false);

  const [redirect, setRedirect] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const [loggedInUser, setLoggedInUser] = useState("");
  const [darkTheme, setDarkTheme] = useState(false);

  const api_link = "http://localhost:8080";
  const [isAdmin, setIsAdmin] = useState(false);

  const switchTheme = () => {
    if (darkTheme) setDarkTheme(false);
    else setDarkTheme(true);

    if (darkTheme) document.getRootNode().children[0].className = "dark-theme";
    else document.getRootNode().children[0].className = "";
  };

  const tryLogin = (username, password) => {
    setIsFetching(true);
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
          console.log(data);
          if (data.admin) {
            setIsAdmin(true);
            doLogin();
          }
          if (!data.admin) {
            setIsAdmin(false);
            doLogin();
          }
          setIsFetching(false);
        } else {
          tError("Fehler beim Anmelden!");
          setIsFetching(false);
        }
      })
      .catch(() => {
        tError("Fehler beim Anmelden!");
        setIsFetching(false);
      });
  };

  const tryRegister = (username, password, firstname, lastname) => {
    setIsFetching(true);
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
        if (data.status == 500) {
          tError("Fehler beim Registrieren! Bitte überprüfe alle Felder");
          setIsFetching(false);
        } else {
          doRegister();
          setIsFetching(false);
        }
      })
      .catch(() => {
        tError("Fehler beim Registrieren! Bitte überprüfe alle Felder");
        setIsFetching(false);
      });
  };

  const doLogin = () => {
    setLoggedIn(true);
    setRedirect(true);
    setTableWrapperVisibility(true);
    setSidebarExpanded(false);
  };

  const doLogout = () => {
    localStorage.setItem("user", "null");
    setRedirect(false);
    setLoggedIn(false);
    tSuccess("Erfolgreich ausgeloggt!");
    setSidebarExpanded(false);
  };

  const doRegister = () => {
    setCreatingAccount(false);
    tSuccess("Erfolgreich erstellt!");
    setSidebarExpanded(false);
  };

  const openImporter = () => {
    setImportDialogVisible(true);
    setSidebarExpanded(false);
  };

  const openAccountSettings = () => {
    setAccountSettingsVisible(true);
    setSidebarExpanded(false);
  };

  const switchToTableWrapper = () => {
    setTableWrapperVisibility(true);
    setCalendarVisibility(false);
    setExamFormVisibility(false);

    setSidebarExpanded(false);
  };

  const switchToExamForm = () => {
    setTableWrapperVisibility(false);
    setCalendarVisibility(false);
    setExamFormVisibility(true);

    setSidebarExpanded(false);
  };

  const switchToCalendar = () => {
    setTableWrapperVisibility(false);
    setExamFormVisibility(false);
    setCalendarVisibility(true);

    setSidebarExpanded(false);
  };

  const tSuccess = (text) => toast.success(text);
  const tError = (text) => toast.error(text);

  const deleteExam = (examID) => {
    fetch(api_link + "/exams/delete/" + examID, { method: "DELETE" })
      .then((response) => response.json())
      .then(() => {
        tSuccess("Erfolgreich gelöscht!");
      });
  };

  const accountSettingsBody = (
    <AccountSettings
      visible={true}
      api_link={api_link}
      isAdmin={isAdmin}
      tSuccess={tSuccess}
      tError={tError}
    />
  );

  const importDialogBody = (
    <ImportForm
      visible={true}
      api_link={api_link}
      isAdmin={isAdmin}
      tSuccess={tSuccess}
      tError={tError}
    />
  );

  return (
    <Router>
      <Route path="/">
        {loggedIn && (
          <Button
            id="burgerButton"
            label=""
            icon="pi pi-bars"
            style={{ fontSize: "125%" }}
            onClick={() => {
              setSidebarExpanded(true);
            }}
          />
        )}
        <ToastContainer />
      </Route>
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
        <div className="loading-spinner">
          {isFetching && (
            <i
              className="pi pi-spin pi-spinner"
              style={{
                fontSize: "5em",
                color: "#ffd54f",
              }}
            ></i>
          )}
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
                  f={switchToTableWrapper}
                  label="Tabelle"
                  icon="pi pi-table"
                />
                <SidebarButton
                  expand={sidebarExpanded}
                  f={switchToCalendar}
                  label="Kalender"
                  icon="pi pi-calendar"
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
                <SidebarButton
                  expand={sidebarExpanded}
                  f={switchTheme}
                  label="Light/Dark Theme"
                  icon="pi pi-palette"
                />
              </div>
              <div className="sidebar-bot">
                <SidebarButton
                  expand={sidebarExpanded}
                  f={doLogout}
                  label="Ausloggen"
                  icon="pi pi-sign-out"
                />
              </div>
            </div>
          </div>
          {homeVisibility && (
            <TableWrapper
              visible={homeVisibility}
              setExamVisibility={setExamFormVisibility}
              setTableWrapperVisibility={setTableWrapperVisibility}
              setCalendarVisibility={setCalendarVisibility}
              api_link={api_link}
              isAdmin={isAdmin}
              deleteExam={deleteExam}
              tSuccess={tSuccess}
              tError={tError}
            />
          )}
          {calendarVisibility && (
            <CalendarWrapper
              visible={calendarVisibility}
              setExamVisibility={setExamFormVisibility}
              setTableWrapperVisibility={setTableWrapperVisibility}
              setCalendarVisibility={setCalendarVisibility}
              api_link={api_link}
              isAdmin={isAdmin}
              tSuccess={tSuccess}
              tError={tError}
            />
          )}
          {examFormVisibility && (
            <ExamForm
              visible={examFormVisibility}
              setExamFormVisibility={setExamFormVisibility}
              setTableWrapperVisibility={setTableWrapperVisibility}
              setCalendarVisibility={setCalendarVisibility}
              api_link={api_link}
              isAdmin={isAdmin}
              tSuccess={tSuccess}
              tError={tError}
            />
          )}
          <Dialog
            header="Einträge Importieren"
            visible={importDialogVisible}
            footer={<></>}
            style={{ width: "65vw" }}
            onHide={() => {
              setImportDialogVisible(false);
            }}
            dismissableMask={true}
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
            dismissableMask={true}
          >
            {accountSettingsBody}
          </Dialog>
        </div>
      </Route>
    </Router>
  );
};

export default App;
