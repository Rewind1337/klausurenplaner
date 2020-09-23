import React, { useState } from "react";

import "../css/global.css";

import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";

import "react-datepicker/dist/react-datepicker.css";
import csv from "csvtojson";

const ImportForm = (props) => {
  const [selected, setSelected] = useState("");

  const uploadInvoice = (invoiceFile) => {
    let data = invoiceFile.substring(invoiceFile.indexOf("base64,") + 11);

    data = window.atob(data);

    let parsedInvoiceFile = [];

    csv()
      .fromString(data)
      .then((json) => {
        if (selected === "users") {
        } else if (selected === "exams") {
          for (let j in json) {
            let pj = {};

            let _date =
              json[j].Datum.substring(8, 12) +
              "-" +
              json[j].Datum.substring(4, 6) +
              "-" +
              json[j].Datum.substring(0, 2) +
              "T" +
              json[j].Datum.substring(15, 17) +
              ":" +
              json[j].Datum.substring(18, 20) +
              ":00";

            pj.date = new Date(_date);
            pj.classgrade = json[j].Klasse;
            pj.topic = json[j].Schulfach;
            pj.description = json[j].Information;

            const options = {
              method: "GET",
            };

            let firstname = json[j].Lehrkraft.split(" ")[0].trim();
            let lastname = json[j].Lehrkraft.split(" ")[1].trim();

            fetch(
              props.api_link +
                "/users/findByFullName/" +
                firstname +
                "/" +
                lastname +
                "",
              options
            )
              .then((response) => response.json())
              .then((data) => {
                pj.user = data;
                parsedInvoiceFile.push(pj);
              })
              .catch((e) => {
                console.log(e);
              });
          }

          setTimeout(function () {
            const options = {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(parsedInvoiceFile),
            };

            fetch(props.api_link + "/" + selected + "/batchadd", options)
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
              })
              .catch((e) => {
                console.log(e);
              });
          }, 1000);
        }
      });
  };

  const invoiceUploadHandler = ({ files }) => {
    const [file] = files;
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      uploadInvoice(e.target.result);
    };

    fileReader.readAsDataURL(file);
  };

  return (
    <>
      {props.visible && (
        <div>
          <div className="p-grid">
            <div className="p-col-6 p-my-1">
              <Button
                label="Benutzer"
                icon="pi pi-user"
                className={"w-100" + (selected === "users" ? " active" : "")}
                onClick={() => {
                  setSelected("users");
                }}
              />
            </div>
            <div className="p-col-6 p-my-1">
              <Button
                label="Arbeiten"
                icon="pi pi-envelope"
                className={"w-100" + (selected === "exams" ? " active" : "")}
                onClick={() => {
                  setSelected("exams");
                }}
              />
            </div>
            {selected !== "" && (
              <div className="p-col-12 p-mt-2">
                <FileUpload
                  className="w-100"
                  name="demo"
                  chooseLabel="Datei wählen"
                  uploadLabel="Datei hochladen"
                  cancelLabel="Abbrechen"
                  accept=".csv"
                  customUpload={true}
                  uploadHandler={invoiceUploadHandler}
                  mode="basic"
                  auto
                ></FileUpload>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImportForm;
