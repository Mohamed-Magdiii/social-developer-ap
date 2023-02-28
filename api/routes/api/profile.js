/** @format */

const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../model/profile");
const { check, validationResult } = require("express-validator");
const User = require("../../model/user");
const request = require("request");
const config = require("config");
const Post = require("../../model/post");
const { json } = require("body-parser");

//@route    GET api/profile/me
//@desc     GET current user profile
//@acess    private

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    console.log("Hello");
    console.log(profile);
    if (!profile) {
      return res.status(400).json({ msg: "there is no profile for this user" });
    }
    res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(401).send("Server Error");
  }
});

//@route    POST api/profile/
//@desc     create and update profile
//@acess    private

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status field is required").not().isEmpty(),
      check("skills", "Skills field is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //create req.body to get variables from body
    const {
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
      youtube,
      facebook,
      twitter,
      linkedin,
      instagram,
    } = req.body;

    //object to create the data model
    const profileFields = {};

    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (location) profileFields.location = location;
    if (website) profileFields.website = website;
    if (status) profileFields.status = status;
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.toString().split(',').map(skill => skill.trim());
    }
    console.log(profileFields);

    //create object for social
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //update profile if it found
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      //create new profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.log(error.message);
      res.status(401).send("Server Error");
    }
  }
);

//@route    GET api/profile/
//@desc     get all profiles
//@acess    public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});
//@route    GET api/profile/user
//@desc     get all profiles
//@acess    public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(401).json({ msg: "there is no profile for this user" });
    }
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});
//@route      DELETE api/profile
//@desc       Delete profile
//@acess    public

router.delete("/", auth, async (req, res) => {
  try {
    //Remove Posts
    await Post.deleteMany({user:req.user.id})
    //Remove Profile
      await Profile.findOneAndRemove({ user: req.user.id });
    //Remove User
    await User.findOneAndRemove({_id:req.user.id})
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});
//@route      PUT api/profile/experience
//@desc       Add profile experience
//@acess    private

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(401).json({ errors: errors.array() });
    }
    const { title, company, location, from, to, current, description } =
      req.body;
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route      DELETE api/profile/experience/:exp_id
//@desc       delete profile experience
//@acess    private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex,1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});
//@route      PUT api/profile/Education
//@desc       Add profile Education
//@acess    private
router.put(
  "/education",
  [
    auth,
    check("school", "School is required").not().isEmpty(),
    check("degree", "degree is required").not().isEmpty(),
    check("fieldofstudy", "fieldofstudy is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(401).send({ errors: errors.array() });
    }
    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);
      await profile.save();
      return  res.json(profile);
    } catch (err) {
      console.log(err.message);
      return  res.status(500).send("Server Error");
    }
  }
);
//@route      DELETE api/profile/eduaction/:education_id
//@desc       delete profile eduaction
//@acess    private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save()
    return res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

//@route      GET api/profile/github/:username
//@desc       get profile github repository
router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };
    request(options, (error, response, body) => {
      if (error) console.log(error.message);

      if (response.statusCode !== 200) {
        return  res.status(404).json({ msg: "No Github Profile Found" });
      }
    return  res.json(JSON.parse(body));
    });
  } catch (error) {
    console.log(error.message);
    return  res.status(500).send("Server Error");
  }
});
module.exports = router;
