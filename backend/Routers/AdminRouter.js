const AdminController=require('../Controllers/AdminController')
const express = require("express");
const router = express.Router();


router.post('/adminlogin',AdminController.adlogin)
router.get('/fetchallusers',AdminController.fetchAlluser)
router.post('/logout',AdminController.logout)
router.post('/adduser',AdminController.AddUser)
router.delete('/deleteuser',AdminController.deleteUser)
router.put('/updateuser/:id',AdminController.editUser)

module.exports=router