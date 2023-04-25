import React, { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Analytics from './pages/Dashboard/Analytics'
import Calendar from './pages/Calendar'
import Profile from './pages/Profile'
import FormElements from './pages/Form/FormElements'
import FormLayout from './pages/Form/FormLayout'
import Tables from './pages/Tables'
import Settings from './pages/Settings'
import Chart from './pages/Chart'
import Alerts from './pages/UiElements/Alerts'
import Buttons from './pages/UiElements/Buttons'
import SignIn from './pages/Authentication/SignIn'
import SignUp from './pages/Authentication/SignUp'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { initToken } from './app/reducer/user/userReducer'
// import PrivateRoute from './router/PrivateRole'
import { ROLE_TYPE } from './constance/roleType'
import UserManagement from './pages/Administrator/User/Index'
import GroupMenu from './pages/Administrator/Permission/GroupMenu/Index'
import Notfound from './pages/Exceptions/Notfound'
import Forbidden from './pages/Exceptions/Forbidden'
const App = () => {
  const [loading, setLoading] = useState(true)
  const preloader = document.getElementById('preloader')


  if (preloader) {
    setTimeout(() => {
      preloader.style.display = 'none'
      setLoading(false)
    }, 2000);
  }
  const userInfo = useSelector(state => state.user.user);
  const auth = useSelector(state => state.user.auth)
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initToken());
    setTimeout(() => setLoading(false), 1000)
    // dispatch(initToken());

  }, [])
  // console.log('====================================');
  // console.log(userInfo);
  // console.log('====================================');
  return (
    !loading && (
      <>
        <ToastContainer />
        <Routes>
          <Route exact path='/' element={<Analytics />} />
          <Route path='/calendar' element={<Calendar />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/forms/form-elements' element={<FormElements />} />
          <Route path='/forms/form-layout' element={<FormLayout />} />
          <Route path='/tables' element={<Tables />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/chart' element={<Chart />} />
          <Route path='/ui/alerts' element={<Alerts />} />
          <Route path='/ui/buttons' element={<Buttons />} />
          <Route path='/auth/signin' element={<SignIn />} />
          <Route path='/auth/signup' element={<SignUp />} />
          {/* <PrivateRoute path="/admin/" element={<Analytics />} roles={userInfo.roles} role={ROLE_TYPE.Administrator} /> */}
          <Route path='/admin/' element={<ProtectedRoute auth={auth} children={< Analytics />} roles={userInfo?.roles} role={ROLE_TYPE.Administrator} />} />
          <Route path='/admin/users' element={<ProtectedRoute auth={auth} children={< UserManagement />} roles={userInfo?.roles} role={ROLE_TYPE.Administrator} />} />
          <Route path='/QuanTri/Quyen' element={<ProtectedRoute auth={auth} children={< GroupMenu />} roles={userInfo?.roles} role={ROLE_TYPE.Administrator} />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </>
    )
  )
}

export default App;


const ProtectedRoute = ({ auth, children, roles, role = "SuperAdmin" }) => {
  // console.log(roles, auth);
  if (!auth) {
    return <Navigate to="/auth/signin" replace />;
  }

  if (!roles.includes(role)) {

    return <Forbidden />
  }

  return children;
};