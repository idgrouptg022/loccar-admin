import { Route, Routes } from 'react-router-dom'
import './App.css'
import SignInSide from './Components/Authentication/SignIn'
import ForgottenPassword from './Components/Authentication/ForgottenPassword'
import ConfirmationCode from './Components/Authentication/ConfirmationCode'
import NewPassword from './Components/Authentication/NewPassword'
import Home from './Components/Home'
import SignOut from './Components/SignOut'

function App() {
    return (
        <Routes>
            <Route path='/' element={<SignInSide />} />
            <Route path='/sign-in' element={<SignInSide />} />
            <Route path='/forgotten-password' element={<ForgottenPassword />} />
            <Route path='/confirmation-code' element={<ConfirmationCode />} />
            <Route path='/new-password' element={<NewPassword />} />
            <Route path='/sign-out' element={<SignOut />} />

            
            <Route path='admins/:page' element={<Home />} />
            <Route path='admins/' element={<Home />} />
        </Routes>
    )
}

export default App;
