import React, { useState, useEffect } from "react";

import "../css/global.css";

import "react-datepicker/dist/react-datepicker.css";

import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const Table = (props) => {
  const [displayMode, setDisplayMode] = useState("default");
  const [dropDownSelected, setDropDownSelected] = useState("exams");
  const [dropDownSelection, setDropDownSelection] = useState([
    { label: "Arbeiten", value: "exams" },
    { label: "Schüler", value: "users" },
    { label: "Klassen", value: "classgrades" },
  ]);

  const [firstDefault, setFirstDefault] = useState(0);
  const [firstSingleClass, setFirstSingleClass] = useState(0);

  const [tableColumns, setTableColuns] = useState([
    { field: "date", header: "Datum" },
    { field: "classgrade", header: "Klasse" },
    { field: "teacher", header: "Lehrkraft" },
    { field: "topic", header: "Schulfach" },
    { field: "description", header: "Information" },
  ]);

  const [update, setUpdate] = useState(false);

  var dt;

  const exportCSV = () => {
    let x = dt.exportCSV();
    console.log(x);
  };

  const updateDisplay = (e) => {
    setDropDownSelected(e);
    if (e === "exams") {
    }
  };

  const dateTemplate = (rowData, column) => {
    return (
      <>
        <Button
          className="p-button-primary p-m-1"
          label=""
          icon="pi pi-pencil"
          onClick={() => {
            rowColumnEdit(rowData);
          }}
        />
        {props.isAdmin && (
          <Button
            className="p-button-danger p-m-1"
            label=""
            icon="pi pi-times"
            onClick={() => {
              rowColumnDelete(rowData);
            }}
          />
        )}
      </>
    );
  };

  const rowColumnEdit = (rowData, column) => {
    props.dialogVis(true);
    props.setTarget(rowData);
    setUpdate(!update);
  };

  const rowColumnDelete = (rowData, column) => {
    props.setTarget(rowData);
    props.delete(rowData.id);
    setUpdate(!update);
  };

  const dynamicColumns = tableColumns.map((col) => {
    return <Column key={col.field} field={col.field} header={col.header} />;
  });

  dynamicColumns.push(
    <Column
      className="hide-print"
      key={"actionsColumn"}
      body={dateTemplate}
      field={"actions"}
      header={"Aktionen"}
    />
  );

  return (
    <>
      <div className="container-table">
        <div
          className="w-50 hide-print"
          style={{
            textAlignLast: "left",
            textAlign: "left",
            float: "left",
            paddingBottom: "6px",
          }}
        >
          <Dropdown
            value={dropDownSelected}
            options={dropDownSelection}
            onChange={(e) => {
              updateDisplay(e.value);
            }}
            placeholder="Lehrer auswählen"
            className="p-mb-1"
          />
        </div>
        <div
          className="w-50 hide-print"
          style={{
            textAlignLast: "right",
            textAlign: "right",
            float: "right",
            paddingBottom: "6px",
          }}
        >
          <Button
            type="button"
            icon="pi pi-external-link"
            label="Exportieren"
            className="p-mr-1 p-mb-1"
            onClick={exportCSV}
          />
          <Button
            type="button"
            icon="pi pi-print"
            label="Drucken"
            className="p-mr-1 p-mb-1"
            onClick={() => {
              window.print();
            }}
          />
        </div>
        {displayMode === "default" && (
          <DataTable
            ref={(el) => {
              dt = el;
            }}
            paginator
            rows={100}
            value={props.fetchedData}
            first={firstDefault}
            onPage={(e) => setFirstDefault(e.first)}
          >
            {dynamicColumns}
          </DataTable>
        )}
        {displayMode === "single_class" && (
          <DataTable
            ref={(el) => {
              dt = el;
            }}
            paginator
            rows={100}
            value={props.fetchedData}
            first={firstSingleClass}
            onPage={(e) => setFirstSingleClass(e.first)}
          >
            {dynamicColumns}
          </DataTable>
        )}
      </div>
    </>
  );
};

export default Table;
