import { useState, useRef } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import '../css/formModal.css'
import '../css/whiteListSection.css'

interface addUserProps {
    addUser: (name: string, email: string, image: string) => void;
}

// This modal pops up to provide the user with a format to enter new user information
// TODO: Add more information potentially
function AddUserModal({ addUser }: addUserProps) {


    const fullNameRef = useRef<HTMLInputElement | null>(null);
    const emailRef = useRef<HTMLInputElement | null>(null);
    const [validated, setValidated] = useState(false);
    const [show, setShow] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null); // Use File type for selectedImage state

    // Handles opening/closing the modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Handles submission of the form and closing of the modal in one. 
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault(); // Stops typical form behavior like reloading the page
        event.stopPropagation(); // Stops other event handlers from receiving this event

        const form = event.currentTarget;
        // Checks form validity
        if (form.checkValidity()) {
            // Gets form information and calls addUser()
            if (fullNameRef.current && emailRef.current && selectedImage) {
                const fullName = fullNameRef.current.value;
                const email = emailRef.current.value;
                addUser(fullName, email, URL.createObjectURL(selectedImage));
            }
            handleClose();
        }
        setValidated(true);
    };


    return (
        <>

            {/* Customizes the add user button */}
            <Row style={{ paddingTop: '20px' }}>
                <Col className='add-user-button'>
                    <Button onClick={handleShow} aria-label='Add User Icon'> Add New User</Button>
                </Col>
            </Row>

            {/* Modal with nested form components */}
            <Modal show={show} onHide={handleClose} className='customized-modal'>
                <Modal.Header closeButton>
                    <Modal.Title>Request to be Featured</Modal.Title>
                </Modal.Header>
                <Form noValidate validated={validated} onSubmit={handleSubmit}  >
                    <Modal.Body >

                        {/* Full Name Text Input */}
                        <Row className="mb-3">
                            <Form.Group controlId="validationCustom01">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="John Doe"
                                    alt='Full Name Text Input'
                                    ref={fullNameRef}

                                />
                                <Form.Control.Feedback type="invalid">
                                    <h6 style={{ color: 'white' }}>Please enter full name </h6>
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        {/*Email Text Input*/}
                        <Row className="mb-3">
                            <Form.Group controlId="validationCustom02">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    required
                                    type="email"
                                    placeholder="name@example.com"
                                    alt='Email Text Input'
                                    ref={emailRef}
                                />
                                <Form.Control.Feedback type="invalid">
                                    <h6 style={{ color: 'white' }}>Please enter a valid email</h6>
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        {/* https://mdbootstrap.com/docs/standard/forms/file/ */}
                        {/* https://stackoverflow.com/questions/39484895/how-to-allow-input-type-file-to-select-the-same-file-in-react-component */}
                        {/* https://surajsharma.net/blog/react-file-upload-accept-only-images */}
                        {/* Image Selector for new user*/}
                        <Row className="mb-3">
                            <Form.Group controlId="validationCustom03">
                                <Form.Label className="form-label" id="customFile" aria-required>Image</Form.Label>
                                <input
                                    type="file" //allow file selector
                                    accept="image/png, image/jpeg" //only accept images
                                    className="form-control"
                                    id="customFile"
                                    onChange={(event) => {
                                        // Get the file that was selected, and set the selected image to it
                                        const file = event.target.files && event.target.files[0];
                                        if (file) {
                                            setSelectedImage(file);
                                        }
                                    }}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    <h6 style={{ color: 'white' }}>Please choose an image</h6>
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                    </Modal.Body>

                    {/* Submit and Cancel Buttons */}
                    <Modal.Footer >
                        <Row className='ml-auto'>
                            <Col>
                                <Button variant="secondary" onClick={handleClose} aria-label='Cancel Button'>
                                    Cancel
                                </Button>
                            </Col>
                            <Col>
                                <Button type='submit' variant="light" aria-label='Submit Button'>
                                    Submit
                                </Button>
                            </Col>
                        </Row>
                    </Modal.Footer>
                </Form>
            </Modal >
        </>
    );
}

export default AddUserModal;