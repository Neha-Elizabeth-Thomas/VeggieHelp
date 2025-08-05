
import { Routes ,Route} from 'react-router-dom'
import BuyerRegister from './pages/BuyerRegister'
import BuyerAlerts from './pages/BuyerAlerts'
import Navbar from './components/Navbar'




function App() {
  
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<BuyerRegister/>}/>
        <Route path='/alerts' element={<BuyerAlerts/>}/>
      </Routes>
    </div>
  )
}

export default App
