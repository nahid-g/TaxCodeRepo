/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Console } = require("console");
const { Gateway, Wallets } = require("fabric-network");
const fs = require("fs");
const path = require("path");
require("./src/db/mongoose"); ///this just call the mongoose file

const ccpPath = path.resolve(
    __dirname,
    "..",
    "..",
    "test-network",
    "organizations",
    "peerOrganizations",
    "org1.example.com",
    "connection-org1.json"
);
let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

const init = (async () => {
    try {
        const walletPath = path.join(process.cwd(), "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        //console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get("appUser");
        if (!identity) {
            console.log(
                'An identity for the user "appUser" does not exist in the wallet'
            );
            console.log("Run the registerUser.js application before retrying");
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: "appUser",
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("mychannel");

        // Get the contract from the network.
        const contract = network.getContract("fabcar");

        return {
            getInput: function () {
                return {
                    contact: contract,
                    gateway: gateway,
                };
            },
        };
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
})();

const cookieParser = require("cookie-parser");
const hbs = require("hbs");
const express = require("express");
const port = process.env.PORT || 3004;
const app = express();
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

///routers path
const userRoutes = require("./src/routers/userRoutes");
const adminRoutes = require("./src/routers/adminRoutes");

///setting paths for different variables
const publicDirectroyPath = path.join(__dirname, "./public");
const viewsPath = path.join(__dirname, "./templates/views");
const partialPath = path.join(__dirname, "./templates/partials");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

///mongoose models

const User = require("./src/models/userModel");
const Notification = require("./src/models/notificationModel");

/// auth middleware

const auth = require("./src/middleware/auth");
const { response } = require("express");

//setting public directory path
app.use(express.static(publicDirectroyPath));

//view engine setup
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialPath);

app.use(userRoutes);
app.use(adminRoutes);

///home route

app.get("", async (req, res) => {
    //home page for all

    res.render("landing");
});

////client routes/////

app.get("/user/signup", async (req, res) => {
    res.render("signup");
});

app.post("/user/signup", async (req, res) => {
    try {
        var contract = (await init).getInput();
        var contract = contract.contact;
        var gateway = contract.gateway;
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const role = req.body.role;
        const user = new User({
            name,
            email,
            password,
            role,
        });

        const assemblingorigin = req.body.assemblingorigin.toLowerCase();
        const manufacturingorigin = req.body.manufacturingorigin.toLowerCase();
        console.log(assemblingorigin, manufacturingorigin);

        // blockchain transaction
        const result = await contract.submitTransaction(
            "createCompany",
            req.body.name,
            req.body.revenue,
            req.body.sharemarketvalue,
            assemblingorigin,
            manufacturingorigin
        );
        console.log("Transection submitted successfully");
        await user.save();
        console.log("user details stored");
        const token = user.generateAuthToken();
        ///changed a bit here
        res.cookie("auth", token);
        res.cookie("name", name);
        res.status(200).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

app.post("/user/client/adddata", auth, async (req, res) => {
    try {
        var contract = (await init).getInput();
        var contract = contract.contact;
        var gateway = contract.gateway;
        const id = Math.floor(Math.random() * 1000000000000).toString(16);
        await contract.submitTransaction(
            "addTransectionData",
            id,
            req.cookies.name,
            req.body.modelName,
            req.body.numberOfUnit,
            req.body.perUnitValue
        );
        const unit = parseInt(req.body.numberOfUnit);
        const perUnitValue = parseInt(req.body.perUnitValue);
        await contract.submitTransaction(
            "taxStatusUpdate",
            req.cookies.name,
            unit * perUnitValue,
            "updatedata"
        );
        res.status(200).send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
});


// router.get("/user/client/paytax", auth, (req, res) => {
//     res.render("paytax", {
//         companyName: "Samsung",
//         due: "1000",
//     });
// });
app.post("/user/client/paytax", auth, async (req, res) => {
    try {
        var contract = (await init).getInput();
        var contract = contract.contact;
        var gateway = contract.gateway;
        console.log(req.body);
        await contract.submitTransaction(
            "payTax",
            req.body.name,
            req.body.amount
        );

        res.status(200).send("success");
    } catch (e) {
        res.status(400).send(e);
    }
});


app.get("/user/client/checkData", auth, async (req, res) => {
    try {
        var contract = (await init).getInput();
        var contract = contract.contact;
        var gateway = contract.gateway;
        const result = await contract.evaluateTransaction(
            "specificFieldQuery",
            req.body.docType,
            req.body.name
        );
        res.send(result.toString());
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get("/user/client/checktaxstatus", auth, async (req, res) => {
    try {
        var contract = (await init).getInput();
        var contract = contract.contact;
        var gateway = contract.gateway;
        const result = await contract.evaluateTransaction(
            "taxStatusCheck",
            req.cookies.name
        );
        const resultJSON = await result.toString();
        const resultObj = JSON.parse(resultJSON);
        const companyName = req.cookies.name;
        const dueTax = resultObj.dueTax;
        const taxToPay = resultObj.taxToPay;
        const paidTax = resultObj.paidTax;
        const taxStatus = resultObj.taxStatus;
        res.render("paytax", {
            companyName,
            dueTax,
            taxToPay,
            paidTax,
            taxStatus,
        });

        //res.status(200).send(result.toString());
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get("/user/client/updatedata/:id", auth, async (req, res) => {
    var contract = (await init).getInput();
    var contract = contract.contact;
    var gateway = contract.gateway;
    const result = await contract.evaluateTransaction(
        "queryCompany",
        req.params.id
    );
    const transactionData = JSON.parse(result.toString());
    const model = transactionData.model;
    const id = transactionData.id;
    const numberOfUnit = transactionData.numberOfUnit;
    const perUnitCost = transactionData.perUnitCost;
    res.render("updateTransaction", {
        model,
        id,
        numberOfUnit,
        perUnitCost,
    });
});

app.post("/user/client/updatetransaction", auth, async (req, res) => {
    try {
        var contract = (await init).getInput();
        var contract = contract.contact;
        var gateway = contract.gateway;
        await contract.submitTransaction(
            "updateTransaction",
            req.body.id,
            req.body.modelName,
            req.body.unit,
            req.body.cost
        );
        res.status(200).send("success");
    } catch (e) {
        res.status(400).send(e);
    }
});

////user routes/////

////admin routes/////

app.get("/user/admin/registeruserlist", auth, async (req, res) => {
    try {
        var contract = (await init).getInput();
        var contract = contract.contact;
        var gateway = contract.gateway;
        const result = await contract.evaluateTransaction("queryAllCompany");

        res.status(200).send(result.toString());
    } catch (e) {
        res.status(400).send(e);
    }
});

app.post("/user/admin/specificcompanydata", auth, async (req, res) => {
    try {
        var contract = (await init).getInput();
        var contract = contract.contact;
        var gateway = contract.gateway;
        const result = await contract.evaluateTransaction(
            "specificFieldQuery",
            req.body.docType,
            req.body.name
        );

        res.status(200).send(result.toString());
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get("/user/admin/allcompany", auth, async (req, res) => {
    try {
        var contract = (await init).getInput();
        var contract = contract.contact;
        var gateway = contract.gateway;
        const result = await contract.evaluateTransaction("allCompany");

        res.status(200).send(result.toString());
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get("/user/admin/alltaxinfo", auth, async (req, res) => {
    try {
        var contract = (await init).getInput();
        var contract = contract.contact;
        var gateway = contract.gateway;
        const result = await contract.evaluateTransaction("allTaxInfo");

        res.status(200).send(result.toString());
    } catch (e) {
        res.status(400).send(e);
    }
})
app.get("/user/admin/taxinfo",auth ,async (req, res) => {
    res.render("admintaxinfo");
});

app.get("/user/admin/paidclients",auth ,async (req, res) => {
    try {
        var contract = (await init).getInput();
        var contract = contract.contact;
        var gateway = contract.gateway;
        const result = await contract.evaluateTransaction(
            "allTaxStatus",
            "Paid"
        );
        res.status(200).send(result.toString());
    } catch (e) {
        res.status(400).send(e);
    }
});
app.get("/user/admin/dueclients",auth ,async (req, res) => {
    try {
        var contract = (await init).getInput();
        var contract = contract.contact;
        var gateway = contract.gateway;
        const result = await contract.evaluateTransaction(
            "allTaxStatus",
            "Due"
        );

        res.status(200).send(result.toString());
    } catch (e) {
        res.status(400).send(e);
    }
});
app.post("/user/admin/request/decline", auth, async (req, res) => {
    const noti = await Notification.findOneAndDelete({ id: req.body.id });
    res.status(200).send("success");
});

app.post('/user/admin/deltax', async (req, res) => {
    try {
        var contract = (await init).getInput();
        var contract = contract.contact;
        var gateway = contract.gateway;        
        
        await contract.submitTransaction(
            "taxStatusUpdate",
            req.body.companyName,
            req.body.prevData,
            "deltax",
        );
        await contract.submitTransaction(
            "taxStatusUpdate",
            req.body.companyName,
            req.body.curData,
            "updatetax",
        );

         await Notification.findOneAndDelete({ id: req.body.id });
    
        res.status(200).send("success");
    } catch (e) {
        res.status(400).send(e);
    }
})

app.get("/user/admin/:id", auth, async (req, res) => {
    try {
        res.render("adminShowTransection");
    } catch (e) {
        res.status(400).send(e);
    }
});

////admin routes/////
app.listen(port, () => {
    console.log(`Server is up on port no. ${port}`);
});

module.exports = {
    init,
};
