// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import SidebarMenu from './components/SidebarMenu';
// import { useUser } from '@clerk/clerk-react';


// function App() {
//   const {user} = useUser();
//   console.log('====================================');
//   console.log(user?.firstName,"user");
//   console.log('====================================');
 

//   return (
//     <>
//         <SidebarMenu />
//       <ToastContainer />
//     </>
//   );
// }

// export default App;


import {  Route, Routes, useNavigate } from 'react-router-dom';
import SidebarMenu from './components/SidebarMenu';
import { ToastContainer } from 'react-toastify';
import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';

const App = () => {
  const {user,isLoaded} = useUser()
  const navigate = useNavigate();


  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      navigate('/sign-in');
    } else {
      navigate('/dashboard');
    }
  }, [isLoaded, user]);
  return (
    <>
      <SidebarMenu />
      <ToastContainer />
      <Routes>
           <Route path="/dashboard"  />
        <Route path="/todays-added-books" />
          <Route path="/comming-soon" />
        <Route path='/sign-in' />
      </Routes>
         </>
  );
};

export default App;

