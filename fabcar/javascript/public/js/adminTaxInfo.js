const dueBtn = document.querySelector(".button2");
const paidBtn = document.querySelector(".button1");
const table = document.querySelector("table tbody");

document.addEventListener("DOMContentLoaded", async function () {
    const response = await fetch("/user/admin/alltaxinfo", {
        method: "GET",
        headers: {
            "Content-type": "application/json",
        },
    });

    const datas = await response.json();
    console.log(datas, table);
    if (datas.length === 0) {
        table.innerHTML =
            "<tr><td  class='no-data' style='text-align:center' colspan='2'><b><h2>No Transection To Show</h2> </b></td> </tr>";
        return;
    }

    let tableHtml = "";
    datas.forEach((data) => {
        tableHtml += "<tr>";
        tableHtml += `<td>${data.Record.companyName}</td>`;
        if (data.Record.taxStatus === "due")
            tableHtml += `<td style="color:#ba002e">DUE</td>`;
        if (data.Record.taxStatus === "Due")
            tableHtml += `<td style="color:#ba002e">DUE</td>`;
        if (data.Record.taxStatus === "Paid")
            tableHtml += `<td style="color:#4CAF50">PAID</td>`;
        tableHtml += "</tr>";
    });
    table.innerHTML = tableHtml;
});

paidBtn.addEventListener("click", async function () {
    const response = await fetch("/user/admin/paidclients", {
        method: "GET",
        headers: {
            "Content-type": "application/json",
        },
    });

    const datas = await response.json();
    console.log(datas, table);
    table.innerHTML = "";
    let tableHtml = "";
    datas.forEach((data) => {
        tableHtml += "<tr>";
        tableHtml += `<td>${data.Record.companyName}</td>`;
            tableHtml += `<td style="color:#4CAF50">PAID</td>`;
        tableHtml += "</tr>";
    });
    table.innerHTML = tableHtml;
});

dueBtn.addEventListener("click", async function () {
    const response = await fetch("/user/admin/dueclients", {
        method: "GET",
        headers: {
            "Content-type": "application/json",
        },
    });

    const datas = await response.json();
    console.log(datas, table);

    table.innerHTML = "";
    let tableHtml = "";
    datas.forEach((data) => {
        tableHtml += "<tr>";
        tableHtml += `<td>${data.Record.companyName}</td>`;
        tableHtml += `<td style="color:#4CAF50">DUE</td>`;
        tableHtml += "</tr>";
    });
    table.innerHTML = tableHtml;
});
