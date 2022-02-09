import React from "react";
import {
  Container,
  Modal,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Pagination,
  Table,
  Nav,
  DropdownButton,
  Dropdown,
  Stack,
} from "react-bootstrap";
import moment from "moment";
import apiClient from "../service/api";
import { useState, useEffect } from "react";
import { useTable } from "react-table";

function TablePage({ days, setLoading, setLoadingErrorMsg }) {
  const [daysSelected, setDaysSelected] = useState(1);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState([]);

  const [firstPage, setFirstPage] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [lastPage, setLastPage] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const [pagesPerPage, setPagesPerPage] = useState(10);

  const [currentPageUrl, setCurrentPageUrl] = useState(
    `/speedtest?_limit=${pagesPerPage}&timestamp_gte=${moment()
      .subtract(daysSelected * 24, "hours")
      .format("YYYY-MM-DDThh:mm")}&_page=1`
  );

  const generateTableUrl = (newPage) => {
    let url = "";
    if (daysSelected === 0) {
      url = `/speedtest?_limit=${pagesPerPage}&_page=${newPage}`;
    } else {
      url = `/speedtest?_limit=${pagesPerPage}&timestamp_gte=${moment()
        .subtract(daysSelected * 24, "hours")
        .format("YYYY-MM-DDThh:mm")}&_page=${newPage}`;
    }
    setCurrentPageUrl(url);
    // return url;
  };

  // reset parameters at component mount
  useEffect(() => {
    setLoading(true);
    setLoadingErrorMsg(false);
  }, []);

  const getReadableSpeedString = (fileSizeInBytes) => {
    let i = -1;
    const byteUnits = [
      " kbps",
      " Mbps",
      " Gbps",
      " Tbps",
      "Pbps",
      "Ebps",
      "Zbps",
      "Ybps",
    ];
    do {
      fileSizeInBytes = fileSizeInBytes / 1024;
      i++;
    } while (fileSizeInBytes > 1024);

    return [Math.max(fileSizeInBytes, 0).toFixed(2), byteUnits[i]];
  };

  const getReadableFileSizeString = (fileSizeInBytes) => {
    let i = -1;
    const byteUnits = [" kb", " Mb", " Gb", " Tb", "Pb", "Eb", "Zb", "Yb"];
    do {
      fileSizeInBytes = fileSizeInBytes / 1024;
      i++;
    } while (fileSizeInBytes > 1024);

    return [Math.max(fileSizeInBytes, 0).toFixed(2), byteUnits[i]];
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
        Cell: ({ value }) => {
          return value;
        },
      },
      {
        Header: "Date",
        accessor: "timestamp",
        Cell: ({ value }) => {
          return moment(new Date(value)).format("DD-MMM-YYYY HH:mm");
        },
      },
      {
        Header: "Download",
        accessor: "download",
        Cell: ({ value }) => {
          return getReadableSpeedString(value);
        },
      },
      {
        Header: "Upload",
        accessor: "upload",
        Cell: ({ value }) => {
          return getReadableSpeedString(value);
        },
      },
      {
        Header: "Ping",
        accessor: "ping",
        Cell: ({ value }) => {
          return value.toFixed(2) + " ms";
        },
      },
      {
        Header: "Details",
        accessor: "share",
        Cell: ({ value, data_ }) => {
          return (
            <Nav.Link
              className="py-0 text-success"
              onClick={() => {
                setShowModal(true);
                setModalData(data_);
              }}
            >
              Open
            </Nav.Link>
          );
        },
      },
    ],
    []
  );

  const getPagination = (headers) => {
    setFirstPage(null);
    setLastPage(null);
    setNextPage(null);
    setPrevPage(null);
    setTotalPages(null);
    const ar = headers.link.split(",");

    const getLinks = (link_no) => {
      let key = ar[link_no].split("; ")[1].slice(5, -1);
      let val = ar[link_no].split("; ")[0].slice(link_no === 0 ? 1 : 2, -1);
      switch (key) {
        case "first":
          setFirstPage(val);
          break;

        case "last":
          setLastPage(val);
          break;

        case "next":
          setNextPage(val);
          break;

        case "prev":
          setPrevPage(val);
          break;
      }
    };

    for (let index = 0; index < ar.length; index++) {
      if (ar.length !== 1) {
        getLinks(index);
      }
    }
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  const getDownloadData = () => {
    const table_data = [];
    setLoading(true);

    apiClient
      .get(
        currentPageUrl
      )
      // 2022-02-05
      .then((response) => {
        console.log(response);
        getPagination(response.headers);

        response.data.map((item, i) => {
          return table_data.push(item);
        });
        setData(table_data);
        setTimeout(() => {
          setLoading(false);
        }, 100);
      })
      .catch((err) => {
        setLoadingErrorMsg(JSON.stringify(err));
      });
  };

  useEffect(() => {
    generateTableUrl(1);
  }, [daysSelected]);

  useEffect(() => {
    getDownloadData();
  }, [currentPageUrl]);

  useEffect(() => {
    console.log(firstPage);
  }, [firstPage]);

  useEffect(() => {
    console.log("next:", nextPage);
    if (nextPage) {
      setCurrentPage(Number(nextPage.split("page=")[1]) - 1);
    }
  }, [nextPage]);

  useEffect(() => {
    console.log("prev:", prevPage);
    if (prevPage) {
      setCurrentPage(Number(prevPage.split("page=")[1]) + 1);
    }
  }, [prevPage]);

  useEffect(() => {
    console.log(lastPage);
    if (lastPage) {
      setTotalPages(Number(lastPage.split("page=")[1]));
    }
  }, [lastPage]);

  useEffect(() => {
    console.log("currentPage:", Number(currentPage));
    // console.log("TYPE OFF TOTAL PAGES:", typeof totalPages);
  }, [currentPage]);

  const checkIfExists = (str) => {
    if (typeof str !== "undefined") {
      return str;
    } else {
      return "no data";
    }
  };

  const chartDescription = () => {
    if (daysSelected === 0) {
      return (
        <div>
          <h1>Displaying all collected data</h1>
          <h4>
            <span style={{ color: "transparent" }}>today</span>
          </h4>
        </div>
      );
    } else {
      let days_text = daysSelected === 1 ? "hours" : "days";

      return (
        <div>
          <h1>
            Last {daysSelected === 1 ? 24 : daysSelected} {days_text}
          </h1>
          <h4>
            {daysSelected !== 1 ? (
              <>
                From:{" "}
                <span className="fw-light">
                  {moment()
                    .days(-daysSelected + 1)
                    .format("DD MMM YYYY")}
                </span>{" "}
                To:{" "}
                <span className="fw-light">
                  {moment().format("DD MMM YYYY")}
                </span>
              </>
            ) : (
              <>
                <span style={{ color: "transparent" }}>today</span>
              </>
            )}
          </h4>
        </div>
      );
    }
  };

  return (
    <Container className="text-center">
      {chartDescription()}

      <Stack direction="horizontal" gap={3} className="mb-2">
        <DropdownButton
          className="text-end ms-auto"
          variant="info"
          id="dropdown-basic-button"
          title="Filter"
        >
          <Dropdown.Item onClick={() => setDaysSelected(1)}>
            Last 24h
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setDaysSelected(3)}>
            Last 3 days
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setDaysSelected(7)}>
            Last Week
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setDaysSelected(0)}>
            All Data
          </Dropdown.Item>
        </DropdownButton>
      </Stack>

      <Table {...getTableProps()} striped bordered variant="dark">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
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
                    <td {...cell.getCellProps()}>
                      {cell.render("Cell", {
                        index: row.id,
                        id: row.original.id,
                        value: cell.value,
                        data_: row.original,
                        cust_name: row.original.customer_name,
                        uuid: row.original.uuid,
                      })}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Pagination className={`me-2 ${totalPages > 0 ? "" : "d-none"}`}>
        <Pagination.First
          className={`${currentPage === 0 ? "" : "disabled"}`}
          onClick={() => {
            console.log(firstPage);
          }}
        />
        <Pagination.Prev className={`${prevPage ? "" : "disabled"}`} />

        {[...Array(totalPages).keys()].map((index) => {
          let act = currentPage === index + 1 ? true : false;
          return (
            <Pagination.Item
              active={act}
              key={index + 1}
              onClick={() => generateTableUrl(Number(index) + 1)}
            >
              {Number(index) + 1}
            </Pagination.Item>
          );
        })}
        <Pagination.Next className={`${nextPage ? "" : "d-none"}`} />
        <Pagination.Last className={`${lastPage ? "" : "d-none"}`} />
      </Pagination>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        scrollable
        size="lg"
      >
        {typeof modalData.id !== "undefined" ? (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Test id: {checkIfExists(modalData.id)}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Table striped bordered variant="light">
                <tbody>
                  <tr>
                    <th colSpan={2}>General</th>
                  </tr>
                  <tr>
                    <td>Date & Time</td>
                    <td>
                      {moment(
                        new Date(checkIfExists(modalData.timestamp))
                      ).format("DD-MMM-YYYY HH:mm")}
                    </td>
                  </tr>
                  <tr>
                    <td>Download</td>
                    <td>
                      {getReadableSpeedString(
                        checkIfExists(modalData.download)
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Upload</td>
                    <td>
                      {getReadableSpeedString(checkIfExists(modalData.upload))}
                    </td>
                  </tr>
                  <tr>
                    <td>Ping</td>
                    <td>{checkIfExists(modalData.ping) + " ms"}</td>
                  </tr>
                  <tr>
                    <td>Bytes Received</td>
                    <td>
                      {getReadableFileSizeString(
                        checkIfExists(modalData.bytes_received)
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Bytes Sent</td>
                    <td>
                      {getReadableFileSizeString(
                        checkIfExists(modalData.bytes_sent)
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={2}>Client</th>
                  </tr>
                  <tr>
                    <td>Country</td>
                    <td>{checkIfExists(modalData.client.country)}</td>
                  </tr>
                  <tr>
                    <td>ISP</td>
                    <td>{checkIfExists(modalData.client.isp)}</td>
                  </tr>
                  <tr>
                    <td>IP</td>
                    <td>{checkIfExists(modalData.client.ip)}</td>
                  </tr>

                  <tr>
                    <td>Location</td>
                    <td>
                      <a
                        href={
                          "https://www.google.com/maps/place/" +
                          checkIfExists(modalData.client.lat) +
                          " " +
                          checkIfExists(modalData.client.lon)
                        }
                        target={"_blank"}
                      >
                        {checkIfExists(modalData.client.lat) +
                          " " +
                          checkIfExists(modalData.client.lon)}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>ISP Rating</td>
                    <td>{checkIfExists(modalData.client.isprating)}</td>
                  </tr>
                  <tr>
                    <td>ISP</td>
                    <td>{checkIfExists(modalData.client.isp)}</td>
                  </tr>
                  <tr>
                    <th colSpan={2}>Server</th>
                  </tr>
                  <tr>
                    <td>Country</td>
                    <td>
                      {checkIfExists(modalData.server.country) +
                        " (" +
                        checkIfExists(modalData.server.cc) +
                        ")"}
                    </td>
                  </tr>
                  <tr>
                    <td>Host</td>
                    <td>{checkIfExists(modalData.server.host)}</td>
                  </tr>
                  <tr>
                    <td>Location</td>
                    <td>{checkIfExists(modalData.server.name)}</td>
                  </tr>
                  <tr>
                    <td>Coordinates</td>
                    <td>
                      <a
                        href={
                          "https://www.google.com/maps/place/" +
                          checkIfExists(modalData.server.lat) +
                          " " +
                          checkIfExists(modalData.server.lon)
                        }
                        target={"_blank"}
                      >
                        {checkIfExists(modalData.server.lat) +
                          " " +
                          checkIfExists(modalData.server.lon)}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>Id</td>
                    <td>{checkIfExists(modalData.server.id)}</td>
                  </tr>
                  <tr>
                    <td>Latency</td>
                    <td>{checkIfExists(modalData.server.latency)}</td>
                  </tr>
                </tbody>
              </Table>
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowModal(false)}
              >
                Close
              </Button>
            </Modal.Footer>
          </>
        ) : (
          <></>
        )}
      </Modal>
    </Container>
  );
}

export default TablePage;
