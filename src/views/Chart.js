import {
  Container,
  DropdownButton,
  Dropdown,
  Modal,
  Table,
  Button,
} from "react-bootstrap";
import Chart from "react-apexcharts";
import moment from "moment";
import apiClient from "../service/api";
import { useState, useEffect } from "react";
import {
  checkIfExists,
  getReadableSpeedString,
  getReadableFileSizeString,
} from "../js/main_fn";
import HeaderDate from "../components/HeaderDate";

function Home({ days, setLoading, setLoadingErrorMsg, loading }) {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState([]);

  const [downloads, setDownloads] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [pings, setPings] = useState([]);
  const [daysSelected, setDaysSelected] = useState(days);

  // reset parameters at component mount
  useEffect(() => {
    setLoading(true);
    setLoadingErrorMsg(false);
  }, []);

  const series = [
    {
      name: "Download",
      data: downloads,
      type: "area",
    },
    {
      name: "Uploads",
      data: uploads,
      type: "area",
    },
    {
      name: "Ping",
      type: "column",
      data: pings,
    },
  ];

  const options = {
    chart: {
      height: 350,
      type: "area",
      events: {
        click: (event, chartContext, config) => {
          // console.log(JSON.stringify(config.config.series));
          let id = config.config.series[2].data[config.dataPointIndex];
          if (id !== undefined) {
            getModalData(id[1]);
          }
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: timestamps,
    },
    yaxis: {
      title: {
        text: "Speed / ping",
      },
      min: 0,
    },
    tooltip: {
      x: {
        format: "dd-MMM-yyyy HH:mm",
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "3%",
      },
    },
  };

  const getModalData = (id) => {
    apiClient
      .get(`/speedtest/${id}`)
      .then((response) => {
        setModalData(response.data);
        setShowModal(true);
      })
      .catch((err) => {
        console.error(err);
        alert(err);
      });
  };

  useEffect(() => {
    const getDownloadData = () => {
      const chart_data_download = [];
      const chart_data_upload = [];
      const chart_data_time = [];
      const chart_data_ping_and_id = [];
      setLoading(true);

      apiClient
        .get("/speedtest/")
        .then((response) => {
          // console.log(response.data);
          // filter data with last 24h
          // const filtered_data = response.data;
          const filtered_data = response.data.filter(function (i, n) {
            if (daysSelected !== 0) {
              return (
                moment().subtract(daysSelected * 24, "hours") <
                moment(new Date(i.timestamp))
              );
            } else {
              return i;
            }
          });

          // timestamp
          filtered_data.map((item) => {
            return chart_data_time.push(
              moment(new Date(item.timestamp)).format("DD-MMM-YYYY HH:mm")
            );
          });
          // downloads
          filtered_data.map((item) => {
            return chart_data_download.push(
              (item.download / 1000000).toFixed(2)
            );
          });
          // uploads
          filtered_data.map((item) => {
            return chart_data_upload.push((item.upload / 1000000).toFixed(2));
          });
          // ping
          filtered_data.map((item) => {
            return chart_data_ping_and_id.push([item.ping.toFixed(2), item.id]);
          });

          setTimestamps(chart_data_time);
          setDownloads(chart_data_download);
          setUploads(chart_data_upload);
          setPings(chart_data_ping_and_id);
          setLoading(false);
        })
        .catch((err) => {
          setLoadingErrorMsg(JSON.stringify(err));
          setDownloads(null);
        });
    };

    getDownloadData();
  }, [daysSelected]);

  return (
    <Container className="text-center mt-3">
      <HeaderDate daysSelected={daysSelected} />
      <DropdownButton
        className="text-end mb-3"
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
      {loading ? (
        <></>
      ) : (
        <Chart options={options} series={series} type="area" height={350} />
      )}

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
                    <td>Data Received</td>
                    <td>
                      {getReadableFileSizeString(
                        checkIfExists(modalData.bytes_received)
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Data Sent</td>
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

export default Home;
