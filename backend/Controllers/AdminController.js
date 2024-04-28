    require('dotenv').config()
    const jwt=require('jsonwebtoken')
    const User = require('../Models/userModel');
    const bycrypt=require('bcrypt')

    const adlogin=async(req,res)=>{
        try {
            console.log(req.body);
            const {email,password}=req.body
            if(email!=process.env.ADMIN_EMAIL ){
                return res.status(400).json('email incorrect')
                
            }
            if(password!=process.env.ADMIN_PASSWORD ){
                return res.status(400).json('Password incorrect')
                
            }
            const token = jwt.sign(email, process.env.ACCESS_TOKEN);
        
                res.cookie("token", token, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24,
                }).json({ success: true });
        
            
        } catch (error) {
            console.log(error.message);
            
        }

    }
    const AddUser=async(req,res)=>{
        try {
            console.log("Adduser",req.body);
            const { username, email, password, profile } = req.body;

            const hashedPassword = await bycrypt.hash(password || '', 10);
            const findEmail = await User.findOne({ email });

            if (findEmail) {
                return res.status(400).json({ error: "Email already exists" });
            }
            
            const user = new User({
                username: username,
                email: email,
                password: hashedPassword,
                profile: profile
            });

            const savedUser = await user.save();
            return res.status(200).json({ message: 'New user added', user: savedUser });

        } catch (error) {
            console.log(error.message);
            
        }

    }
    const deleteUser = async (req, res) => {
        console.log("id",req.body);
        try {
            const user_id = req.body.id;
            console.log(user_id);
            await User.findByIdAndDelete(user_id);
        
            res.json({ success: true });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ success: false, message: "Error deleting user" });
        }
    };
    const editUser = async (req, res) => {
        try {
            console.log("edited user",req.body);
            
            const { id, username,profile } = req.body;
          
            const user = await User.findById(id);
            
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            
           
            user.username = username;
            user.email = email;
    
       
            await user.save();
    
           
            res.status(200).json({ message: "User updated successfully", user: user });
        } catch (error) {
            console.error("Error updating user:", error.message);
            res.status(500).json({ message: "Internal server error" });
        }
    };
    

    const logout = async (req, res) => {
        try {
        
            res.clearCookie("token").json({ success: true });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }

    const fetchAlluser=async (req,res)=>{
        try {
            const data = await User.find();
       
            res.json({ data: data });
            
            
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: 'Internal Server Error' });
            
        }

    }

    module.exports={
        adlogin,
        fetchAlluser,
        logout,
        AddUser,
        deleteUser,
        editUser
    }