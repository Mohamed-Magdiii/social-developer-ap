/** @format */

const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const User = require("../../model/user");
const Post = require("../../model/post");
const user = require("../../model/user");

//@route    POST api/posts
//@desc     Add Post
//@acess    Private
router.post(
  "/",
  [auth, check("text", "Text is Required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id);
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: user.id,
      });
      const post = await newPost.save();
      res.json(post);
      console.log(post);
    } catch (err) {
      console.log(err.message);
      res.status(400).send("Server Error");
    }
  }
);
//@route    GET api/posts
//@desc     get all posts
//@acess    public

router.get("/", async (req, res) => {
  try {
    const post = await Post.find().sort({ date: -1 });
    res.json(post);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    GET api/posts/:post_id
//@desc     get post by id
//@acess    Private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(400).json({ msg: "This post not found" });
    }
    res.json(post);
  } catch (err) {
    console.log(err.message);
    if (err.kind === "ObjectId") {
      res.status(400).json({ msg: "This post not found" });
    }
    res.status(500).send("Server Error");
  }
});
//@route    Delet api/posts/:id
//@desc     Delete post by id
//@acess    Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(500).json({ msg: "Post Not Found" });
    }
    //check user
    if (post.user.toString() !== req.user.id) {
      return res.status(400).json({ msg: "user not authorized" });
    }
    await post.remove();
    res.json({ msg: "Post Removed " });
  } catch (err) {
    console.log(err.message);
    if (err.kind === ObjectId) {
      res.status(400).json({ msg: "This post not found" });
    }
    res.status(500).send("Server Error");
  }
});
//@route    Add api/likes/:id
//@desc     Like a Post
//@acess    Private
router.put("/likes/:id", auth, async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id);
    //check if the posts liked
    if (
      posts.likes.filter((like) => like.user.toString() === req.user.id)
        .length > 0
    ) {
      return res.status(500).json({ msg: "This post is liked" });
    }
    posts.likes.unshift({ user: req.user.id });
    await posts.save();
    res.json(posts.likes);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});
//@route    PUT api/likes/:id
//@desc     UnLike a Post
//@acess    Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //check post is liked or not
    if (
      post.likes.filter(like=> like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(500).json({ msg: "This post is not been liked yet" });
    }
    //Get Remove Index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});
//@route    POST api/comments/:id
//@desc     post a comment
//@acess    Private
router.post('/comments/:id' , [auth, check(
  'text' , 'Comment is required',
)], async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  };
  try {
    const user = await User.findById(req.user.id).select('-password');
    const post = await Post.findById(req.params.id);

    const newComment= {
      text:req.body.text,
      name:user.name,
      avatar:user.avatar,
      user:req.user.id,
    };
    post.comments.unshift(newComment);
    await post.save();
    res.json(post.comments);
      } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});
//@route    D ELETE api/comments/:id
//@desc     delete a comment
//@acess    Private
router.delete('/comments/:id/:comment_id' , auth, async (req,res)=>{
  try {
    const post = await Post.findById(req.params.id);
    
    const comment = post.comments.find(comment => comment.id === req.params.comment_id);
   //Make sure if comments exists
   if(!comment){
     return res.status(400).json({msg : 'this comment not exist'});
   };
   //check for the user that made the comment
   if(req.user.id !== comment.user.toString()){
     return res.status(400).json({msg : 'user doesnot exist'});
   };
   //Get remove index
   const removeIndex =  post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);
   post.comments.splice(removeIndex, 1);
   await post.save();
   res.json(post.comments);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
})
module.exports = router;
