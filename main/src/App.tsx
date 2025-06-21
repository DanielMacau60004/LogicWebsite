import NDProofsPage from "./pages/NDProofsPage";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import NDMainPage from "./pages/NDMainPage";

import "./style/global.scss"
import "./style/variables.scss"

function App() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<NDMainPage/>}/>
                <Route path="/exercise" element={<NDProofsPage/>}/>
            </Routes>
        </Router>

    )
}

export default App;