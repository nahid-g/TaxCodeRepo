/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Contract } = require("fabric-contract-api");

class FabCar extends Contract {
    async initLedger(ctx) {
        console.info("============= START : Initialize Ledger ===========");
        console.info("============= END : Initialize Ledger ===========");
    }
    //project code
    async specificFieldQuery(ctx, docType, companyName) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = docType;
        queryString.selector.companyName = companyName;
        let queryResults = await this.getQueryResultForQueryString(
            ctx,
            JSON.stringify(queryString)
        );
        return queryResults.toString(); //shim.success(queryResults);
    }

    async getQueryResultForQueryString(ctx, queryString) {
        console.info(
            "- getQueryResultForQueryString queryString:\n" + queryString
        );
        let resultsIterator = await ctx.stub.getQueryResult(queryString);
        //let method = thisClass["getAllResults"];

        let results = await this.getAllResults(resultsIterator, false);

        return Buffer.from(JSON.stringify(results));
    }

    async getAllResults(iterator, isHistory) {
        let allResults = [];
        while (true) {
            let res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                console.log(res.value.value.toString("utf8"));

                if (isHistory && isHistory === true) {
                    jsonRes.TxId = res.value.tx_id;
                    jsonRes.Timestamp = res.value.timestamp;
                    jsonRes.IsDelete = res.value.is_delete.toString();
                    try {
                        jsonRes.Value = JSON.parse(
                            res.value.value.toString("utf8")
                        );
                    } catch (err) {
                        console.log(err);
                        jsonRes.Value = res.value.value.toString("utf8");
                    }
                } else {
                    jsonRes.Key = res.value.key;
                    try {
                        jsonRes.Record = JSON.parse(
                            res.value.value.toString("utf8")
                        );
                    } catch (err) {
                        console.log(err);
                        jsonRes.Record = res.value.value.toString("utf8");
                    }
                }
                allResults.push(jsonRes);
            }
            if (res.done) {
                console.log("end of data");
                await iterator.close();
                console.info(allResults);
                return allResults;
            }
        }
    }

    ///projet code
    async queryCompany(ctx, companyName) {
        const companyAsBytes = await ctx.stub.getState(companyName);
        if (!companyAsBytes || companyAsBytes.length === 0) {
            throw new Error(`${companyName} does not exist`);
        }
        console.log(companyAsBytes.toString());
        return companyAsBytes.toString();
    }
    async allCompany(ctx) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = "Company";
        let queryResults = await this.getQueryResultForQueryString(
            ctx,
            JSON.stringify(queryString)
        );
        return queryResults.toString();
    }

    async allTaxInfo(ctx) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = "Tax-Info";
        let queryResults = await this.getQueryResultForQueryString(
            ctx,
            JSON.stringify(queryString)
        );
        return queryResults.toString();
    }
    

    async allTaxStatus(ctx,taxStatus) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = "Tax-Info";
        queryString.selector.taxStatus = taxStatus;

        let queryResults = await this.getQueryResultForQueryString(
            ctx,
            JSON.stringify(queryString)
        );
        return queryResults.toString();
    }

    ///project code
    async createCompany(
        ctx,
        companyName,
        revenue,
        shareMarketValue,
        assemblingOrigin,
        manufacturingOrigin
    ) {
        console.info("============= START : Create Company ===========");
        const company = {
            revenue,
            shareMarketValue,
            assemblingOrigin,
            manufacturingOrigin,
            docType: "Company",
        };
        await ctx.stub.putState(
            companyName,
            Buffer.from(JSON.stringify(company))
        );

        console.info("============= END : Create Company ===========");

        console.info(
            "============= START : Create Company TAX INFO  ==========="
        );
        const taxStatus = "Due";
        const taxToPay = 0;
        const paidTax = 0;
        const dueTax = 0;
        const taxDoc = {
            companyName,
            taxStatus,
            taxToPay,
            paidTax,
            dueTax,
            docType: "Tax-Info",
        };

        const smv = parseInt(shareMarketValue);
        const rv = parseInt(revenue);
        if (smv >= rv * 0.1) {
            taxDoc.taxToPay = parseInt(taxDoc.taxToPay) + 0.35 * rv;
        } else {
            taxDoc.taxToPay = parseInt(taxDoc.taxToPay) + 0.4 * rv;
        }

        taxDoc.dueTax = taxDoc.taxToPay;
        const taxID = `TaxInfo(${companyName})`;
        await ctx.stub.putState(taxID, Buffer.from(JSON.stringify(taxDoc)));
        console.info("============= END : Create Company TAX INFO===========");
    }
    async addTransectionData(
        ctx,
        id,
        companyName,
        model,
        numberOfUnit,
        perUnitCost
    ) {
        console.info(
            "============= START : Entering Transection Data ==========="
        );
        const transectionData = {
            id,
            companyName,
            model,
            numberOfUnit,
            perUnitCost,
            docType: "Transection",
        };
        await ctx.stub.putState(
            id,
            Buffer.from(JSON.stringify(transectionData))
        );

        console.info(
            "============= END : Entering Transection Data ==========="
        );
    }

    ///project code
    async queryAllCompany(ctx) {
        const startKey = "";
        const endKey = "";
        const allResults = [];
        for await (const { key, value } of ctx.stub.getStateByRange(
            startKey,
            endKey
        )) {
            const strValue = Buffer.from(value).toString("utf8");
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async updateTransaction(ctx,
        id,
        model,
        numberOfUnit,
        perUnitCost) {
        
        const requestedTrasactionAsBytes = await ctx.stub.getState(id); // get the car from chaincode state
        
        const requestedTransaction = JSON.parse(requestedTrasactionAsBytes.toString());
        requestedTransaction.model = model;
        requestedTransaction.numberOfUnit = numberOfUnit;
        requestedTransaction.perUnitCost = perUnitCost;
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(requestedTransaction)));
    }

    async taxStatusUpdate(ctx, companyName, taxData, updateType) {
        let companyAsBytes = await ctx.stub.getState(companyName); // get the company from chaincode state
        if (!companyAsBytes || companyAsBytes.length === 0) {
            throw new Error(`${companyName} does not exist`);
        }
        let company = {};
        company = JSON.parse(companyAsBytes.toString());

        let companyTaxInfoAsBytes = await ctx.stub.getState(
            `TaxInfo(${companyName})`
        ); // get the company from chaincode state
        if (!companyTaxInfoAsBytes || companyTaxInfoAsBytes.length === 0) {
            throw new Error(`${companyName} does not exist`);
        }
        let companyTaxInfo = {};
        companyTaxInfo = JSON.parse(companyTaxInfoAsBytes.toString());
        
        
        if (updateType.toLowerCase() === "deltax") {
            taxData = parseInt(taxData) * .15 ; ///statics reasons
            companyTaxInfo.taxToPay = parseInt(companyTaxInfo.taxToPay) - taxData;
            companyTaxInfo.dueTax = parseInt(companyTaxInfo.taxToPay) - parseInt(companyTaxInfo.paidTax);
            const taxToPay = parseInt(companyTaxInfo.taxToPay);
            const paidTax = parseInt(companyTaxInfo.paidTax);
            if (taxData + paidTax >= taxToPay) {
                companyTaxInfo.taxStatus = "Paid";
            } else {
                companyTaxInfo.taxStatus = "Due";
            }
        }


        else if (updateType.toLowerCase() === "paytax") {
            const taxToPay = parseInt(companyTaxInfo.taxToPay);
            taxData = parseInt(taxData);
            const paidTax = parseInt(companyTaxInfo.paidTax);
            if (taxData + paidTax >= taxToPay) {
                companyTaxInfo.taxStatus = "Paid";
            } else {
                companyTaxInfo.taxStatus = "Due";
            }
            companyTaxInfo.dueTax = taxToPay - (taxData + paidTax);
            companyTaxInfo.paidTax = taxData + paidTax;
        } else {
            const assemblingOrigin = company.assemblingOrigin.toLowerCase();
            const manufacturingOrigin = company.manufacturingOrigin.toLowerCase();

            if (
                assemblingOrigin === "bangladesh" &&
                manufacturingOrigin === "bangladesh"
            ){
                companyTaxInfo.taxToPay = Math.floor(
                    parseInt(companyTaxInfo.taxToPay) + 0.2 * parseInt(taxData)
                );
            } else if (
                assemblingOrigin === "bangladesh" &&
                manufacturingOrigin !== "bangladesh"
            ){
                companyTaxInfo.taxToPay = Math.floor(
                    parseInt(companyTaxInfo.taxToPay) + 0.32 * parseInt(taxData)
                );
            }else {
                companyTaxInfo.taxToPay = Math.floor(
                    parseInt(companyTaxInfo.taxToPay) + 0.47 * parseInt(taxData)
                );
            }
            companyTaxInfo.dueTax = parseInt(companyTaxInfo.taxToPay) - parseInt(companyTaxInfo.paidTax);
        }
        const taxToPay = parseInt(companyTaxInfo.taxToPay);
        const paidTax = parseInt(companyTaxInfo.paidTax);    
        if (paidTax >= taxToPay) {
            companyTaxInfo.taxStatus = "Paid";
        } else {
            companyTaxInfo.taxStatus = "Due";
        }

        let companyTaxInfoJSONasBytes = Buffer.from(
            JSON.stringify(companyTaxInfo)
        );
        await ctx.stub.putState(
            `TaxInfo(${companyName})`,
            companyTaxInfoJSONasBytes
        );

        //return companyJSONasBytes.toString();
        //return company;
    }
    async taxStatusCheck(ctx, companyName) {
        const companyAsBytes = await ctx.stub.getState(
            `TaxInfo(${companyName})`
        );
        if (!companyAsBytes || companyAsBytes.length === 0) {
            throw new Error(`${companyName} does not exist`);
        }
        console.log(companyAsBytes.toString());
        return companyAsBytes.toString();
    }

    async payTax(ctx, companyName, amountPaid) {
        await this.taxStatusUpdate(ctx, companyName, amountPaid, "paytax");
        return "success";
    }

    async searchTransaction(ctx,id){
        
    }
}
module.exports = FabCar;
