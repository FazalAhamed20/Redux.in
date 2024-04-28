import React, { useState } from "react";
import "../signup/Signup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import avatar from "../../assets/profile.png";

import { toast } from "react-toastify";
import { Link } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

 
  const navigate = useNavigate();
  const onUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif']; 
      if (!validImageTypes.includes(uploadedFile.type)) {
      
        toast.error('Invalid image format. Please select a JPEG, PNG, or GIF image.');
        return;
      }
      setFile(uploadedFile);
    }
  };
  
  const submit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


   
    setLoading(true)
    if(!username){
      setLoading(false)
      toast.error('Please enter the username')
      return
    }
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
    if(username.length<3 || username.includes(' ')){
      setLoading(false)
      toast.error('Please enter a valid username')
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
    if (/\s/.test(password)) {
      setLoading(false);
      toast.error("Password should not contain spaces");
      return;
    }
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setLoading(false);
      toast.error("Password should contain at least one uppercase letter, one lowercase letter, and one digit");
      return;
    }
    
  


    try {
      let imageUrl = "";
      if(file){
      const imageData = new FormData();
      imageData.append("file", file);
      imageData.append("upload_preset", "upload");
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dlitqiyia/image/upload",
        imageData,
        { withCredentials: false }
      );

       imageUrl = res.data.url;
    }
      const formData = {
        username: username,
        email: email,
        password: password,
        image: imageUrl
      };
      const response = await axios.post("http://localhost:4000/signup", formData, { withCredentials: true });

      if (response.status === 200) {
       
        navigate("/");
        toast.success('Signed Up Successfully')
      }
    } catch (error) {
      toast.error(error.response.data);
    }
  };


  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-xs">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={submit}>
          <div className="profile flex justify-center py-4">
            <label htmlFor="profile">
              <img src={file ? URL.createObjectURL(file) : avatar} className="profile_img" alt="avatar" />
            </label>
            <input onChange={onUpload} type="file" id="profile" name="file"  accept="image/*"/>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              value={username}
              placeholder="Username"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              value={email}
              type="email"
              placeholder="Email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              value={password}
              type="password"
              placeholder="******************"
            />
          </div>
        
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className="text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-500 hover:underline">Sign In</Link>
      </div>
      </div>
    </div>
  );
}

export default Signup;
