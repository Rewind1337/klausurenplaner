import React, { useEffect, useState, useRef } from "react";

import "../css/global.css";

import Table from "./Table";
import EditExamForm from "./EditExamForm";

import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";

const Home = (props) => {
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editing, setEditing] = useState("");
  const [fetchedData, setFetchedData] = useState([]);

  var homeToast = useRef();

  const deleteExam = (examID) => {
    fetch(props.api_link + "/exams/delete/" + examID, { method: "DELETE" })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // TODO
      });
  };

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

  const submitExam = (
    classgrade,
    topic,
    date,
    time,
    description,
    examID,
    userID
  ) => {
    let iso = new Date(date).toISOString();
    var exam = {
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
      id: examID,
      user: userID,
    };

    fetch(props.api_link + "/users/id/" + userID, { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        exam.user = data;
      })
      .then(() => {
        const options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(exam),
        };

        fetch(props.api_link + "/exams/edit", options)
          .then((response) => response.json())
          .then((data) => {
            homeToast.show({
              severity: "success",
              summary: "" + data,
              detail: "Order submitted",
            });
          });
      });
  };

  const editDialogBody = (
    <EditExamForm
      visible={true}
      editing={editing}
      submit={submitExam}
      delete={deleteExam}
      dialogVis={setEditDialogVisible}
      api_link={props.api_link}
    ></EditExamForm>
  );

  useEffect(() => {
    fetchAllExams();
  }, [submitExam, deleteExam]);

  return (
    <>
      {props.visible && (
        <div className="container-home">
          <Toast ref={(el) => (homeToast = el)} />
          <div className="floating-card exam-table">
            <div className="card-header">Anstehende Arbeiten</div>
            <Table
              dialogVis={setEditDialogVisible}
              setTarget={setEditing}
              delete={deleteExam}
              editing={editing}
              fetchedData={fetchedData}
              api_link={props.api_link}
              isAdmin={props.isAdmin}
            />
            <Dialog
              header="Eintrag bearbeiten"
              visible={editDialogVisible}
              footer={<></>}
              style={{ width: "75vw" }}
              onHide={() => {
                setEditDialogVisible(false);
              }}
            >
              {editDialogBody}
            </Dialog>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
