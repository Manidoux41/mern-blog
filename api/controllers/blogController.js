const blogController = require('express').Router();
const Blog = require('../models/Blog');
const verifyToken = require('../middlewares/verifyToken');

blogController.get('/getAll', async (req, res) => {
    try {
        const blogs = await Blog.find({}).populate("userId", "-password");
        return res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({message: err});
    }
})

blogController.get('/find/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate("userId", "-password");
        blog.views += 1;
        await blog.save(); 
        return res.status(200).json(blog);
    } catch (error) {
        return res.status(500).json({message: err});
    }
})

blogController.get('/featured', async (req, res) => {
    try {
        const blogs = await Blog.find({featured:true}).populate("userId", "-password").limit(3);
        return res.status(200).json(blogs);
    } catch (error) {
        return res.status(500).json({message: err});

    }
});

blogController.post('/', verifyToken, async (req, res) => {
    try {
        const blog = await Blog.create({...req.body, userId: req.user.id});
        return res.status(201).json(blog);
    } catch (error) {
        return res.status(500).json({message: err});
    }
});

blogController.put('/updateBlog/:id', verifyToken, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if(blog.userId.toString() !== req.user.id.toString()) {
           throw new Error('You are not authorized to update this blog');        
        }

        const updatedBlog = await Blog
        .findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        .populate('userId', '-password');

        return res.status(200).json(updatedBlog);
    } catch (error) {
        return res.status(500).json({message: err});
    }
});

blogController.put('/likeBlog/:id', verifyToken, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if(blog.likes.includes(req.user.id)) {
            blog.likes = blog.likes.filter((userId) => userId !== req.user.id);
            await blog.save();

            return res.status(200).json({message: 'Blog successfully unliked'});
        } else {
            blog.likes.push(req.user.id);
            await blog.save();

            return res.status(200).json({message: 'Blog successfully liked'});
        }
    } catch (error) {
        return res.status(500).json({message: err});
    }
});

blogController.delete('/deleteBlog/:id', verifyToken, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if(blog.userId !== req.user.id) {
            throw new Error('You are not authorized to delete this blog');
        }
        await Blog.findByIdAndDelete(req.params.id);
        return res.status(200).json({message: 'Blog successfully deleted'});
    } catch (error) {
        return res.status(500).json({message: error});
    }
});

module.exports = blogController;