import React, { useEffect, useState, useRef } from "react";

import "../css/global.css";

import Table from "./Table";
import EditExamForm from "./EditExamForm";
import DetailView from "./DetailView";

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const TableWrapper = (props) => {
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [detailViewVisible, setDetailViewVisible] = useState(false);
  const [editing, setEditing] = useState("");
  const [viewing, setViewing] = useState("");
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
            parsedData[j].description =
              data[j].description.length > 28
                ? data[j].description.substring(0, 30) + "..."
                : data[j].description;
          }
        } else {
          parsedData = data;
          parsedData.date = formatDate(parsedData.date);
          parsedData.teacher = data.user.firstname + " " + data.user.lastname;
          parsedData.description =
            data.description.length > 28
              ? data.description.substring(0, 30) + "..."
              : data.description;
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

  const viewExamBody = (
    <DetailView
      visible={true}
      viewing={viewing}
      dialogVis={setDetailViewVisible}
    ></DetailView>
  );

  var dt;

  return (
    <>
      {props.visible && (
        <div className="container-home">
          <Button
            label=""
            icon="pi pi-print"
            className="btn-fab fab-1 p-button-raised p-button-rounded"
            onClick={() => {
              window.print();
            }}
          />
          <Button
            label=""
            icon="pi pi-external-link"
            className="btn-fab fab-2 p-button-raised p-button-rounded"
          />
          <div className="floating-card exam-table">
            <div className="card-header">Anstehende Arbeiten</div>
            <Table
              dialogVis={setEditDialogVisible}
              setTarget={setEditing}
              setViewing={setViewing}
              delete={props.deleteExam}
              editing={editing}
              fetchedData={fetchedData}
              api_link={props.api_link}
              isAdmin={props.isAdmin}
              reFetch={fetchAllExams}
            />
            <Dialog
              header="Eintrag bearbeiten"
              visible={editDialogVisible}
              footer={<></>}
              style={{ width: "75vw" }}
              onHide={() => {
                setEditDialogVisible(false);
              }}
              dismissableMask={true}
            >
              {editDialogBody}
            </Dialog>
            <Dialog
              header="Detailansicht"
              visible={detailViewVisible}
              footer={<></>}
              style={{ width: "75vw" }}
              onHide={() => {
                setEditDialogVisible(false);
              }}
              dismissableMask={true}
            >
              {viewExamBody}
            </Dialog>
          </div>
        </div>
      )}
    </>
  );
};

export default TableWrapper;
