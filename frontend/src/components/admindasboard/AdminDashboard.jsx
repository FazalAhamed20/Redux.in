import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAdminData } from '../../../redux/Slice/AdminSlice';
import axios from 'axios';
import Modal from 'react-modal';
import avatar from '../../assets/profile.png'
import { toast } from "react-toastify";

function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [load, setLoad] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false); 
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    username: '',
    email: '',
    password:'',
    profile:''
  
  });
  const [editedUserData, setEditedUserData] = useState({
  
    username: '',
    email: '',
    profile:''
    // Add more fields as needed
  });
  console.log("editedUserData",editedUserData);
  const [file, setFile] = useState(null);
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

  const adminData = useSelector((state) => state.admin.adminData) || [];
  const loading = useSelector(state => state.admin.loading);
  const error = useSelector(state => state.admin.error);
  const dispatch = useDispatch();

  const memoizedFetchAdminData = useCallback(() => {
    dispatch(fetchAdminData());
  }, [dispatch]);

  useEffect(() => {
    memoizedFetchAdminData();
  }, [memoizedFetchAdminData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const filteredUsers = adminData.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteUser = (id) => {
    setSelectedUserId(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    try {
      const response = await axios.delete('http://localhost:4000/deleteuser', {
        data: { id: selectedUserId }
      });
      if (response.data.success)
        dispatch(fetchAdminData());
      setShowDeleteModal(false);
    
      toast.success('Deleted Successfully')
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const cancelDeleteUser = () => {
    setSelectedUserId(null);
    setShowDeleteModal(false);
  };

  const addUser = () => {
    setShowAddUserModal(true);
  };
  const addUserModel=()=>{
    setShowAddUserModal(false)
    setNewUserData({})
      setFile(null)
  }

  const handleAddUser = async (e) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


   
    setLoad(true)
    if(!newUserData.username){
      setLoad(false)
      toast.error('Please enter the username')
      return
    }
    if(!newUserData.email){
      setLoad(false)
      toast.error('Please enter the email')
      return

    }
    if(!newUserData.password){
      setLoad(false)
      toast.error('Please enter the password')
      return

    }
    if(newUserData.username.length<3 || newUserData.username.includes(' ')){
      setLoad(false)
      toast.error('Please enter a valid username')
      return

    }
    if(!emailRegex.test(newUserData.email)){
      setLoad(false)
      toast.error('Please enter a valid email')
      return

    }
    if (newUserData.password.length < 6) {
      setLoad(false);
      toast.warning("Password must be at least 6 characters long");
      return;
    }
    if (/\s/.test(newUserData.password)) {
      setLoad(false);
      toast.error("Password should not contain spaces");
      return;
    }
    if (!/[a-z]/.test(newUserData.password) || !/[A-Z]/.test(newUserData.password) || !/[0-9]/.test(newUserData.password)) {
      setLoad(false);
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
    const userData = {
      ...newUserData,
      profile: imageUrl
    };
     const response= await axios.post('http://localhost:4000/adduser',userData)
     console.log(response.data);
     if(response.status==200){
      setShowAddUserModal(false);
      dispatch(fetchAdminData());
      setNewUserData({})
      setFile(null)
      toast.success("User added successfully")

     }
      
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.error) {
        toast.error(error.response.data.error);
    }
    }
  };
 
const editUser = (user) => {
  console.log(user);
  setEditedUserData({
    id:user._id,
    username: user.username,
    profile: user.profile 
  });
  setShowEditUserModal(true);
};

  const handleEditUser=async (e)=>{
    e.preventDefault()
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
    if(!imageUrl){
      imageUrl=editedUserData.profile
    }
    const userData = {
      ...editedUserData,
      profile: imageUrl
    };
    const response= await axios.put(`http://localhost:4000/updateuser/${editedUserData.id}`,userData)
    console.log(response.data);
    if(response.status==200){
     
     toast.success("User added successfully")

    }
      
    } catch (error) {
      
    }
    
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      <input
        type="text"
        placeholder="Search users..."
        className="border border-gray-300 rounded-md px-4 py-2 mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div>
        <button className="bg-green-500 text-white px-4 py-2 mt-4 mb-4" onClick={addUser}>Add User</button>
      </div>

      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Profile</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td className="border border-gray-300 px-4 py-2">
                <img
                  src={user.profile ? user.profile : avatar}
                  alt="Profile"
                  className="w-10 h-10 rounded-full" 
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">{user.username}</td>
              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button className="bg-blue-500 text-white px-2 py-1 mr-2" onClick={()=>editUser(user)}>Edit</button>
                <button className="bg-red-500 text-white px-2 py-1" onClick={() => deleteUser(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onRequestClose={cancelDeleteUser}
        contentLabel="Confirmation Modal"
        className="fixed z-50 inset-0 overflow-y-auto"
        overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="text-center">
              <p className="text-gray-800 text-lg font-medium mb-4">
                Are you sure you want to delete this user?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
                  onClick={cancelDeleteUser}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
                  onClick={confirmDeleteUser}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Add User Modal */}
      <Modal
        isOpen={showAddUserModal}
        onRequestClose={() => setShowAddUserModal(false)}
        contentLabel="Add User Modal"
        className="fixed z-50 inset-0 overflow-y-auto"
        overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Add User</h2>
            <form onSubmit={handleAddUser}>
            <div className="profile flex justify-center py-4">
            <label htmlFor="profile">
              <img src={file ? URL.createObjectURL(file) : avatar} className="profile_img" alt="avatar" />
            </label>
            <input onChange={onUpload} type="file" id="profile" name="file"  accept="image/*"/>
          </div>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  id="username"
                  className="border border-gray-300 rounded-md px-4 py-2 w-full"
                  value={newUserData.username}
                  onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  className="border border-gray-300 rounded-md px-4 py-2 w-full"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  className="border border-gray-300 rounded-md px-4 py-2 w-full"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                  required
                />
              </div>
              {/* Add more input fields for additional user data */}
              <div className="flex justify-end">
                <button type="button" className="bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded mr-2" onClick={addUserModel}>Cancel</button>
                <button onClick={handleAddUser} type="submit" className="bg-green-500 text-white font-medium py-2 px-4 rounded">Add User</button>
              </div>
            </form>
          </div>
        </div>
      </Modal>

      {/* Edit User Modal */}
<Modal isOpen={showEditUserModal} onRequestClose={() => setShowEditUserModal(false)} contentLabel="Edit User Modal" className="fixed z-50 inset-0 overflow-y-auto" overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
  <div className="flex items-center justify-center min-h-screen">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 className="text-lg font-bold mb-4">Edit User</h2>
      <form onSubmit={handleEditUser}>
        <div className="profile flex justify-center py-4">
          <label htmlFor="profile">
            <img src={file ? URL.createObjectURL(file) : editedUserData.profile} className="profile_img" alt="avatar" />
          </label>
          <input onChange={onUpload} type="file" id="profile" name="file" accept="image/*" />
        </div>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <input type="text" id="username" className="border border-gray-300 rounded-md px-4 py-2 w-full" value={editedUserData.username} onChange={(e) => setEditedUserData({ ...editedUserData, username: e.target.value })} required />
        </div>
        
        <div className="flex justify-end">
          <button type="button" className="bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded mr-2" onClick={() => setShowEditUserModal(false)}>Cancel</button>
          <button type="submit" className="bg-blue-500 text-white font-medium py-2 px-4 rounded" >Save</button>
        </div>
      </form>
    </div>
  </div>
</Modal>
    </div>
  );
}

export default AdminDashboard;
