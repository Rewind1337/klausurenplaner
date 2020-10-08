import React, { useEffect, useState } from "react";

import "../css/global.css";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import deLocale from "@fullcalendar/core/locales/de";

import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

const CalendarWrapper = (props) => {
  const [parsedEvents, setParsedEvents] = useState();

  const [detailViewVisible, setDetailViewVisible] = useState(false);
  const [viewing, setViewing] = useState("");

  const fetchAllExams = () => {
    const options = {
      method: "GET",
    };

    fetch(props.api_link + "/exams", options)
      .then((response) => response.json())
      .then((data) => {
        let parsedData;
        if (Array.isArray(data)) {
          parsedData = [];

          data.sort((a, b) => new Date(a.date) - new Date(b.date));

          for (let j = 0; j < data.length; j++) {
            parsedData[j] = data[j];
            parsedData[j].date = data[j].date;
            parsedData[j].teacher =
              data[j].user.firstname + " " + data[j].user.lastname;
            parsedData[j].description =
              data[j].description.length > 28
                ? data[j].description.substring(0, 30) + "..."
                : data[j].description;
          }
        } else {
          parsedData = data;
          parsedData.date = parsedData.date;
          parsedData.teacher = data.user.firstname + " " + data.user.lastname;
          parsedData.description =
            data.description.length > 28
              ? data.description.substring(0, 30) + "..."
              : data.description;
        }
        let eventData = parsedData.map((e) => {
          return { start: e.date, title: e.topic };
        });
        setParsedEvents(eventData);
        console.log(eventData);
        console.log(parsedEvents);
      });
  };

  useEffect(() => {
    fetchAllExams();
  }, []);

  const eventClick = (info) => {
    let viewing = {};
    alert("Event: " + info.event.title);
  };

  const formatDate = (dateString) => {
    let year = dateString.substring(0, 4) + " | ";
    let month = dateString.substring(5, 7) + ". ";
    let day = dateString.substring(8, 10) + ". ";
    let hours = dateString.substring(11, 13) + ":";
    let minutes = dateString.substring(14, 16) + " Uhr";

    let formattedDateString = day + month + year + hours + minutes;
    return formattedDateString;
  };

  return (
    <>
      {props.visible && (
        <div className="container-calendar">
          <div className="floating-card calendar">
            <div className="card-header p-mb-3">Anstehende Arbeiten</div>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={parsedEvents}
              initialView="dayGridMonth"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={false}
              locale={deLocale}
              eventClick={eventClick}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CalendarWrapper;
