import React, { useState, useEffect } from "react";

import "../css/global.css";

import { Button } from "primereact/button";

const DetailView = (props) => {
  const [teacher, setTeacher] = useState(props.viewing.teacher);
  const [topic, setTopic] = useState(props.viewing.topic);
  const [description, setDescription] = useState(props.viewing._description);

  const footer = (
    <div className="p-mt-3">
      <Button
        label="Schließen"
        className="p-button-primary dv-button"
        icon="pi pi-times"
        onClick={() => {
          props.dialogVis(false);
        }}
      />
    </div>
  );

  const formatDate = (dateString) => {
    let day = dateString.substring(8, 10) + ". ";
    let month = dateString.substring(5, 7) + ". ";
    let year = dateString.substring(0, 4) + " | ";
    let hours = parseInt(dateString.substring(11, 13)) + 2 + ":";
    let minutes = dateString.substring(14, 16) + " Uhr";

    let formattedDateString = day + month + year + hours + minutes;
    return formattedDateString;
  };

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

  const [date, setDate] = useState(new Date(_date));
  const [readableDate, setReadableDate] = useState(
    formatDate(date.toISOString())
  );

  return (
    <>
      {props.visible && (
        <>
          <div className="p-grid w-100">
            <div className="p-col-12 p-text-left">
              <div className="dv-label">Zeitpunkt</div>
              <div className="dv-text dv-date">{readableDate}</div>
            </div>
            <div className="p-col-12 p-text-left">
              <div className="dv-label">Fach</div>
              <div className="dv-text dv-topic">{topic}</div>
            </div>
            <div className="p-col-12 p-text-left">
              <div className="dv-label">Lehrkraft</div>
              <div className="dv-text dv-teacher">{teacher}</div>
            </div>
            <div className="p-col-12 p-text-left">
              <div className="dv-label">Beschreibung</div>
              <div className="dv-text dv-description">{description}</div>
            </div>
          </div>
          {footer}
        </>
      )}
    </>
  );
};

export default DetailView;
