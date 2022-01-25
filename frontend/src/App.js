import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Alert,
  Offcanvas,
} from "react-bootstrap";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
  Link,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import NotFound from "./views/404";
import { useState } from "react";

function App() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
                  <Nav.Link as={NavLink} to="/">
                    Home
                  </Nav.Link>
                  <NavDropdown title="Chart" id="collasible-nav-dropdown">
                    <NavDropdown.Item as={NavLink} to="/last-24h">
                      Last 24h
                    </NavDropdown.Item>
                    <NavDropdown.Item as={NavLink} to="/last-3days">
                      Last 3 days
                    </NavDropdown.Item>
                    <NavDropdown.Item as={NavLink} to="/last-week">
                      Last Week
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink} to="/all-data">
                      All data
                    </NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link as={NavLink} to="/table">
                    Table
                  </Nav.Link>
                </Nav>
                <Nav>
                  <Nav.Link onClick={() => alert("Refresh data!")}>
                    Refresh
                  </Nav.Link>
                  <Nav.Link onClick={handleShow}>About</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <Container>
            <Container>
              <Routes>
                <Route path="/" element={<>Home page</>}></Route>
                <Route path="/last-24h" element={<>Last 24h !</>}></Route>
                <Route path="/last-3days" element={<>Last 3 days!</>}></Route>
                <Route path="/last-week" element={<>Last week!</>}></Route>
                <Route path="/all-data" element={<>ALL DATA!</>}></Route>
                <Route path="/table" element={<>TABLE PAGE</>}></Route>
                <Route path="/about" element={<>About page</>}></Route>
                <Route path="*" element={<NotFound />}></Route>
              </Routes>
            </Container>
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
              target={"_blank"}
            >
              github
            </a>{" "}
            page.
          </p>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default App;
