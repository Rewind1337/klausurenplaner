import React, { useState, useEffect } from "react";

import "../css/global.css";

import "react-datepicker/dist/react-datepicker.css";

import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const Table = (props) => {
  const [dropDownSelected, setDropDownSelected] = useState("exams");
  const [dropDownSelection, setDropDownSelection] = useState([
    { label: "Arbeiten", value: "exams" },
    { label: "Benutzer", value: "users" },
    { label: "Klassen", value: "classgrades" },
    { label: "Nutzerrollen", value: "userroles" },
  ]);

  const [amountRows, setAmountRows] = useState("25");
  const [amountRowsOptions, setAmountRowsOptions] = useState([
    { label: "10 pro Seite", value: "10" },
    { label: "25 pro Seite", value: "25" },
    { label: "50 pro Seite", value: "50" },
    { label: "100 pro Seite", value: "100" },
    { label: "250 pro Seite", value: "250" },
    { label: "500 pro Seite", value: "500" },
  ]);

  const [firstDefault, setFirstDefault] = useState(0);

  const [tableColumns, setTableColumns] = useState([
    { field: "date", header: "Datum" },
    { field: "classgrade", header: "Klasse" },
    { field: "teacher", header: "Lehrkraft" },
    { field: "topic", header: "Schulfach" },
    { field: "description", header: "Information" },
  ]);

  const [dynamicColumns, setDynamicColumns] = useState([]);

  const [update, setUpdate] = useState(false);

  useEffect(() => {
    let temp = [...tableColumns];
    let temp2 = temp.map((col) => {
      return <Column key={col.field} field={col.field} header={col.header} />;
    });
    temp2.push(
      <Column
        className="hide-print"
        key={"actionsColumn"}
        body={tableActions}
        field={"actions"}
        header={"Aktionen"}
      />
    );

    setDynamicColumns(temp2);
  }, [setTableColumns]);

  const updateDisplay = (e) => {
    setDropDownSelected(e);
    if (e === "exams") {
      setTableColumns([
        { field: "date", header: "Datum" },
        { field: "classgrade", header: "Klasse" },
        { field: "teacher", header: "Lehrkraft" },
        { field: "topic", header: "Schulfach" },
        { field: "description", header: "Information" },
      ]);
    } else if (e === "users") {
      setTableColumns([
        { field: "firstname", header: "Vorname" },
        { field: "lastname", header: "Nachname" },
        { field: "username", header: "Benutzername" },
        { field: "userrole", header: "Nutzerrolle" },
      ]);
    } else if (e === "userroles") {
      setTableColumns([
        { field: "id", header: "ID" },
        { field: "name", header: "Bezeichnung" },
      ]);
    }
  };

  const exportCSV = () => {
    dt.exportCSV();
  };

  const tableActions = (rowData, column) => {
    return (
      <>
        <Button
          className="p-button-info p-m-1"
          label=""
          icon="pi pi-eye"
          onClick={() => {
            rowColumnView(rowData);
          }}
        />
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
    props.reFetch();
  };

  const rowColumnDelete = (rowData, column) => {
    props.setTarget(rowData);
    props.delete(rowData.id);
    props.reFetch();
    setUpdate(!update);
  };

  const rowColumnView = (rowData, column) => {
    setUpdate(!update);
  };

  var dt;

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
            className="p-mb-1 w-50"
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
        <DataTable
          ref={(el) => {
            dt = el;
          }}
          paginator
          rows={parseInt(amountRows)}
          value={props.fetchedData}
          first={firstDefault}
          onPage={(e) => setFirstDefault(e.first)}
        >
          {dynamicColumns}
        </DataTable>
        <div
          className="w-100 hide-print"
          style={{
            textAlignLast: "left",
            textAlign: "left",
            float: "left",
          }}
        >
          <Dropdown
            value={amountRows}
            options={amountRowsOptions}
            onChange={(e) => {
              setAmountRows(e.value);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Table;
