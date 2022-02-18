import {
  Navbar,
  Nav,
  Container,
  Alert,
  Offcanvas,
  Modal,
  Row,
  Col,
  Spinner,
  Button,
} from "react-bootstrap";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
  Link,
} from "react-router-dom";
import { useState } from "react";
import NotFound from "./views/404";
import Home from "./views/Home";
import Chart from "./views/Chart";
import TablePage from "./views/TablePage";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [loading, setLoading] = useState(true);
  const [loadingErrorMsg, setLoadingErrorMsg] = useState(false);

  return (
    <>
      <Router>
        <div className="App">
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
              <Navbar.Brand as={Link} to="/">
                <img
                  alt=""
                  src="/logo-with-title-transparent.png"
                  height="75"
                  className="d-inline-block align-top"
                />
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link eventKey={1} as={NavLink} to="/">
                    Home
                  </Nav.Link>
                  <Nav.Link eventKey={2} as={NavLink} to="/chart">
                    Chart
                  </Nav.Link>
                  <Nav.Link eventKey={3} as={NavLink} to="/table">
                    Table
                  </Nav.Link>
                </Nav>
                <Nav>
                  <Nav.Link
                    eventKey={4}
                    onClick={() => window.location.reload()}
                  >
                    Refresh
                  </Nav.Link>
                  <Nav.Link eventKey={5} onClick={handleShow}>
                    About
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <Container className="p-0 mt-3">
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    setLoading={setLoading}
                    setLoadingErrorMsg={setLoadingErrorMsg}
                  />
                }
              ></Route>
              <Route
                path="/chart"
                element={
                  <Chart
                    days={1}
                    setLoading={setLoading}
                    setLoadingErrorMsg={setLoadingErrorMsg}
                    loading={loading}
                  />
                }
              ></Route>
              <Route
                path="/table"
                element={
                  <TablePage
                    days={1}
                    setLoading={setLoading}
                    setLoadingErrorMsg={setLoadingErrorMsg}
                  />
                }
              ></Route>
              <Route path="/about" element={<>About page</>}></Route>
              <Route path="*" element={<NotFound />}></Route>
            </Routes>
          </Container>
        </div>
      </Router>
      <Offcanvas show={show} onHide={handleClose} placement="top">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <span className="fs-4">About </span>
            <span className="fw-bold text-success">Open Link Logger</span>
            <br />
            <span className="fs-6">Copyright (c) 2022 Szymon Waliczek</span>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <p>
            Open Link Logger is Open Source software which can be used to log
            your internet connection by adding a job to crontab and performing
            test in the sequence you want. Saved data then can be viewed in your
            favourite web browser.
          </p>
          <Alert variant="danger">
            <p>
              Please be aware that this software will use your internet data to
              perform tests. Charges might apply as per your service provider
              contract.
            </p>
            One test might use as much as <b>200MB</b>
          </Alert>
          <p>
            If you have any troubles using a software please report a issue on{" "}
            <a
              href="https://github.com/majster-pl/open-link-logger"
              rel="noopener"
            >
              github
            </a>{" "}
            page.
          </p>
        </Offcanvas.Body>
      </Offcanvas>
      <Modal
        show={loading}
        onHide={() => setLoading(false)}
        backdrop="static"
        centered
        className="modal-loading"
      >
        <div>
          {!loadingErrorMsg ? (
            <Row xs="auto" className="justify-content-center">
              <Col>
                <Spinner animation="grow" variant="success" />
              </Col>
              <Col>
                <Spinner animation="grow" variant="danger" />
              </Col>
              <Col>
                <Spinner animation="grow" variant="warning" />
              </Col>
            </Row>
          ) : (
            <></>
          )}
          {loadingErrorMsg ? (
            <Modal.Dialog>
              <Modal.Header closeButton>
                <Modal.Title>Error</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <p>Error occurred while loading data...</p>
                <Alert variant="danger">
                  <p className="text-break">{loadingErrorMsg}</p>
                </Alert>
              </Modal.Body>

              <Modal.Footer>
                <Button
                  variant="primary"
                  onClick={() => window.location.reload()}
                >
                  Reload
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          ) : (
            <></>
          )}
        </div>
      </Modal>
      <Navbar className="py-0" fixed="bottom" variant="dark" bg="dark">
        <Navbar.Brand style={{ fontSize: "0.8rem" }} className="ms-3 fn-orange">
          Copyright (c) 2022{" - "}
          <a
            className="fn-blue text-decoration-none"
            href="https://github.com/majster-pl"
            target={"_blank"}
            rel="noreferrer"
          >
            Szymon Waliczek {" "}
            <i className="fa fa-github" style={{fontSize: "1.1rem"}} aria-hidden="true"></i>
          </a>
        </Navbar.Brand>
      </Navbar>
    </>
  );
}

export default App;
