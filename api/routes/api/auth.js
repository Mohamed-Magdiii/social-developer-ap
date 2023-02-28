const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../model/user");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("config");


//@route  GET api/auth
//@desc   User 
//@acess  Private
router.get('/', auth, async (req , res)=>{
try {
     const user = await User.findById(req.user.id).select('-password');
     res.json(user);
    } catch (err) {
    console.error(err.message);
     res.status(500).send('Server Error') ;
    }
});

//@route  POST api/auth
//@desc   Auth
//@acess  Private
router.post(
  '/',
  [
    check("email", "please enter valid email").isEmail(),
    check("password", "please enter valid password").exists(),
  ],
  async (req, res) => {
    //check for Valid email and password
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
     return res.status(401).json({ errors: errors.array() });
    }
    //check for user credentials exists in db
    //1- get user input from body
    const { email , password } = req.body;
    try {
      //2-get user by email
      let user = await User.findOne({ email });
      console.log((user))
      if (!user) {

      return  res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
      }
      //3- compare the password to check if matching
      const isMatching =await bcrypt.compare(password , user.password);
      if (!isMatching) {
       return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
      }
      const payload = {
        id: user.id,
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },

        (err, token) => {
          if (!token) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      res.status(400).send("Server Error");
    }
  }
);
//Delete  user by id 
router.delete('/' , auth ,async (req,res)=>{
  try {
      const user = await User.findByIdAndRemove({_id:req.user.id})
      res.json({msg:"user Deleted"})

  } catch (error) {
    res.status(500).send("Server Error")
  }
})


module.exports = router;
