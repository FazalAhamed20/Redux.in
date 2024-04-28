const jwt=require('jsonwebtoken')
require('dotenv').config()
const User=require('../Models/userModel')
const bycrypt=require('bcrypt')


const signUp = async (req, res) => {
    try {
        const { username, email, password, image } = req.body;

        const hashedPassword = await bycrypt.hash(password || '', 10);
        const findEmail = await User.findOne({ email });

        if (findEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }
        
        const user = new User({
            username: username,
            email: email,
            password: hashedPassword,
            profile: image
        });

        const savedUser = await user.save();
        console.log(savedUser);
        

        const token = jwt.sign({
            user: savedUser._id
        }, process.env.ACCESS_TOKEN, { expiresIn: '1h' });

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
        }).json({ success: true });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

const login=async (req,res)=>{
    try {
        console.log(req.body);
     const email=req.body.email

     const user_id=req.body._id
     
     console.log(email);
     const user=await User.findOne({email})
     console.log(user);
     if(!user){
        return res.status(400).json('user not foud')
     }

     const correctPassword=await bycrypt.compare(req.body.password,user.password)
     if(!correctPassword){
        return res.status(400).json('password incorrect')
     }
     const token = jwt.sign({
        user: user._id
    }, process.env.ACCESS_TOKEN);

    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
    }).json({ success: true });
    console.log(res.cookie.token);


        
    } catch (error) {
        
        console.log(error.message);
    }

}
const editUser = async (req, res) => {
    console.log(req.body);
    try {
        const { userId, username, image } = req.body;
        
      
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json('User not found');
        }

        
        user.username = username;
        user.profile= image; 

        await user.save();

        res.status(200).json('User profile updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal server error');
    }
}


const logout = async (req, res) => {
    try {
       
        res.clearCookie("token").json({ success: true });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}






const fetchUserdata=async(req,res)=>{
    try {

        const token = req.cookies.token
        console.log('token',token);
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN);
        console.log('verified',verified);
        const data = await User.findOne({ _id: verified.user })
        console.log("data",data);
        res.json(data)
        
    } catch (error) {
        console.log('fetch',error.message);
        
    }
}
module.exports={
    signUp,fetchUserdata,login,logout,editUser
}