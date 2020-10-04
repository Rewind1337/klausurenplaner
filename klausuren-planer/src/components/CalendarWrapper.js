import React, { useEffect, useState } from "react";

import "../css/global.css";

import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

const CalendarWrapper = (props) => {
  let todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today

  const [fetchedData, setFetchedData] = useState([
    { title: "The Title", start: "2018-09-01" },
  ]);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchAllExams();
  }, []);

  const formatDate = (dateString) => {
    let year = dateString.substring(0, 4) + " | ";
    let month = dateString.substring(5, 7) + ". ";
    let day = dateString.substring(8, 10) + ". ";
    let hours = dateString.substring(11, 13) + ":";
    let minutes = dateString.substring(14, 16) + " Uhr";

    let formattedDateString = day + month + year + hours + minutes;
    return formattedDateString;
  };

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
            parsedData[j].date = formatDate(data[j].date);
            parsedData[j].teacher =
              data[j].user.firstname + " " + data[j].user.lastname;
          }
        } else {
          parsedData = data;
          parsedData.date = formatDate(parsedData.date);
          parsedData.teacher = data.user.firstname + " " + data.user.lastname;
        }
        setFetchedData(parsedData);
      });
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
              events={fetchedData}
              initialView="dayGridMonth"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CalendarWrapper;
