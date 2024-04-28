const userController=require('../Controllers/UserController')
const verfiyToken=require('../Middlewares/userAuth')
const express = require("express");
const router = express.Router();



router.post('/signup',userController.signUp)
router.post('/login',userController.login)
router.get('/fetchUserdata',userController.fetchUserdata)
router.post('/editprofile',userController.editUser)
router.post('/logout',userController.logout)



module.exports=router