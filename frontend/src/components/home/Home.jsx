import React, { useEffect } from 'react'
import '../home/Home.css'
import { useSelector,useDispatch } from 'react-redux';
import { fetchData } from '../../../redux/Slice/UserSlice';


function Home() {
  
  const userData = useSelector((state) => state.user.userData);
  const  loading=useSelector((state)=>state.user.loading)
  const error=useSelector((state)=>state.user.error)
  console.log("user",userData);
  const dispatch=useDispatch()
  useEffect(()=>{
    dispatch(fetchData())

  },[dispatch])

  
   


    
  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="max-w-4xl px-8 py-12 bg-white shadow-xl rounded-lg">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Welcome to the Home page!</h1>
      <p className="text-lg text-gray-700 mb-8">
       
       {
        userData ? <p> <h1>Welcome Home</h1> {userData.username}</p> : <h1>Please Signup or Login</h1>
       }
      </p>
    </div>
  </div>
);

}

export default Home
