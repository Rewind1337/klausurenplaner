import React, { useState, useEffect } from "react";

import "../css/global.css";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DetailView = (props) => {
  const [teacher, setTeacher] = useState(props.viewing.teacher);
  const [teacherSelectItems, setTeacherSelectItems] = useState([]);

  const [userInfo, setUserInfo] = useState(props.viewing.user);
  const [user, setUser] = useState(props.viewing.user.id);

  const [classgrade, setClassgrade] = useState(props.viewing.classgrade);
  const [classgradeVal, setClassgradeVal] = useState(false);

  const [topic, setTopic] = useState(props.viewing.topic);
  const [topicVal, setTopicVal] = useState(false);

  const [description, setDescription] = useState(props.viewing.description);

  const footer = (
    <div className="p-mt-3">
      <Button
        label="Schließen"
        className="p-button-primary"
        icon="pi pi-times"
        onClick={() => {
          props.dialogVis(false);
        }}
        tooltip="Abbrechen"
        tooltipOptions={{ position: "bottom" }}
      />
    </div>
  );

  var _date =
    props.viewing.date.substring(8, 12) +
    "-" +
    props.viewing.date.substring(4, 6) +
    "-" +
    props.viewing.date.substring(0, 2) +
    "T" +
    props.viewing.date.substring(15, 17) +
    ":" +
    props.viewing.date.substring(18, 20) +
    ":00";

  _date = new Date(_date);

  const [date, setDate] = useState(new Date(_date));
  const [time, setTime] = useState(
    props.viewing.date.substring(15, 17) +
      ":" +
      props.viewing.date.substring(18, 20)
  );

  return (
    <>
      {props.visible && (
        <>
          <div className="p-grid w-100"></div>
          {footer}
        </>
      )}
    </>
  );
};

export default DetailView;
