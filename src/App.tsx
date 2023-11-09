import { useState, createContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import FireBaseApp from "./firebase";
import Home from "./pages/index";
import FacultyDirectory from "./pages/facultyDirectoryPage";
import EditPage from './pages/EditPage';
import Dashboard from "./pages/dashboard";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import "./App.css";

// Authentication context
const auth = getAuth(FireBaseApp);

// Realtime Database context
const db = getDatabase(FireBaseApp);

export const AuthContext = createContext(null);

// Add routing
// https://www.geeksforgeeks.org/how-to-create-a-multi-page-website-using-react-js/#
function App() {
  const [uid, setUid] = useState(null);

  onAuthStateChanged(auth, function (result) {
    if (result) {

      if (uid) //Debounce if uid already is exists.
        return;
      // Check that user is within the whitelist
      const userRef = ref(db, `users/${result.uid}`);

      // Update uid if snapshot is retrieved from DB (user is on whitelist)
      onValue(userRef, (snapshot) => {
        if (snapshot) {
          setUid(result.uid);
        }

      });
    } else {
      setUid(null);
      signOut(auth).then(() => {
        // console.log(`Sign-out successful. Generate a toast`);
      }).catch((error) => {
        // console.error('An error happened. Cenerate a toast');
      });
    }
  });

  return (
    <AuthContext.Provider value={uid}>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/faculty" element={<FacultyDirectory />} />
          <Route path='/edit' element={<EditPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <Footer />
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
