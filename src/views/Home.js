import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import GaugeChart from "react-gauge-chart";
import apiClient from "../service/api";
import { useState, useEffect } from "react";

function Home() {
  const [avrDownload, setAvrDonload] = useState(0);
  const [avrUpload, setAvrUpload] = useState(0);
  const [avrPing, setAvrPing] = useState(0);

  // get avrage of provided array
  const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;

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
          let i = (item.download / 1000000).toFixed(2);
          return avrage_download.push(Number(i));
        });
        // uploads
        filtered_data.map((item) => {
          let i = (item.upload / 1000000).toFixed(2);
          return avrage_upload.push(Number(i));
        });
        // ping
        filtered_data.map((item) => {
          return avrage_ping.push(Number(item.ping.toFixed(2)));
        });
        
        setAvrDonload(average(avrage_download).toFixed()/100);
        setAvrUpload(average(avrage_upload).toFixed()/100)
        setAvrPing(average(avrage_ping).toFixed())

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
            nrOfLevels={10}
            colors={["#5BE12C", "#F5CD19", "#EA4228"]}
            arcWidth={0.28}
            percent={avrDownload}
            textColor="#212529"
            needleColor="#ffc107"
            needleBaseColor="#212529"
            formatTextValue={(value) => value + "Mpbs"}
          />
          <h2>Download</h2>
        </Col>
        <Col xs={12} md={6}>
          <GaugeChart
            id="gauge-upload"
            className="mt-4"
            nrOfLevels={10}
            colors={["#5BE12C", "#F5CD19", "#EA4228"]}
            arcWidth={0.3}
            percent={avrUpload}
            textColor="#212529"
            needleColor="#ffc107"
            needleBaseColor="#212529"
            formatTextValue={(value) => value + "Mpbs"}
          />
          <h2>Upload</h2>
        </Col>
        <Col className="mt-5" md={12}>
          <h1>{avrPing}ms</h1>
          <h6>Avrage Ping</h6>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
