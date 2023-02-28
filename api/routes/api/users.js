const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../model/user");
const gravatar = require("gravatar");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

//@route  POST api/user
//@desc   TEST route
//@acess  public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be more than 6 letter").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // how to get email by=> findOne(email)
    // req.body.email when i make request and send data i can get the data by req.body
    const { name, email, password } = req.body;
    //check user exists with email
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(500)
          .json({ errors: [{ msg: "user already exists" }] });
      }
      //using gravatar with email
      const avatar = gravatar.url(email, {
        s: "200", //default size
        r: "pg", //prevent from bad image
        d: "mm",
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });
      //encrypt password with bycrypt
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      //save to mongoose
    const result=   await user.save();
      //return jwt jsonWebToken
      const payload = {
        _id: user._id,
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).send("server error");
    }
  }
);



module.exports = router;
