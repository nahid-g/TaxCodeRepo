const btn = document.querySelector(".container");
console.log(btn);
document.addEventListener("DOMContentLoaded", async function () {
    const responseCompany = await fetch("/user/admin/allcompany", {
        method: "GET",
        headers: {
            "Content-type": "application/json",
        },
    });

    const companyDatas = await responseCompany.json();
    console.log(companyDatas);
    const responseTax = await fetch("/user/admin/alltaxinfo", {
        method: "GET",
        headers: {
            "Content-type": "application/json",
        },
    });
    console.log(responseTax);

    const taxDatas = await responseTax.json();
    console.log(taxDatas);

    let container = "";

    for (let i = 0; i < companyDatas.length; i++) {
        container += `<div class='outerDiv box' id='${companyDatas[i].Key}'>`;
        container += `<center><h2>${companyDatas[i].Key}</h2></center>`;
        container += `<div class='leftDiv'>`;
        container += `<h4>Manufacturing Origin: ${companyDatas[i].Record.manufacturingOrigin}</h4>`;
        container += `<h4>Revenue: ${companyDatas[i].Record.revenue}</h4>`;
        container += `<h4>Tax: ${taxDatas[i].Record.taxToPay}</h4>`;
        container += `</div>`;
        container += `<div class='rightDiv'>`;
        container += `<h4>Assembling Origin: ${companyDatas[i].Record.assemblingOrigin}</h4>`;
        container += `<h4>Share Market Value: ${companyDatas[i].Record.shareMarketValue}</h4>`;
        container += `<h4>Due Tax: ${taxDatas[i].Record.dueTax}</h4>`;
        container += `</div>`;
        container += `<center><h4>Tax Status: ${taxDatas[i].Record.taxStatus}</h4></center>`;
        container += `</div>`;
        container += `<br><br>`;
    }
    btn.innerHTML = container;
    console.log(btn);
    companyDatas.forEach((data) => {
        const clickTrack = document.getElementById(data.Key);
        clickTrack.addEventListener("click", function () {
            const companyName = clickTrack.querySelector("center h2").innerText;
            console.log(companyName);
            window.location = `/user/admin/${companyName}`;
        });
    });
});

const signOutBtn = document.querySelector(".signout");
signOutBtn.addEventListener("click", function () {
    window.location = "/";
});

const searchTax = document.querySelector(".search-by-tax");
searchTax.addEventListener("click", function () {
    window.location = "/user/admin/taxinfo";
});

const approveBtn = document.querySelector(".approval-update");

approveBtn.addEventListener("click", function () {
    window.location = "/user/admin/requests";
});
