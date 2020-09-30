import React, { useEffect, useState, useRef } from "react";

import "../css/global.css";

import Table from "./Table";
import EditExamForm from "./EditExamForm";

import { Dialog } from "primereact/dialog";

const TableWrapper = (props) => {
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editing, setEditing] = useState("");
  const [fetchedData, setFetchedData] = useState([]);

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

  const editDialogBody = (
    <EditExamForm
      visible={true}
      editing={editing}
      submit={props.submitExam}
      delete={props.deleteExam}
      dialogVis={setEditDialogVisible}
      api_link={props.api_link}
    ></EditExamForm>
  );

  useEffect(() => {
    fetchAllExams();
  }, [props.submitExam, props.deleteExam]);

  return (
    <>
      {props.visible && (
        <div className="container-home">
          <div className="floating-card exam-table">
            <div className="card-header">Anstehende Arbeiten</div>
            <Table
              dialogVis={setEditDialogVisible}
              setTarget={setEditing}
              delete={props.deleteExam}
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

export default TableWrapper;
