import React, { useState, useEffect } from "react";

import "../css/global.css";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditExamForm = (props) => {
  const [teacher, setTeacher] = useState(props.editing.teacher);
  const [teacherSelectItems, setTeacherSelectItems] = useState([]);

  const [userInfo, setUserInfo] = useState(props.editing.user);
  const [user, setUser] = useState(props.editing.user.id);

  const [classgrade, setClassgrade] = useState(props.editing.classgrade);
  const [classgradeVal, setClassgradeVal] = useState(false);

  const [topic, setTopic] = useState(props.editing.topic);
  const [topicVal, setTopicVal] = useState(false);

  const [description, setDescription] = useState(props.editing._description);

  const footer = (
    <div className="p-mt-3">
      <Button
        className="p-mx-2"
        label="Speichern"
        icon="pi pi-check"
        onClick={() => {
          submit(
            classgrade,
            topic,
            date,
            time,
            description,
            props.editing.id,
            props.editing.user
          );
          props.dialogVis(false);
        }}
      />
      <Button
        label="Abbrechen"
        className="p-button-danger"
        icon="pi pi-times"
        onClick={() => {
          props.dialogVis(false);
        }}
      />
    </div>
  );

  var _date =
    props.editing.date.substring(8, 12) +
    "-" +
    props.editing.date.substring(4, 6) +
    "-" +
    props.editing.date.substring(0, 2) +
    "T" +
    props.editing.date.substring(15, 17) +
    ":" +
    props.editing.date.substring(18, 20) +
    ":00";

  _date = new Date(_date);

  const [date, setDate] = useState(new Date(_date));
  const [time, setTime] = useState(
    props.editing.date.substring(15, 17) +
      ":" +
      props.editing.date.substring(18, 20)
  );

  useEffect(() => {
    const options = {
      method: "GET",
    };

    fetch(props.api_link + "/users/role/2", options)
      .then((response) => response.json())
      .then((data) => {
        let parsedData = [];
        if (Array.isArray(data)) {
          for (let i = 0; i < data.length; i++) {
            parsedData.push({
              label: data[i].firstname + " " + data[i].lastname,
              value: data[i].id,
            });
          }
        } else {
          parsedData = [
            { label: data.firstname + " " + data.lastname, value: data.id },
          ];
        }

        setTeacherSelectItems(parsedData);
      });

    setTeacher(props.editing.teacher);
    checkTopic(props.editing.topic);
    checkClassgrade(props.editing.classgrade);
    setDate(_date);
  }, []);

  const checkClassgrade = (s) => {
    setClassgradeVal(
      classgrade.match(/^(?=.*[a-zA-Z0-9]).{2,128}$/) != null ? true : false
    );
    setClassgrade(s);
  };

  const checkTopic = (s) => {
    setTopicVal(
      topic.match(/^(?=.*[a-zA-Z0-9]).{1,128}$/) != null ? true : false
    );
    setTopic(s);
  };

  const submit = (classgrade, topic, date, time, description, id, user) => {
    let iso = date.toISOString();
    let exam = {
      classgrade: classgrade,
      topic: topic,
      description: description,
      date:
        iso.substring(0, 4) +
        "-" +
        iso.substring(5, 7) +
        "-" +
        iso.substring(8, 10) +
        "T" +
        time.substring(0, 2) +
        ":" +
        time.substring(3, 5) +
        ":00",
      id: id,
      user: user,
    };

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(exam),
    };

    fetch(props.api_link + "/exams/update", options)
      .then((response) => response.json())
      .then(() => {
        props.tSuccess("Erfolgreich geändert!");
        props.reFetch();
      })
      .catch(() => {
        props.tError("Fehler beim Ändern!");
      });
  };

  return (
    <>
      {props.visible && (
        <>
          <div className="p-grid w-100">
            <div className="p-col-12 p-my-1">
              <div
                className="examForm-label examForm-label-dropdown"
                style={{ top: "0px" }}
              >
                Unterrichtender Lehrer
              </div>
              <Dropdown
                value={user}
                options={teacherSelectItems}
                onChange={(e) => {
                  setUser(e.value);
                }}
                placeholder="Lehrer auswählen"
                tooltip="Lehrer"
              />
            </div>
            <div className="p-col-12 p-my-2">
              <div className="examForm-label" style={{ top: "0px" }}>
                Klasse
              </div>
              <InputText
                value={classgrade}
                className={"" + (classgradeVal ? "" : " p-invalid")}
                type="text"
                placeholder="Klasse eintragen"
                onChange={(e) => {
                  checkClassgrade(e.target.value);
                }}
                onKeyUp={(e) => {
                  checkClassgrade(e.target.value);
                }}
                tooltip="Die Klasse (z.B. 12ITa)"
              />
            </div>
            <div className="p-col-12 p-my-2">
              <div className="examForm-label" style={{ top: "0px" }}>
                Unterrichtsfach
              </div>
              <InputText
                value={topic}
                className={"" + (topicVal ? "" : " p-invalid")}
                type="text"
                placeholder="Unterrichtsfach eintragen"
                onChange={(e) => {
                  checkTopic(e.target.value);
                }}
                onKeyUp={(e) => {
                  checkTopic(e.target.value);
                }}
                tooltip="Das Unterrichtsfach (z.B. LF7 oder Englisch)"
              />
            </div>
            <div className="p-col-6 p-my-1">
              <div className="examForm-label" style={{ top: "0px" }}>
                Datum
              </div>
              <DatePicker
                selected={date}
                onChange={(date) => {
                  setDate(date);
                }}
                locale="de"
                dateFormat="dd.MM.yyyy"
                tooltip="Datum der Arbeit"
              />
            </div>
            <div className="p-col-6 p-my-1">
              <div className="examForm-label" style={{ top: "0px" }}>
                Uhrzeit
              </div>
              <InputText
                type="time"
                value={time}
                min="08:00"
                max="16:30"
                onChange={(e) => {
                  setTime(e.target.value);
                }}
                tooltip="Uhrzeit der Arbeit (08:00 - 16:30)"
              />
            </div>
            <div className="p-col-12">
              <div className="examForm-label" style={{ top: "22px" }}>
                Beschreibung / Information
              </div>
              <InputTextarea
                type="text"
                value={description}
                placeholder="(optional)"
                style={{ marginTop: "1.5rem" }}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                tooltip="Weitere Informationen"
              />
            </div>
          </div>
          {footer}
        </>
      )}
    </>
  );
};

export default EditExamForm;
