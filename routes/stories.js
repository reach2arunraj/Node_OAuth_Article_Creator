const express = require("express")
const router = express.Router()
const { ensureAuth } = require("../middleware/auth")
const Story = require("../models/Stroy")

// GET /stories/add
// Show add page
router.get("/add", ensureAuth, (req,res) => {
    res.render("stories/add")
})

// Procees add form
// POST /stories
router.post("/", ensureAuth, async (req,res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect("/dashboard")
    } catch (err) {
        console.error(err)
        res.render("/error/500")
    }
})

// show all stories
// GET  /stories
router.get("/", ensureAuth,  async (req,res) => {
    try {
        const stories = await Story.find({ status:"public" })
                                   .populate("user")
                                   .sort({ createAt: "desc" })
                                   .lean()
            res.render("stories/index", {
                stories,
            })
    } catch (err) {
        console.error(err)
        res.render("error/500")
    }
})

// GET /stories/:id
// Show single story
router.get("/:id", ensureAuth, async (req,res) => {
    try {
        let story = await Story.findById(req.params.id)
                                .populate("user")
                                .lean()
        if(!story){
            return res.render("error/404")
        }
        res.render("stories/show", {story}) 
    } catch (err) {
        console.error(err)
        res.render("error/404")
    }
})

// GET /stories/edit/:id
// Show edit page

router.get("/edit/:id", ensureAuth, async (req,res) => {
    try {
        const story = await Story.findOne({_id:req.params.id}).lean()
        if(!story){
            return res.render("error/404")
        }
        if (story.user != req.user.id){
            res.redirect("/stories")
        } else{
            res.render("stories/edit", {story})
        }
        
    } catch (err) {
        console.error(err)
        return res.render("error/500")
    }
})

// POST /stories/:id
// update stories
router.post("/:id", ensureAuth, async (req,res) => {
    try {
        let story = await Story.findById(req.params.id).lean()
        if(!story){
           return res.render("error/404")
        }
        if(story.user != req.user.id){
            res.redirect("/stories")
        }else{
            story = await Story.findOneAndUpdate({_id:req.params.id}, req.body, {new:true, runValidators: true})
        }
        res.redirect("/dashboard")
        
    } catch (err) {
        console.error(err)
        return res.render("error/500")
    }
})


// GET /stories/delete/:id
// Delete Story
router.get("/delete/:id", ensureAuth, async (req,res) => {
    try {
        await Story.remove({_id:req.params.id})
        res.redirect("/dashboard")
    } catch (err) {
        console.error(err)
        return res.render("error/500")
    }
})

// GET /stories/user/:userId
// Show user stories
router.get("/user/:userid", ensureAuth,  async (req,res) => {
    try {
        const stories = await Story.find({user:req.params.userid, status:"public"})
                                    .populate("user")
                                    .lean()
        res.render("stories/index", {stories})                                    
    } catch (err) {
        console.error(err)
        res.render("error/500")
    }
})

module.exports = router