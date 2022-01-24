import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes, NavLink, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import NotFound from "./views/404";

function App() {
  return (
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
                <Nav.Link as={NavLink} to="/about">
                  About
                </Nav.Link>
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
  );
}

export default App;
