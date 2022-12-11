const express = require("express");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const auth = require("../middleware/auth");

const router = new express.Router();

router.get("/user/client", auth, async (req, res) => {
    const userObj = req.user;
    res.render("client");
});

router.get("/user/signin", async (req, res) => {
    res.render("signin");
});


router.post("/user/signin", async (req, res) => {
    try {
        const user = await User.findbyCredentials(
            req.body.email,
            req.body.password
        );

        if (!user) throw new Error("credential doesnt match");

        const token = await user.generateAuthToken();

        res.cookie("auth", token);
        res.cookie("name", user.name);
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/user/client/notification', async (req, res) => {
    try {
        const modelName = req.body.modelName;
        const prevModelName = req.body.prevModelName;
        const unitNumber = req.body.unitNumber;
        const prevUnitNumber = req.body.prevUnitNumber;
        const costPerUnit = req.body.perUnitCost;
        const prevCostPerUnit = req.body.prevPerUnitCost;
        const reason = req.body.reason;
        const id = req.body.id;
        const companyName = req.body.name;


        const notification = new Notification({
            companyName,
            modelName,
            prevModelName,
            unitNumber,
            prevUnitNumber,
            costPerUnit,
            prevCostPerUnit,
            reason,
            id,
        })
        console.log(notification);
        await notification.save();
        res.status(200).send(notification);
    } catch (e) {
        res.status(400).send(e);
    }
})
router.get("/user/client/adddata", auth, async (req, res) => {
    res.render('clienttransection');
});


router.get("/user/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(
            (token) => req.token != token.token
            
        );
        
        res.cookie('auth', "");
        res.cookie('name', "");
        await req.user.save();
        console.log("done");
        res.status(200).json("successful logout and token deleted");
    } catch (error) {
        res.status(500).json(error);
    }

    
    ///redirect to homepage if successfully logs out
});

router.post("/users/logoutall", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        res.cookie('auth', "");
        await req.user.save();
        res.send("all token deleted");
    } catch (error) {
        res.status(500).send(error);
    }

    ///redirect to homepage if successfully logs out
});

module.exports = router;


