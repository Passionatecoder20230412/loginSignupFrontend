   const User = require('../models/User'); // Ensure this line is present // This line should be corrected
   const bcrypt = require('bcrypt');
   const jwt = require('jsonwebtoken');
      
   console.log('User  model:', User); // Check if User is defined
   
   const signup = async (req, res) => {
     try {
       const { name, email, password } = req.body;
       console.log('Received signup request:', { name, email, password }); // Log the request data

       const existingUser  = await User.findOne({ where: { email } });
       if (existingUser ) {
         return res.status(400).json({ error: 'Email already exists' });
       }

       const otp = Math.floor(1000 + Math.random() * 9000).toString();
       const hashedPassword = await bcrypt.hash(password, 10);

       await User.create({
         name,
         email,
         password: hashedPassword,
         otp
       });

       res.json({ 
         success: true,
         message: 'OTP generated for verification',
         otp
       });

     } catch (error) {
       console.error('Signup error:', error); // Log the error
       res.status(500).json({ error: 'Server error' });
     }
   };

   const verifyOtp = async (req, res) => {
     try {
       const { email, otp } = req.body;
       const user = await User.findOne({ where: { email } });

       if (!user || user.otp !== otp) {
         return res.status(400).json({ error: 'Invalid OTP' });
       }

       await user.update({ 
         is_verified: true,
         otp: null 
       });

       res.json({ 
         success: true,
         message: 'Account verified successfully'
       });

     } catch (error) {
       console.error('OTP error:', error);
       res.status(500).json({ error: 'Server error' });
     }
   };

   const login = async (req, res) => {
     try {
       const { email, password } = req.body;
       const user = await User.findOne({ where: { email } });

       if (!user) {
         return res.status(400).json({ error: 'Invalid credentials' });
       }

       if (!user.is_verified) {
         return res.status(403).json({ error: 'Please verify your account first' });
       }

       const isMatch = await bcrypt.compare(password, user.password);
       if (!isMatch) {
         return res.status(400).json({ error: 'Invalid credentials' });
       }

       const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
         expiresIn: '1h'
       });

       res.json({
         success: true,
         message: 'Login successful',
         token,
         user: {
           id: user.id,
           name: user.name,
           email: user.email
         }
       });

     } catch (error) {
       console.error('Login error:', error);
       res.status(500).json({ error: 'Server error' });
     }
   };

   module.exports = { signup, verifyOtp, login };
   