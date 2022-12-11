const btn = document.querySelector(".container");

document.addEventListener("DOMContentLoaded", async function () {
    const response = await fetch("/user/admin/getallnotifications", {
        method: "GET",
        headers: {
            "Content-type": "application/json",
        },
    });

    const notis = await response.json();
    let container = "";
    for (let i = 0; i < notis.length; i++) {
        container += `<div class='outerDiv box' id='${notis[i].id}'>`;
        container += `<center><h2>${notis[i].companyName}(${notis[i].id})</h2></center>`;
        container += `<div class='leftDiv'>`;
        container += `<h4>Previous Model: ${notis[i].prevModelName}</h4>`;
        container += `<h4 class="pu">Previous Unit: ${notis[i].prevUnitNumber}</h4>`;
        container += `<h4 class="pc">Previous Unit Cost: ${notis[i].prevCostPerUnit}</h4>`;
        container += `</div>`;
        container += `<div class='rightDiv'>`;
        container += `<h4 class="rm">Requested Model: ${notis[i].modelName}</h4>`;
        container += `<h4 class="ru">Requested Unit: ${notis[i].unitNumber}</h4>`;
        container += `<h4 class="rc">Requested Unit Cost: ${notis[i].costPerUnit}</h4>`;
        container += `</div>`;
        container += `<center><button class="accept" id="${notis[i].id}">Accept</button> <button class="decline" id="${notis[i].id}">Decline</button></center>`;
        container += `</div>`;
        container += `<br><br>`;
    }
    btn.innerHTML = container;
    const outers = document.querySelectorAll(".outerDiv");
    
    outers.forEach(outer => {
        const acceptBtn = outer.querySelector(".accept");
        const declineBtn = outer.querySelector(".decline");
        const id = acceptBtn.id;
        const companyName = outer.querySelector('center h2').innerText.split('(')[0];
        const prevModel = outer.querySelector('h4').innerText.split(": ")[1]
        const prevUnit = outer.querySelector('.pu').innerText.split(": ")[1];
        const prevCost = outer.querySelector('.pc').innerText.split(": ")[1];
        const reqModel = outer.querySelector('.rm').innerText.split(": ")[1]
        const reqUnit = outer.querySelector('.ru').innerText.split(": ")[1];
        const reqCost = outer.querySelector('.rc').innerText.split(": ")[1];

        acceptBtn.addEventListener("click", async function () {
            await fetch('/user/client/updatetransaction',{
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                    modelName: reqModel,
                    unit: reqUnit,
                    cost: reqCost,
                    companyName:companyName,
                }),
            })
            

            const prevData = parseInt(prevUnit) * parseInt(prevCost);
            const curData = parseInt(reqUnit) * parseInt(reqCost);
            
            await fetch(`/user/admin/deltax`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    companyName,
                    prevData,
                    curData,
                    id,
                }),
            })



            if (response.status === 200) {
                alert("update procedure completed");
                location.reload();
            } else {
                alert("update procedure failed!");
                location.reload();
            }
            

            
        })

        declineBtn.addEventListener("click", async function () {
            const response = await fetch('/user/admin/request/decline', {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    id:id,
                }),
            })

            if (response.status === 200) {
                alert("Confirmed request update declination");
                location.reload();
            } else {
                alert("Request update declination failed!")
                location.reload()
            }
        })
        
    
    })

    // const acceptBtn = document.querySelector('.accept');
    // const declineBtn = document.querySelector('.decline');
    // const id = declineBtn.id;

    //need to pass company in notification;
    // notis.forEach(noti => {

    //     declineBtn.addEventListener("click", async function () {
    //         const response=  await fetch('/user/admin/request/decline',{
    //               method: "POST",
    //               headers: {
    //                   "Content-type": "application/json",
    //               },
    //               body: JSON.stringify({
    //                   id:id,

    //               }),
    //         })
    //           if (response.status === 200) {
    //               alert("Request Declined successfully");
    //               location.reload();
    //           } else {
    //               alert("Request Decline failed");
    //               location.reload();
    //           }
    //       })

    // });
    // acceptBtn.addEventListener("click", async function () {

    // })
});
