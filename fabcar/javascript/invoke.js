/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Gateway, Wallets } = require("fabric-network");
const fs = require("fs");
const path = require("path");

async function main() {
    try {
        // load the network configuration
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

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

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

        // Submit the specified transaction.
            // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
            // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
            /////await contract.submitTransaction('createCar', 'CAR13', 'Gonda', 'Bccord', 'Clack', 'Dom');

            ////create company takes this args = companyName, revenue, shareMarketValue, assemblingOrigin, manufacturingOrigin, year, password

        //     await contract.submitTransaction(
        //         "createCompany",
        //         "Samsung",
        //         10000,
        //         100,
        //         "Bangladesh",
        //         "Bangladesh",
        //     );
        // console.log("Transaction has been submitted");
        // await contract.submitTransaction(
        //     "createCompany",
        //     "MI",
        //     100000,
        //     100,
        //     "Bangladesh",
        //     "Bangladesh",
        // );
        // console.log("Transaction has been submitted");
          
            // await contract.submitTransaction(
            //     "updateTransaction",
            //     "35af3207b1",
            //     "Poco X2",
            //     "3000",
            //     "1000"
            // );
            // console.log("Transaction data has been updated");

            // // await contract.submitTransaction(
            // //     "taxStatusUpdate",
            // //     "MI",
            // //     300 * 18000,
            // //     "updatedata"
            // // );
            // console.log("Transaction tax has been submitted");
            // // await contract.submitTransaction(
            //     "addTransectionData",
            //     Math.floor(Math.random()*1000000000000).toString(16),
            //     "Xiaomi",
            //     "Poco F3",
            //     "100",
            //     "29000"
            // );
            // console.log("Transaction data has been submitted");

            // await contract.submitTransaction(
            //     "taxStatusUpdate",
            //     "Xiaomi",
            //     100 * 29000,
            //     "updatedata"
            // );
            // console.log("Transaction tax has been submitted");

            // await contract.submitTransaction(
            //     "addTransectionData",
            //     Math.floor(Math.random()*1000000000000).toString(16),
            //     "Samsung",
            //     "A72",
            //     "100",
            //     "28000"
            // );
            // console.log("Transaction data has been submitted");
        

            // await contract.submitTransaction(
            //     "taxStatusUpdate",
            //     "Samsung",
            //     100 * 28000,
            //     "updatedata"
            // );
            // console.log("Transaction tax has been submitted");
        

              await contract.submitTransaction(
                "payTax",
                "Samsung",
                40000,
            );
            console.log("Tax paid successfully");
        
        
        
        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
