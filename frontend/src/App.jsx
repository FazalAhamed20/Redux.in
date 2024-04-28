import React,{useEffect} from 'react'

import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import Homepage from './pages/Homepage'
import Profilepage from './pages/Profilepage'
import Adminlogpage from './pages/Adminlogpage'
import Admindashboardpage from './pages/Admindashboardpage'

import axios from 'axios'

axios.defaults.withCredentials=true;
function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Homepage/>} />
          <Route path='/signup' element={<SignupPage/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/profile' element={<Profilepage/>}/>
          <Route path='/admin' element={<Adminlogpage/>}/>
          <Route path='/admindashboard' element={<Admindashboardpage/>}/>
        </Routes>
      </Router>
      
    </div>
  )
}

export default App
