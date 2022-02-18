import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFound = ({setLoading}) => {
  // reset parameters at component mount
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Container className="text-center">
      <p className="fs-1">404 error</p>
      <p className="fs-4">This page doesn't exist.</p>
      <p>
        {"Click "}
        <Link to="/">here</Link>
        {" to go back to home page."}
      </p>
    </Container>
  );
};

export default NotFound;
