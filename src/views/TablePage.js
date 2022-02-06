import React from "react";
import { Container, DropdownButton, Dropdown } from "react-bootstrap";
import Chart from "react-apexcharts";
import moment from "moment";
import apiClient from "../service/api";
import { useState, useEffect } from "react";
import { useTable } from "react-table";

function Table({ days, setLoading, setLoadingErrorMsg }) {
  // reset parameters at component mount
  useEffect(() => {
    setLoading(true);
    setLoadingErrorMsg(false);
  }, []);

  const data = React.useMemo(
    () => [
      {
        col1: "Hello",
        col2: "World",
      },
      {
        col1: "react-table",
        col2: "rocks",
      },
      {
        col1: "whatever",
        col2: "you want",
      },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Column 1",
        accessor: "col1", // accessor is the "key" in the data
      },
      {
        Header: "Column 2",
        accessor: "col2",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  const [tableData, setTableData] = useState([]);

  const getDownloadData = () => {
    //   const chart_data_download = [];
    //   const chart_data_upload = [];
    //   const chart_data_time = [];
    //   const chart_data_ping = [];

    apiClient
      .get("/speedtest/")
      .then((response) => {
        console.log(response.data);
        // setTableData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    console.log(tableData);
    getDownloadData();
  }, []);

  return (
    <Container className="text-center mt-3">
      {/* {tableData} */}
      <table {...getTableProps()} style={{ border: "solid 1px blue" }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  style={{
                    borderBottom: "solid 3px red",
                    background: "aliceblue",
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      style={{
                        padding: "10px",
                        border: "solid 1px gray",
                        background: "papayawhip",
                      }}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Container>
  );
}

export default Table;
