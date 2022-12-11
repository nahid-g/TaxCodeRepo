let cookie = (function getCookie() {
    var cookieArr = document.cookie.split(";");
    var finalCookie = [];
    cookieArr.forEach((ca) => {
        if (ca.includes("name")) finalCookie = ca.split("=");
    });
    return finalCookie[1];
})();

function myFunction() {
    var elements = document.getElementById("add-transaction").elements;
    var obj = {};
    for (var i = 0; i < elements.length; i++) {
        var item = elements.item(i);
        obj[item.name] = item.value;
    }
    return obj;
}

const btn = document.querySelector('#update');
const prevModel = document.getElementById("modelName").placeholder;
const prevUnitNumber = document.getElementById("unitNumber").placeholder;
const prevPerUnitCost = document.getElementById("perUnitCost").placeholder;
const id = document.getElementById('id').placeholder;


btn.addEventListener("click", async function(e){
    e.preventDefault();
    const obj = myFunction();
        
    if (obj.modelName==="" || obj.perUnitCost==="" || obj.unitNumber==="" || obj.reason==="") {
        alert("please fillup all required information");
    } else {
        try {
            const response = await fetch("/user/client/notification", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    name: cookie,
                    id: id,
                    modelName: obj.modelName,
                    perUnitCost: obj.perUnitCost,
                    unitNumber: obj.unitNumber,
                    reason: obj.reason,
                    prevModelName: prevModel,
                    prevPerUnitCost: prevPerUnitCost,
                    prevUnitNumber: prevUnitNumber
                }),
            });
           
            if (response.status === 200){
                alert('Update request successfully sent');
                window.location = '/user/client';
            } else {
                alert("Update request failed");
                window.location = '/user/client';
            }
     
        } catch (e) {
            console.log(e);
        }
    }
})
