import React from "react";
import { Container } from "react-bootstrap";
import Chart from "react-apexcharts";
import moment from "moment";
import apiClient from "../service/api";
import { useState, useEffect } from "react";

function Home() {
  const [downloads, setDownloads] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [pings, setPings] = useState([]);

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

  const getDownloadData = () => {
    const chart_data_download = [];
    const chart_data_upload = [];
    const chart_data_time = [];
    const chart_data_ping = [];

    apiClient
      .get("/speedtest/")
      .then((response) => {
        console.log(response.data);
        // filter data with last 24h
        const filtered_data = response.data.filter(function (i, n) {
          return moment().days(-7) < moment(new Date(i.timestamp));
        });

        // timestamp
        filtered_data.map((item) => {
          return chart_data_time.push(
            moment(new Date(item.timestamp)).format("DD-MMM-YYYY HH:mm")
          );
        });
        // downloads
        filtered_data.map((item) => {
          return chart_data_download.push((item.download / 1000000).toFixed(2));
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
      })
      .catch((err) => {
        setDownloads(null);
      });
  };

  useEffect(() => {
    getDownloadData();
  }, []);

  return (
    <Container className="text-center mt-3">
      <h1>Last week </h1>
      <h4>
        From:{" "}
        <span className="fw-light">
          {moment().days(-7).format("DD MMM YYYY")}
        </span>{" "}
        To: <span className="fw-light">{moment().format("DD MMM YYYY")}</span>
      </h4>
      <Chart options={options} series={series} type="area" height={350} />
    </Container>
  );
}

export default Home;
