const btn = document.querySelector(".btn");
function myFunction() {
    var elements = document.getElementById("myForm").elements;
    var obj = {};
    for (var i = 0; i < elements.length; i++) {
        var item = elements.item(i);
        obj[item.name] = item.value;
    }

    return obj;
}

btn.addEventListener("click", async function (e) {
    e.preventDefault();
    const userObj = myFunction();
    if (userObj.manufacturingorigin  === "" || userObj.assemblingorigin ==="" || userObj.name ==="" || userObj.password ==="" || userObj.revenue ==="" || userObj.sharemarketvalue ==="" || userObj.email ==="") {
        alert("Please fillup all required informations");
        //location.reload();
    }else {
        try {
            const response = await fetch("/user/signup", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    name: userObj.name,
                    email: userObj.email,
                    password: userObj.password,
                    revenue: userObj.revenue,
                    sharemarketvalue: userObj.sharemarketvalue,
                    manufacturingorigin: userObj.manufacturingorigin,
                    assemblingorigin: userObj.assemblingorigin,
                }),
            });
            if (response.status === 200) {
                alert("Client information successfully stored");
                window.location.assign("/user/signin");  
            } else {
                alert("Registration failed!");
                location.reload();
            } 
        } catch (e) {
            alert("Registration failed!");
            location.reload();
            console.log(e);
        }   
    }

    
});



