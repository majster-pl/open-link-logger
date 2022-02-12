import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import CountUp from "react-countup";

const Badge = ({ total, label, icon }) => {
  return (
    <Col className="my-2" xs={12} md={4}>
      <Card className="dashboard-card h-100 text-white text-decoration-none border-0 rounded-pill bg-gray">
        <Card.Body>
          <Row className="px-2">
            <Col className="col-auto me-auto ms-4">
              <Col className="fn-blue">
                <div className="fw-bold fs-3">
                  {<CountUp end={total[0]} />}
                  {total[1]}
                </div>
                <div className="fw-light fs-4 text-white">{label}</div>
              </Col>
            </Col>
            <Col className="col-auto my-auto me-4 fn-orange">
              <i className={` ${icon} fa-2x text-lime`}></i>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default Badge;
