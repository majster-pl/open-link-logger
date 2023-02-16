import { Modal, Table, Button } from "react-bootstrap"
import { getReadableSpeedString, getReadableFileSizeString } from "../js/main_fn";
import moment from "moment";

const ModalTest = ({ modalData, setShowModal }) => {
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Test ID: {modalData.id ?? "Unknown"}</Modal.Title>
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
                {modalData.timestamp ? moment(new Date(modalData.timestamp)).format("DD-MMM-YYYY HH:mm") : "Unknown"}
              </td>
            </tr>
            <tr>
              <td>Download</td>
              <td>
                {modalData.download && modalData.download.bandwidth ? getReadableSpeedString(modalData.download.bandwidth) : "Unknown"}
              </td>
            </tr>
            <tr>
              <td>Upload</td>
              <td>{modalData.upload && modalData.upload.bandwidth ? getReadableSpeedString(modalData.upload.bandwidth) : "Unknown"}</td>
            </tr>
            <tr>
              <td>Ping</td>
              <td>{modalData.ping && modalData.ping.latency ? modalData.ping.latency + " ms" : "Unknown"}</td>
            </tr>
            <tr>
              <td>Lost Packets</td>
              <td>{modalData.packetLoss ||modalData.packetLoss >= 0 ? modalData.packetLoss : "Unknown"}</td>
            </tr>
            <tr>
              <td>Data Received</td>
              <td>
                {modalData.download && modalData.download.bytes ? getReadableFileSizeString(modalData.download.bytes) : "Unknown"}
              </td>
            </tr>
            <tr>
              <td>Link to test</td>
              <td>
                {(modalData.result && modalData.result.url) ? <a href={modalData.result.url} target="_blank">{modalData.result.url}</a> : "Unknown"}
              </td>
            </tr>
            <tr>
              <td>Data Sent</td>
              <td>
                {modalData.upload && modalData.upload.bytes ? getReadableFileSizeString(modalData.upload.bytes) : "Unknown"}
              </td>
            </tr>
            <tr>
              <th colSpan={2}>Client</th>
            </tr>
            <tr>
              <td>VPN network</td>
              <td>{modalData.interface && modalData.interface.isVpn ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <td>IP</td>
              <td>{modalData.interface && modalData.interface.externalIp ? modalData.interface.externalIp : "Unknown"}</td>
            </tr>

            <tr>
              <td>ISP</td>
              <td>{modalData.isp ?? "Unknown"}</td>
            </tr>
            <tr>
              <th colSpan={2}>Server</th>
            </tr>
            <tr>
              <td>Country</td>
              <td>
                {modalData.server && (modalData.server.country && modalData.server.location) ?
                  modalData.server.country + " (" + modalData.server.location + ")" : "Unknown"}
              </td>
            </tr>
            <tr>
              <td>Host</td>
              <td>{(modalData.server && modalData.server.host) ?? "Unknown"}</td>
            </tr>
            <tr>
              <td>Location</td>
              <td>{(modalData.server && modalData.server.name) ?? "Unknown"}</td>
            </tr>
            <tr>
              <td>Id</td>
              <td>{(modalData.server && modalData.server.id) ?? "Unknown"}</td>
            </tr>
            <tr>
              <td>IP</td>
              <td>{(modalData.server && modalData.server.ip) ?? "Unknown"}</td>
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