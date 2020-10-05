import React, { useState, useEffect } from "react";

import "../css/global.css";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";

import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import de from "date-fns/locale/de";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("de", de);

const ExamForm = (props) => {
  const [teacher, setTeacher] = useState("");
  const [teacherSelectItems, setTeacherSelectItems] = useState([]);
  const [teacherSelectDisabled, setTeacherSelectDisabled] = useState(false);

  const [classgrade, setClassgrade] = useState("");
  const [classgradeVal, setClassgradeVal] = useState(false);

  const [topic, setTopic] = useState("");
  const [topicVal, setTopicVal] = useState(false);

  const [description, setDescription] = useState("");

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("12:00");

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
      })
      .catch(() => {
        // TODO
      });

    setTeacher(parseInt(JSON.parse(localStorage.getItem("user")).id));
    setTeacherSelectDisabled(true);
  }, []);

  const submitExam = (classgrade, topic, date, time, description) => {
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
    };

    if (
      localStorage.getItem("user") != null ||
      localStorage.getItem("user" != "")
    ) {
      exam.user = JSON.parse(localStorage.getItem("user"));
    } else {
      props.tError("Fehler beim Erstellen!");
      return false;
    }

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(exam),
    };

    fetch(props.api_link + "/exams/add", options)
      .then((response) => response.json())
      .then(() => {
        props.tSuccess("Erfolgreich erstellt!");
      })
      .catch(() => {
        props.tError("Fehler beim Erstellen!");
      });
  };

  return (
    <>
      {props.visible && (
        <div
          className={"container-examform" + (props.visible ? " visible" : "")}
        >
          <div className="floating-card examForm">
            <div className="card-header">Neue Arbeit einplanen</div>
            <div className="p-grid w-100">
              <div className="p-col-12">
                <div className="examForm-label examForm-label-dropdown">
                  Unterrichtender Lehrer
                </div>
                <Dropdown
                  value={teacher}
                  options={teacherSelectItems}
                  onChange={(e) => {
                    setTeacher(e.value);
                  }}
                  placeholder="Lehrer auswählen"
                  disabled={teacherSelectDisabled}
                  tooltip="Lehrer"
                />
              </div>
              <div className="p-col-6 mb-2">
                <div className="examForm-label">Klasse</div>
                <InputText
                  className={"" + (classgradeVal ? "" : " p-invalid")}
                  type="text"
                  placeholder="Klasse eintragen"
                  onChange={(e) => {
                    checkClassgrade(e.target.value);
                  }}
                  onBlur={(e) => {
                    checkClassgrade(e.target.value);
                  }}
                  tooltip="Die Klasse (z.B. 12ITa)"
                />
              </div>
              <div className="p-col-6 mb-2">
                <div className="examForm-label">Unterrichtsfach</div>
                <InputText
                  className={"" + (topicVal ? "" : " p-invalid")}
                  type="text"
                  placeholder="Unterrichtsfach eintragen"
                  onChange={(e) => {
                    checkTopic(e.target.value);
                  }}
                  onBlur={(e) => {
                    checkTopic(e.target.value);
                  }}
                  tooltip="Das Unterrichtsfach (z.B. LF7 oder Englisch)"
                />
              </div>
              <div className="p-col-6">
                <div className="examForm-label">Datum</div>
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
              <div className="p-col-6">
                <div className="examForm-label">Uhrzeit</div>
                <InputText
                  type="time"
                  value={time}
                  min="08:00"
                  max="16:00"
                  onChange={(e) => {
                    setTime(e.target.value);
                  }}
                  tooltip="Uhrzeit der Arbeit (08:00 - 16:30)"
                />
              </div>
              <div className="p-col-12 mb-1">
                <div className="examForm-label">Beschreibung / Information</div>
                <InputTextarea
                  type="text"
                  value={description}
                  placeholder="(optional)"
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  tooltip="Weitere Informationen"
                  style={{ height: "13vh", marginTop: "1.5rem" }}
                />
              </div>
              <div className="p-col-12">
                <Button
                  label="Erstellen"
                  icon="pi pi-plus"
                  onClick={() => {
                    submitExam(classgrade, topic, date, time, description);
                    props.setTableWrapperVisibility(true);
                    props.setExamFormVisibility(false);
                  }}
                  tooltip="Erstellen"
                  tooltipOptions={{ position: "bottom" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExamForm;
