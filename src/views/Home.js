import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import GaugeChart from "react-gauge-chart";
import apiClient from "../service/api";
import { useState, useEffect } from "react";
import CountUp from "react-countup";

function Home() {
  const [avrDownload, setAvrDonload] = useState(0);
  const [avrDownloadUnit, setAvrDonloadUnit] = useState(" ---");
  const [avrUpload, setAvrUpload] = useState(0);
  const [avrUploadUnit, setAvrUploadUnit] = useState(" ---");
  const [avrPing, setAvrPing] = useState(0);

  // get avrage of provided array
  const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;

  const getReadableFileSizeString = (fileSizeInBytes) => {
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

    return [Math.max(fileSizeInBytes, 0.1).toFixed(1), byteUnits[i]];
  };

  const getAvrageData = () => {
    const avrage_download = [];
    const avrage_upload = [];
    const avrage_ping = [];

    apiClient
      .get("/speedtest/")
      .then((response) => {
        const filtered_data = response.data;

        // downloads
        filtered_data.map((item) => {
          let i = item.download.toFixed(2);
          // let e = getReadableFileSizeString(item.download, null);
          return avrage_download.push(Number(i));
        });
        // uploads
        filtered_data.map((item) => {
          let i = item.upload.toFixed(2);
          return avrage_upload.push(Number(i));
        });
        // ping
        filtered_data.map((item) => {
          return avrage_ping.push(Number(item.ping.toFixed(2)));
        });

        setTimeout(() => {
          setAvrDonload(
            getReadableFileSizeString(average(avrage_download).toFixed())[0]
          );
          setAvrDonloadUnit(
            getReadableFileSizeString(average(avrage_download).toFixed())[1]
          );

          setAvrUpload(
            getReadableFileSizeString(average(avrage_upload).toFixed())[0]
          );
          setAvrUploadUnit(
            getReadableFileSizeString(average(avrage_upload).toFixed())[1]
          );

          setAvrPing(average(avrage_ping).toFixed());
        }, 1500);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  };

  useEffect(() => {
    getAvrageData();
  }, []);

  return (
    <Container className="text-center mt-3">
      <h1>Your avrage speed</h1>
      <Row>
        <Col xs={12} md={6}>
          <GaugeChart
            id="gauge-download"
            className="mt-4"
            nrOfLevels={14}
            colors={["#5BE12C", "#F5CD19", "#EA4228"]}
            arcWidth={0.3}
            percent={
              Number(avrDownload) / 100 > 1 ? 1 : Number(avrDownload) / 100
            }
            textColor="#212529"
            needleColor="#ffc107"
            needleBaseColor="#212529"
            animateDuration={6000}
            hideText={true}
          />
          <h1 className="fw-normal">
            <CountUp end={avrDownload} />
            <span className="fs-4">{avrDownloadUnit}</span>
          </h1>
          <h2>Download</h2>
        </Col>
        <Col xs={12} md={6}>
          <GaugeChart
            id="gauge-upload"
            className="mt-4"
            nrOfLevels={14}
            colors={["#5BE12C", "#F5CD19", "#EA4228"]}
            arcWidth={0.3}
            percent={Number(avrUpload) / 100}
            textColor="#212529"
            needleColor="#ffc107"
            animateDuration={6000}
            needleBaseColor="#212529"
            hideText={true}
          />
          <h1 className="fw-normal">
            <CountUp end={avrUpload} />
            <span className="fs-4">{avrUploadUnit}</span>
          </h1>
          <h2>Upload</h2>
        </Col>
        <Col className="mt-5" md={12}>
          <h1>
            <CountUp delay={2} end={avrPing} />
            ms
          </h1>
          <h6>Avrage Ping</h6>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
