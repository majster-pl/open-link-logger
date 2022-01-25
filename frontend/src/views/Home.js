import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import GaugeChart from "react-gauge-chart";

function Home() {
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
            arcWidth={0.3}
            percent={0.37}
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
            percent={0.17}
            textColor="#212529"
            needleColor="#ffc107"
            needleBaseColor="#212529"
            formatTextValue={(value) => value + "Mpbs"}
          />
          <h2>Upload</h2>
        </Col>
        <Col className="mt-5" md={12}>
          <h1>50ms</h1>
          <h6>Avrage Ping</h6>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
