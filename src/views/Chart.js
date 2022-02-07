import React from "react";
import { Container, DropdownButton, Dropdown } from "react-bootstrap";
import Chart from "react-apexcharts";
import moment from "moment";
import apiClient from "../service/api";
import { useState, useEffect } from "react";

function Home({ days, setLoading, setLoadingErrorMsg }) {
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

  useEffect(() => {
    const getDownloadData = () => {
      const chart_data_download = [];
      const chart_data_upload = [];
      const chart_data_time = [];
      const chart_data_ping = [];
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
            return chart_data_ping.push(item.ping.toFixed(2));
          });

          setTimestamps(chart_data_time);
          setDownloads(chart_data_download);
          setUploads(chart_data_upload);
          setPings(chart_data_ping);
          setLoading(false);
        })
        .catch((err) => {
          setLoadingErrorMsg(JSON.stringify(err));
          setDownloads(null);
        });
    };

    getDownloadData();
  }, [daysSelected]);

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
    <Container className="text-center mt-3">
      {chartDescription()}
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
      <Chart options={options} series={series} type="area" height={350} />
    </Container>
  );
}

export default Home;
