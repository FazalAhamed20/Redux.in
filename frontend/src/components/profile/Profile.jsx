import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchData } from '../../../redux/Slice/UserSlice';
import axios from 'axios';
import avatar from "../../assets/profile.png";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom'; 


function Profile() {
  const userData = useSelector((state) => state.user.userData);
  const loading=useSelector((state)=>state.user.loading);
  const error=useSelector((state)=>state.user.error)
  const dispatch = useDispatch();
    const [showEditModal, setShowEditModal] = useState(false);

    const [newUsername, setNewUsername] = useState('');
    const [newProfileImage, setNewProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

   useEffect(()=>{
    dispatch(fetchData())

   },[dispatch])

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges =async (e) => {
      e.preventDefault()
      try {
        let imageUrl = "";
      if(newProfileImage){
      const imageData = new FormData();
      imageData.append("file", newProfileImage);
      imageData.append("upload_preset", "upload");
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dlitqiyia/image/upload",
        imageData,
        { withCredentials: false }
      );

       imageUrl = res.data.url;
    }
    
    const formData={
      userId: userData._id,
      username:newUsername ||userData.username,
      image: imageUrl || userData.profile
    }
    const response = await axios.post("http://localhost:4000/editprofile", formData, { withCredentials: true });
    if (response.status === 200) {
     dispatch(fetchData())
      
      toast.success('Updated Successfully')
    }
        
      } catch (error) {
        
      }
   
        setShowEditModal(false);
    };

    const handleCancel = () => {
     
        setShowEditModal(false);
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-md overflow-hidden flex flex-col mt-20">
            <div className="flex items-center justify-center bg-gray-200 h-40">
                <img className="h-32 w-32 rounded-full" src={userData?.profile || avatar} alt="Profile" />
            </div>
            <div className="flex-grow px-4 py-5 sm:px-6 flex flex-col justify-center">
                <h3 className="text-lg font-medium leading-6 text-gray-900">{userData?.username}</h3>
                <Link
                    to="#"
                    onClick={() => setShowEditModal(true)}
                    className="text-blue-500 mt-2 hover:underline"
                >
                    Edit Profile
                </Link>
            </div>
            <div className="border-t border-gray-200">
                <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{userData?.email}</dd>
                    </div>
                </dl>
            </div>

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div
                            className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
                            role="dialog" aria-modal="true" aria-labelledby="modal-headline"
                        >
                            <div>
                                <h2 className="text-lg font-medium leading-6 text-gray-900">Edit Profile</h2>
                                <div className="mt-2">
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        
                                        id="username"
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        value={newUsername ||userData.username}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                    />
                                </div>
                                <div className="mt-2">
                                <label htmlFor="profileImage" className="bg-red block text-sm font-medium text-gray-700 border border-gray-300 rounded-md p-2">
    Choose Profile Image
</label>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        name="profileImage"
                                        id="profileImage"
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        onChange={handleImageChange}
                                    />
                                    {imagePreview && (
                                        <img src={imagePreview} alt="Profile Preview" className="mt-2 h-20 w-auto rounded-md" />
                                    )}
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between">
                                <button
                                    type="button"
                                    className="inline-flex justify-center w-1/2 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex justify-center w-1/2 rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                    onClick={handleSaveChanges}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;
