import React, { useState } from 'react';
import '../login/Login.css';
import { toast } from "react-toastify";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import  {Link} from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate=useNavigate()
  

  const Submit = async (e) => {
    e.preventDefault(); 
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!email){
      setLoading(false)
      toast.error('Please enter the email')
      return

    }
    if(!password){
      setLoading(false)
      toast.error('Please enter the password')
      return

    }
    if(!emailRegex.test(email)){
      setLoading(false)
      toast.error('Please enter a valid email')
      return

    }
    if (password.length < 6) {
      setLoading(false);
      toast.warning("Password must be at least 6 characters long");
      return;
    }
    
    
    try {
      const response = await axios.post('http://localhost:4000/login', {
        email, password
      }, { withCredentials: true });

      if (response.status === 200) {
       
        navigate("/",{ replace: true });
        toast.success('Loged In Successfully')
      }
      
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-xs">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={Submit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input onChange={(e) => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Email"/>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input onChange={(e) => setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************"/>
          </div>
         
          <div className="flex items-center justify-between">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Sign In
            </button>
            
          </div>
        </form>
        <div className="text-center">
        Dont have an account?{' '}
        <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
      </div>
      </div>
    </div>
  );
}

export default Login;
