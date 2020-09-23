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

  const [description, setDescription] = useState(props.editing.description);

  const footer = (
    <div className="p-mt-3">
      <Button
        className="p-mx-2"
        label="Speichern"
        icon="pi pi-check"
        onClick={() => {
          props.submit(
            classgrade,
            topic,
            date,
            time,
            description,
            props.editing.id,
            user
          );
          props.dialogVis(false);
        }}
      />
      <Button
        label="Abbrechen"
        className="p-button-danger p-mx-"
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
                onBlur={(e) => {
                  checkClassgrade(e.target.value);
                }}
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
                onBlur={(e) => {
                  checkTopic(e.target.value);
                }}
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
                max="16:00"
                onChange={(e) => {
                  setTime(e.target.value);
                }}
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
