import { child, get, getDatabase, onValue, ref, remove, set, update } from "firebase/database"
import { Container, Col, Row, Form, Button } from "react-bootstrap"
import DeleteConfirmationModal from "./DeleteConfirmationModal"
import { useState, useEffect, ChangeEvent } from "react"
import '../css/editableEvent.css'

export interface editableComponentProps {
    pageOrder: number
    nestedOrder: number
    data: unknown,
    componentKey: string,
    pathName: string,
}


function EditableEventComponent(myProps: editableComponentProps) {

    const db = getDatabase();
    const myRef = ref(db);

    const [showDeleteModal, setShowDeletionModal] = useState<boolean>(false);
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');

    const [link, setLink] = useState('');
    const [imageSource, setImageSource] = useState('');
    const [imageAlt, setImageAlt] = useState('');
    const [imageCaption, setImageCaption] = useState('');



    // Set the JSON value that will be displayed to the text area whenever myProps change
    useEffect(() => {
        setDescription(myProps.data.description);
        setTitle(myProps.data.title);
        setLocation(myProps.data.location)
        setDate(myProps.data.date)

        setLink(myProps.data.link);
        setImageSource(myProps.data.imgSource);
        setImageAlt(myProps.data.imageAlt)
        setImageCaption(myProps.data.caption)
    }, [myProps]);

    useEffect(() => {
        // Create a reference to the database using the provided pathName
        const projects = ref(db, myProps.pathName);

        // Set up a listener to the database using onValue
        // The listener will update the state variable 'snapshot' with the retrieved data
        onValue(projects, (snapshot) => {
            let max = 0;
            let count = 0;
            // Iterate through the retrieved data to find the maximum nested order
            for (const [, value] of Object.entries(snapshot.val())) {
                if (value.pageOrder === myProps.pageOrder) {
                    if (value.nestedOrder > max) {
                        max = value.nestedOrder;
                    }
                    count++;
                }
            }
            // Dont allow user to delete component if it is the last event or project
            if (myProps.data.type === 'event' || myProps.data.type === 'project') {
                if (count === 1) {
                    // setIsNotDeletable(true)
                }
                else {
                    // setIsNotDeletable(false)
                }
            }
            // Update the state variable with the maximum nested order
            // setMaxNestedOrder(max);

        });
    }, [myProps]);


    // Opens the deletion confirmation modal
    function handleOpenConfirmationModal() {
        setShowDeletionModal(true);
    }


    /**
   * Handles changes in the text input for a component's data.
   * Note: This function is designed for text area inputs.
   * @param event - The changeevent for the text area.
   * Whenever changing the text input, call this function to send the edits up to the database.
   * Reference: // https://stackoverflow.com/questions/64649055/type-changeeventhtmlinputelement-is-not-assignable-to-type-changeeventhtml
   */
    const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>, path: string, setData) => {
        // Extract the new data from the event
        const newData = event.target.value;

        setData(newData);

        const updates = {};

        console.log(myProps.pathName + "/" + myProps.componentKey + path, '      LOOKY HERE')

        // // // Update the target component's nestedOrder
        updates[myProps.pathName + "/" + myProps.componentKey + path] = newData;

        // // Update the specific keys in the databases
        update(myRef, updates)
            .catch((error) => {
                console.error("Error updating nested orders:", error);
            });
    };

    /**
* Deletes a component from the database and reorders nested components.
* @param key - The key of the component to be deleted.
*/
    function deleteComponent(key: string) {
        // Delete the component from the draft
        // Reference: https://stackoverflow.com/questions/64419526/how-to-delete-a-node-in-firebase-realtime-database-in-javascript
        const deletePath = myProps.pathName + "/" + key;
        const valueRef = ref(db, deletePath);
        set(valueRef, null);

        // Reorder nested components
        const dbRef = ref(getDatabase());
        get(child(dbRef, myProps.pathName)).then((snapshot) => {
            if (snapshot.exists()) {
                for (const [nestedKey, nestedValue] of Object.entries(snapshot.val())) {
                    // If they are in the same grouping
                    if (nestedValue.pageOrder === myProps.pageOrder) {
                        if (nestedValue.nestedOrder > myProps.nestedOrder) {
                            // If the nested component's order is greater than the deleted component's order,
                            // update its nestedOrder to maintain the correct order.
                            const updates = {};
                            updates[myProps.pathName + '/' + nestedKey + '/nestedOrder'] = nestedValue.nestedOrder - 1;
                            update(dbRef, updates);
                        }
                    }
                }
            }
        }).catch((error) => {
            console.error(error);
        });
    }



    // Handles confirmed deletion and hiding the modal
    function remove() {
        deleteComponent(myProps.componentKey)
        setShowDeletionModal(false);
    }




    return (
        <div>
            <DeleteConfirmationModal show={showDeleteModal} onHide={() => setShowDeletionModal(false)} onConfirm={remove} name={'this ' + myProps.data.type} />
            <Container className="individual-event">
                <Row>
                    <Col md={12} sm={12} xs={12} style={{ textAlign: 'right' }} className="delete-component">
                        <Button onClick={handleOpenConfirmationModal}> <i className="bi bi-trash"></i></Button>
                    </Col>
                </Row>
                <Container className="styling">

                    <Row>

                        <Form>
                            <Form.Label className="form-label" id="customFile" aria-required><h2 className='smallFont metropolisRegular'>Event Title</h2></Form.Label>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Control value={title} onChange={(e) => handleTextAreaChange(e, '/title', setTitle)} as="textarea" rows={1} style={{ resize: 'none', border: '1px black solid' }} />
                            </Form.Group>
                        </Form>

                        <Form>
                            <Form.Label className="form-label" id="customFile" aria-required><h2 className='smallFont metropolisRegular'>Event Description</h2></Form.Label>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Control value={description} onChange={(e) => handleTextAreaChange(e, '/description', setDescription)} as="textarea" rows={5} style={{ resize: 'none', border: '1px black solid' }} />
                            </Form.Group>
                        </Form>


                        <Row>
                            <Col md={6}>
                                <Form>

                                    <Form.Label className="form-label" id="customFile" aria-required><h2 className='smallFont metropolisRegular'>Location</h2></Form.Label>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                        <Form.Control value={location} onChange={(e) => handleTextAreaChange(e, '/location', setLocation)} as="textarea" rows={1} style={{ resize: 'none', border: '1px black solid' }} />
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col md={6}>
                                <Form>
                                    <Form.Label className="form-label" id="customFile" aria-required><h2 className='smallFont metropolisRegular'>Date</h2></Form.Label>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                        <Form.Control value={date} onChange={(e) => handleTextAreaChange(e, '/date', setDate)} as="textarea" rows={1} style={{ resize: 'none', border: '1px black solid' }} />
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form>
                                    <Form.Label className="form-label" id="customFile" aria-required><h2 className='smallFont metropolisRegular'>Image Source</h2></Form.Label>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                        <Form.Control value={imageSource} onChange={(e) => handleTextAreaChange(e, '/imgSource', setImageSource)} as="textarea" rows={1} style={{ resize: 'none', border: '1px black solid' }} />
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col md={6}>
                                <Form>
                                    <Form.Label className="form-label" id="customFile" aria-required><h2 className='smallFont metropolisRegular'>Image Alt</h2></Form.Label>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                        <Form.Control value={imageAlt} onChange={(e) => handleTextAreaChange(e, '/imageAlt', setImageAlt)} as="textarea" rows={1} style={{ resize: 'none', border: '1px black solid' }} />
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row>

                        <Form>
                            <Form.Label className="form-label" id="customFile" aria-required><h2 className='smallFont metropolisRegular'>Image Caption</h2></Form.Label>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Control value={imageCaption} onChange={(e) => handleTextAreaChange(e, '/caption', setImageCaption)} as="textarea" rows={1} style={{ resize: 'none', border: '1px black solid' }} />
                            </Form.Group>
                        </Form>
                        <Form>
                            <Form.Label className="form-label" id="customFile" aria-required><h2 className='smallFont metropolisRegular'>Link</h2></Form.Label>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Control value={link} onChange={(e) => handleTextAreaChange(e, '/link', setLink)} as="textarea" rows={1} style={{ resize: 'none', border: '1px black solid' }} />
                            </Form.Group>
                        </Form>
                    </Row>
                </Container>
            </Container>
        </div >
    )
}

export default EditableEventComponent
