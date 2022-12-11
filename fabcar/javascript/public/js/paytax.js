const btn = document.querySelector(".btn.btn-primary");
const companyname = document.querySelector(".name");

btn.onclick = async function () {
    if (document.getElementById("full").checked) {
        var amount = document.querySelector(".amount").innerText;
        console.log(amount);
    } else if (document.getElementById("partial").checked) {
        amount = document.querySelector(".form-control.ml-1").value;
        console.log(amount);
    }

    const payAbleAmount = parseInt(amount);

    const response = await fetch("/user/client/paytax", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            name: companyname.innerText,
            amount: payAbleAmount,
        }),
    });
    console.log(response.status);
    if (response.status === 200) {
        alert(
            `You successfully paid ৳${payAbleAmount}\nThank You for your co-ordination`
        );
        location.reload();
    } else {
        alert("Transection Failed");
        window.location = "/user/client";
    }
};

const back = document.querySelector(".back");
back.onclick = function () {
    window.location.assign("/user/client");
};
