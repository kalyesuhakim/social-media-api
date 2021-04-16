const express = require('express');
const router = express.Router()
const Post = require('../models/Post')
const User = require('../models/user')

// create post
router.post('/', async (req, res) =>{
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (error) {
        res.status(500).json(error);
    }
});

// update post
router.put('/:id',async (req, res) =>{

    try {
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId) {
            await post.updateOne({$set:req.body});
            res.status(200).json("Post has been updated")
        }else{
            res.status(403).json("You can update only your post")
        }
    } catch (error) {
        res.status(500).json(error)
    }
    
});


// delete post
router.delete('/:id',async (req, res) =>{

    try {
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId) {
            await post.deleteOne({$set:req.body});
            res.status(200).json("Post has been deleted")
        }else{
            res.status(403).json("You can delete only your post")
        }
    } catch (error) {
        res.status(500).json(error)
    }
    
});

// like && dislike router
router.put('/:id/like', async (req, res) =>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)) {
            await post.updateOne({$push:{likes:req.body.userId}});

            res.status(200).json("Post has been liked")
        }else{

            await post.updateOne({$pull:{likes:req.body.userId}});
            res.status(403).json("Post has been disliked")
        }
    } catch (error) {
        res.status(500).json(error)
    }
    
});

// fetch post
router.get('/:id', async (req, res) =>{
    try {
        const post = await Post.findById(req.params.id);
            res.status(200).json(post)
        }
        catch (error) {
        res.status(500).json(error)
       }
    
});

// fetch timeline posts
router.get('/timeline/all', async (req, res) =>{
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({userId: currentUser._id});
        const friendPost = await Promise.all(
            currentUser.followings.map(friendId =>{
               return Post.find({userId: friendId});
            })
            );
         res.json(userPosts.concat(...friendPost));
        }
        catch (error) {
        res.status(500).json(error)
       }
    
})
// router.get('/',(req, res) =>{

// })












module.exports = router;
