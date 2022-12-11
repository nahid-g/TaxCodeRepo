const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const User = require("../models/userModel");
const Notification = require('../models/notificationModel');

router.get("/user/admin", (req, res) => {
    res.render("admin");
});

router.get('/admin/signup',function(req,res){
    res.render('signupAdmin');
})

router.post("/admin/signup", async (req, res) => {
    try {

        console.log(req.body);
        const name = req.body.name;
        const email = req.body.email;
        const role = "admin";
        const password = req.body.password;

        const admin = new User({
            name,
            email,
            password,
            role,
        });
        await admin.save();
        const token = await admin.generateAuthToken();
        res.status(200).send("success");
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/user/admin/requests', async (req, res)=>{
    res.render("requestedUpdate");
})

router.get('/user/admin/getallnotifications', async (req, res) => {
    const notifications = await Notification.find({});
    res.send( notifications);

})

router.post('/user/admin/requests/:id', async (req, res) => {
    
})

router.delete('/user/admin/requests/:id', async (req, res) => {
    
})

router.get("/admin/signup", async (req, res) => {
    //admin register page
});





module.exports = router;


