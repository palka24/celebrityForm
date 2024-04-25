import './stylesheet.css';
import Home from './Home'; 
import ListView from './listview'; 
import NavBar from './NavBar';
import {Route, Routes} from 'react-router-dom';

function App() {

  return (
      <div>
        <NavBar/>
        <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/listview" element={<ListView />} />
        </Routes>
        </div>
      </div>

  );
}

export default App;
