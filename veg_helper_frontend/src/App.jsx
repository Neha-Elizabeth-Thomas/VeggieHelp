
import { Routes ,Route} from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar'
import AddListing from './pages/AddListing'
import BuyerRegister from './pages/BuyerRegister'
import BuyerAlerts from './pages/BuyerAlerts'

function App() {
  
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/add-listing' element={<AddListing/>}/>
        <Route path='/buyers' element={<BuyerRegister/>}/>
        <Route path='/alerts' element={<BuyerAlerts/>}/>
      </Routes>
    </div>
  )
}

export default App
