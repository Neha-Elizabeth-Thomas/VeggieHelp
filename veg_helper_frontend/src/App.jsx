
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import AddListing from './pages/AddListing'
import Dashboard from './pages/Dashboard'
import RegisterFarmer from './pages/RegisterFarmer'

function App() {
  
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/add-listing' element={<AddListing/>}/>
        <Route path='/register' element={<RegisterFarmer/>}/>
      </Routes>
    </div>
  )
}

export default App
