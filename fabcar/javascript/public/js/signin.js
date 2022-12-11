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
    try {
        const userObj = myFunction();
        const response = await fetch("/user/signin", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                email: userObj.email,
                password: userObj.password,
            }),
        });

        const data = await response.json();
        console.log(data.user);

        if (response.status===200) {
            if (data.user.role === "admin") {
                window.location.assign("/user/admin");
            } else if (data.user.role === "client") {
                window.location.assign("/user/client");
            }
        } else {
            alert("Credentials aren't valid");
            location.reload();
        }
    } catch (err) {
        console.log(err);
    }
});
