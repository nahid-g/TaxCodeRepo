const saveBtn = document.querySelector(".save-transaction");

saveBtn.addEventListener("click", async function (e) {
    e.preventDefault();
    const transactionObj = myFunction();
    if (transactionObj.modelName===""|| transactionObj.totalunit===""|| transactionObj.costperitem==="") {
        alert("Please fill up all required informations");
        //location.reload();
    } else {
        const response = await fetch("/user/client/adddata", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                modelName: transactionObj.modelname,
                numberOfUnit: transactionObj.totalunit,
                perUnitValue: transactionObj.costperitem,
            }),
        });
    
        if (response.status === 200) {
            alert("Transaction successful");
            window.location = "/user/client";
        } else {
            alert("Transaction failed");
            location.reload();
        }
    }
    
});
function myFunction() {
    var elements = document.getElementById("add-transaction").elements;
    var obj = {};
    for (var i = 0; i < elements.length; i++) {
        var item = elements.item(i);
        obj[item.name] = item.value;
    }

    return obj;
}

const signoutbtn = document.querySelector(".btn.btn-warning.ml-2");

signoutbtn.addEventListener("click", async function () {
    try {
        const response = await fetch("/user/logout", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            },
        });

        if (response.status === 200) {
            window.location = "/";
        } else {
            alert("Error Occured");
            location.reload();
        }
    } catch (e) {
        console.log(e);
    }
});


