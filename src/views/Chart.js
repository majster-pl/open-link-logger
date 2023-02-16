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
import ModalTest from "../components/ModalTest";

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
              (item.download.bandwidth / 125000).toFixed(2)
            );
          });
          // uploads
          filtered_data.map((item) => {
            return chart_data_upload.push((item.upload.bandwidth / 125000).toFixed(2));
          });
          // ping
          filtered_data.map((item) => {
            return chart_data_ping_and_id.push([item.ping.latency.toFixed(2), item.id]);
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
          <ModalTest modalData={modalData} setShowModal={setShowModal} />
        ) : (
          <></>
        )}
      </Modal>
    </Container>
  );
}

export default Home;
