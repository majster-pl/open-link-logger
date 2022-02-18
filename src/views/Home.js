import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import GaugeChart from "react-gauge-chart";
import apiClient from "../service/api";
import { useState, useEffect } from "react";
import CountUp from "react-countup";
import "../css/main.css";
import {
  getReadableFileSizeString,
  getReadableSpeedString,
} from "../js/main_fn";
import Badge from "../components/Badge";

const Home = ({ setLoading, setLoadingErrorMsg }) => {
  const [avrDownload, setAvrDonload] = useState([0, " ---"]);
  const [avrUpload, setAvrUpload] = useState([0, " ---"]);
  const [avrPing, setAvrPing] = useState([0, " ---"]);
  const [totalDownload, setTotalDownload] = useState([0, " ---"]);
  const [totalUpload, setTotalUpload] = useState([0, " ---"]);

  // reset parameters at component mount
  useEffect(() => {
    setLoading(true);
    setLoadingErrorMsg(false);
  }, []);

  // get avrage of provided array
  const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;

  useEffect(() => {
    const getSum = (numbers) => {
      let total = numbers.reduce((sum, current) => sum + current, 0);
      return total;
    };
    const getAvrageData = () => {
      const avrage_download = [];
      const avrage_upload = [];
      const avrage_ping = [];
      const total_download = [];
      const total_upoload = [];

      apiClient
        .get("/speedtest/")
        .then((response) => {
          const filtered_data = response.data;
          // console.log(response.data);

          filtered_data.map((item) => {
            avrage_download.push(Number(item.download.toFixed(2)));
            avrage_upload.push(Number(item.upload.toFixed(2)));
            avrage_ping.push(Number(item.ping.toFixed(2)));
            total_download.push(Number(item.bytes_received.toFixed(2)));
            total_upoload.push(Number(item.bytes_sent.toFixed(2)));
          });

          setTimeout(() => {
            setAvrDonload(
              getReadableSpeedString(average(avrage_download).toFixed())
            );

            setAvrUpload(
              getReadableSpeedString(average(avrage_upload).toFixed())
            );

            // get total downloaded and uploaded data
            setTotalDownload(getReadableFileSizeString(getSum(total_download)));
            setTotalUpload(getReadableFileSizeString(getSum(total_upoload)));

            setAvrPing([average(avrage_ping).toFixed(), " ms"]);
            setLoading(false);
          }, 1000);
        })
        .catch((err) => {
          console.log("Error: ", err);
          // setLoadingError(true);
          setLoadingErrorMsg(JSON.stringify(err));
          // setLoading(false);
          // alert("Error while loading ");
        });
    };

    getAvrageData();
  }, []);

  return (
    <Container className="text-center mt-3">
      <h1>Avrage speed</h1>
      <Row>
        <Col xs={12} md={6}>
          <GaugeChart
            id="gauge-download"
            className="mt-4"
            nrOfLevels={14}
            colors={["#5BE12C", "#F5CD19", "#EA4228"]}
            arcWidth={0.3}
            percent={
              Number(avrDownload[0]) / 100 > 1
                ? 1
                : Number(avrDownload[0]) / 100
            }
            textColor="#212529"
            needleColor="#ffc107"
            needleBaseColor="#212529"
            animateDuration={6000}
            hideText={true}
          />
          <h1 className="fw-normal">
            <CountUp end={avrDownload[0]} />
            <span className="fs-4">{avrDownload[1]}</span>
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
            percent={
              Number(avrUpload[0]) / 100 > 1 ? 1 : Number(avrUpload[0]) / 100
            }
            textColor="#212529"
            needleColor="#ffc107"
            animateDuration={6000}
            needleBaseColor="#212529"
            hideText={true}
          />
          <h1 className="fw-normal">
            <CountUp end={avrUpload[0]} />
            <span className="fs-4">{avrUpload[1]}</span>
          </h1>
          <h2>Upload</h2>
        </Col>
        <hr className="mt-5" />
        <Row className="mx-auto my-5">
          <Badge
            total={avrPing}
            label={"Avrage Ping"}
            icon={"fa fa-exchange"}
          />
          <Badge
            total={totalDownload}
            label={"Total Download"}
            icon={"fa fa-download"}
          />
          <Badge
            total={totalUpload}
            label={"Total Upload"}
            icon={"fa fa-upload"}
          />
        </Row>
      </Row>
    </Container>
  );
};

export default Home;
