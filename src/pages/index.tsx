import { Row, Col, Button, Container } from 'react-bootstrap';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmDraftModal from '../components/ConfirmDraftModal';
import { UserContext } from '../App';
import { parseDataToComponents } from '../utils/parseAndRenderComponents';
import { handleEditButtonClick, createNewDraft } from '../utils/createNewDraft';
import Header from '../components/Header';
import useToastContext from '../components/toasts/useToastContext';

// The home page shows users the projectlist and events carousel 
const Home = () => {
    const addToast = useToastContext();
    const [renderedComponents, setRenderedComponents] = useState<JSX.Element[]>([]);
    const [showDraftModal, setShowDraftModal] = useState<boolean>(false);
    const [snapShot, setSnapshot] = useState<object>({});
    const db = getDatabase();

    // https://reactnavigation.org/docs/use-navigation/#:~:text=useNavigation%20is%20a%20hook%20which,of%20a%20deeply%20nested%20child.
    const navigate = useNavigate();
    const user = useContext(UserContext);


    // Gets all of the components in the homepage
    // https://firebase.google.com/docs/database/web/read-and-write
    useEffect(() => {
        const projects = ref(db, 'pages/homepage/components');

        // Stores a listener for the database in a useState variable
        onValue(projects, (snapshot) => {
            setSnapshot(snapshot.val());
        });

    }, []);

    // Calls function that parses database information so it can be converted into project list and event carousel components
    useEffect(() => {
        parseDataToComponents(snapShot, setRenderedComponents);
    }, [snapShot]);

    //  Wrapper function for handling the create new draft
    const createNewDraftWrapper = (makeNewDraft: boolean) => {
        createNewDraft(makeNewDraft, db, snapShot, navigate, `drafts/${user.id}/homepage/components`, addToast);
    };

    return (
        <div>
            {/* If the user has already decided to edit and the user isnt null */}
            {showDraftModal && user !== null &&
                <ConfirmDraftModal show={showDraftModal}
                    onHide={() => setShowDraftModal(false)}
                    onCreateDraft={(value) => createNewDraftWrapper(value)}
                    name={user.name} />
            }
            <Header img={'src/imgs/OBCenter.jpg'} title='Faculty Led Projects' />
            {renderedComponents}
        </div>
    );
};

export default Home;
