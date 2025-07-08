import Sidebar from './Sidebar';
import Navbar from './Navbar';
import View from './View';
import Login from './Login';

const AuthLayout = () => {
    const token = sessionStorage.getItem("Token");
  return (
    <>
    {
        token ? 
        <div className="d-flex w-100">  
            <Sidebar/>
            <div className='w-100'>
                <Navbar/>
                <View/>
            </div>
        </div>

        :
        <Login />
    }

    </>
  )
}

export default AuthLayout