
import { Card, Row, Col } from 'react-bootstrap';
import '../css/events.css';
import pic from '../imgs/footer-stadium.webp';

export interface myEventProps {
    imgSource: string,
    imageAlt: string,
    caption: string,
    description: string,
    link: string,
    title: string,
    date?: string,
    location?: string
}

// This creates the event component that will be in the events carousel
function Events(props: myEventProps) {
    return (
        <div>
            <Card className='event-card'>
                <Card.Body>
                    <Row>
                        {/* Event Title */}
                        <Col md={12} xs={12}>
                            <Card.Title className='card-header'>
                                <h1 className="font-weight-bold">{props.title}</h1>
                            </Card.Title>
                        </Col>
                    </Row>
                    <Row>
                        {/* Event Image, and image description */}
                        <Col md={4} xs={12} className='image-container'>
                            <Card.Img src={pic} className="card-image" alt={props.imageAlt} />
                        </Col>
                        <Col md={8} sm={12} xs={12} className='event-text'>
                            <Card.Text>
                                {props.description}
                            </Card.Text>
                        </Col>
                    </Row>
                </Card.Body>
                <Card.Footer>
                    {/* Event Date and location*/}
                    <h5 style={{ textAlign: 'center', paddingBottom: '20px' }}> <i> {props.date} | {props.location}</i></h5>
                </Card.Footer>
            </Card>
        </div>
    )
}

export default Events
