import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Container, Col, Row, Button } from "react-bootstrap";
import "../css/requestSection.css";
import ProfileImage from "./ProfileImage";
import Request from "../firebase/requests";
import RequestModal from "./ViewRequestModal";
import { useState } from "react";
import ViewRequestModal from "./ViewRequestModal";

// Interface for the request section component. An array of requests will be passed in
interface myRequestProps {
  requests: Request[];
}

// This request section component is a container for all requests that have been made
function RequestSection(myProps: myRequestProps) {

  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);


  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <div>
      <Container>
        {/* Title */}
        <div className="dashboard-request-section">
          <Row style={{ paddingBottom: "20px" }}>
            <Col className="title ms-auto">
              <h1> REQUESTS</h1>
            </Col>
          </Row>

          {/*All requests go into a scrollable div  */}
          <div
            className="request-container scroll"
            style={
              myProps.requests.length === 0
                ? { height: "auto" }
                : { height: "450px" }
            }
          >
            {/* If there are requests, map each element to a div */}
            {myProps.requests.length !== 0 ? (
              myProps.requests.map((requests, index) => (
                <div
                  key={index}
                  style={index !== 0 ? { borderTop: "1px black solid" } : {}}
                >
                  <Row className="rows ml-auto">
                    <Col md={2} sm={2} xs={4} className="profile-image">
                      <ProfileImage size="60px" position="ml-auto" />
                    </Col>
                    <Col md={7} sm={10} xs={8} className="request-name">
                      <h3 className="smallFont">{requests.requestName}</h3>
                    </Col>
                    
                    {/* Edit and Delete Buttons */}
                    <Col md={2} sm={12} xs={12} className='margin-auto'>
                        <Row>
                            <Button className='edit-button' onClick={handleShow}>View</Button>
                        </Row>
                        <Row style={{ padding: '10px 0px 0px 0px' }}>
                            <Button className='delete-button'>Delete</Button>
                        </Row>
                    </Col>
                  </Row>
                </div>
              ))
              ) : (
                  // Otherwise, display empty text
                  <div className="empty">
                <h4>
                  {" "}
                  <i>No pages are available </i>
                </h4>
              </div>
            )}
            <ViewRequestModal show={showModal} showModal={handleShow} handleClose={handleClose} request={new Request("Hi", "Bob", "a", "hi.")}/>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default RequestSection;
