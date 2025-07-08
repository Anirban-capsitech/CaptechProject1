import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate }  from "react-router-dom"
import Login from './Components/Login'
import ProtectedRoute from './Components/ProtectedRoute'
import Dashboard from './Components/Dashboard'
import SignUp from './Components/SignUp'
import View from './Components/View'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace/>} />
        <Route path='/login' element={<Login/>} />
        <Route path="/signup"element={<SignUp/>} />
        <Route element={<ProtectedRoute/>} >
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
