let cookie = (function getCookie() {
    // Split cookie string and get all individual name=value pairs in an array
    var cookieArr = document.cookie.split(";");
    var finalCookie = [];
    cookieArr.forEach((ca) => {
        if (ca.includes("name")) finalCookie = ca.split("=");
    });
    return finalCookie[1];
})();

const nodata = document.querySelector(".no-data");
document.addEventListener("DOMContentLoaded", async function () {
    const response = await fetch("/user/admin/specificcompanydata", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            name: cookie,
            docType: "Transection",
        }),
    });

    const datas = await response.json();
    console.log(cookie);
    console.log(datas);
    const table = document.querySelector("table tbody");
    if (datas.length === 0) {
        table.innerHTML =
            "<tr><td  class='no-data' style='text-align:center' colspan='5'><b><h2>No Transection To Show</h2> </b></td> </tr>";
        return;
    }

    let tableHtml = "";
    datas.forEach((data) => {
        tableHtml += "<tr>";
        tableHtml += `<td>${data.Record.id}</td>`;
        tableHtml += `<td>${data.Record.model}</td>`;
        tableHtml += `<td>${data.Record.numberOfUnit}</td>`;
        tableHtml += `<td>${data.Record.perUnitCost}</td>`;
        tableHtml += `<td><button class="btn" id=${data.Record.id}>Request</button></td>`;
        tableHtml += "</tr>";
    });
    table.innerHTML = tableHtml;

    datas.forEach((data) => {
        const rqst = document.getElementById(data.Key);
        rqst.addEventListener("click", function () {
            window.location = `/user/client/updatedata/${data.Record.id}`;
        });
    });
});

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

