import { Modal, Table, Button } from "react-bootstrap"
import { checkIfExists, getReadableSpeedString, getReadableFileSizeString } from "../js/main_fn";
import moment from "moment";

const ModalTest = ({ modalData, setShowModal }) => {
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Test ID: {checkIfExists(modalData.id)}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Table striped bordered variant="light">
          <tbody>
            <tr>
              <th colSpan={2}>General</th>
            </tr>
            <tr>
              <td>Date & Time</td>
              <td>
                {moment(new Date(checkIfExists(modalData.timestamp))).format(
                  "HH:mm dddd DD-MMM-YYYY"
                )}
              </td>
            </tr>
            <tr>
              <td>Download</td>
              <td>
                {getReadableSpeedString(checkIfExists(modalData.download))}
              </td>
            </tr>
            <tr>
              <td>Upload</td>
              <td>{getReadableSpeedString(checkIfExists(modalData.upload))}</td>
            </tr>
            <tr>
              <td>Ping</td>
              <td>{checkIfExists(modalData.ping) + " ms"}</td>
            </tr>
            <tr>
              <td>Data Received</td>
              <td>
                {getReadableFileSizeString(
                  checkIfExists(modalData.bytes_received)
                )}
              </td>
            </tr>
            <tr>
              <td>Data Sent</td>
              <td>
                {getReadableFileSizeString(checkIfExists(modalData.bytes_sent))}
              </td>
            </tr>
            <tr>
              <th colSpan={2}>Client</th>
            </tr>
            <tr>
              <td>Country</td>
              <td>{checkIfExists(modalData.client.country)}</td>
            </tr>
            <tr>
              <td>IP</td>
              <td>{checkIfExists(modalData.client.ip)}</td>
            </tr>

            <tr>
              <td>Location</td>
              <td>
                <a
                  href={
                    "https://www.google.com/maps/place/" +
                    checkIfExists(modalData.client.lat) +
                    " " +
                    checkIfExists(modalData.client.lon)
                  }
                  target={"_blank"}
                >
                  {checkIfExists(modalData.client.lat) +
                    " " +
                    checkIfExists(modalData.client.lon)}
                </a>
              </td>
            </tr>
            <tr>
              <td>ISP Rating</td>
              <td>{checkIfExists(modalData.client.isprating)}</td>
            </tr>
            <tr>
              <td>ISP</td>
              <td>{checkIfExists(modalData.client.isp)}</td>
            </tr>
            <tr>
              <th colSpan={2}>Server</th>
            </tr>
            <tr>
              <td>Country</td>
              <td>
                {checkIfExists(modalData.server.country) +
                  " (" +
                  checkIfExists(modalData.server.cc) +
                  ")"}
              </td>
            </tr>
            <tr>
              <td>Host</td>
              <td>{checkIfExists(modalData.server.host)}</td>
            </tr>
            <tr>
              <td>Location</td>
              <td>{checkIfExists(modalData.server.name)}</td>
            </tr>
            <tr>
              <td>Coordinates</td>
              <td>
                <a
                  href={
                    "https://www.google.com/maps/place/" +
                    checkIfExists(modalData.server.lat) +
                    " " +
                    checkIfExists(modalData.server.lon)
                  }
                  target={"_blank"}
                >
                  {checkIfExists(modalData.server.lat) +
                    " " +
                    checkIfExists(modalData.server.lon)}
                </a>
              </td>
            </tr>
            <tr>
              <td>Id</td>
              <td>{checkIfExists(modalData.server.id)}</td>
            </tr>
            <tr>
              <td>Latency</td>
              <td>{checkIfExists(modalData.server.latency)}</td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowModal(false)}
        >
          Close
        </Button>
      </Modal.Footer>
    </>
  );
};

export default ModalTest