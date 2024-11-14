import './styles/App.css';
import Home from './pages/Home';
import { Route, Routes } from 'react-router-dom';
import About from './pages/About';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Homeuser from './pages/Homeuser';
import Newchat from './pages/Newchat';

function App() {
  return (
    <div className="App">
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/about' element={<About/>}></Route>
          <Route path='/signup' element={<SignUp/>}></Route>
          <Route path='/signin' element={<SignIn/>}></Route>
          <Route path='/homeuser' element={<Homeuser/>}></Route>
          <Route path='/newchat' element={<Newchat/>}></Route>
        </Routes>
    </div>
  );
}

export default App;
