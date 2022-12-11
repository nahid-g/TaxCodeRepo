document.addEventListener("DOMContentLoaded", async function () {
    const getName = window.location.href.split("/");
    const company = getName[getName.length - 1];
    const cname = document.querySelector("center h2 u");
    cname.innerText = `Transaction list ${company}`;

    const response = await fetch("/user/admin/specificcompanydata", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            name: company,
            docType: "Transection",
        }),
    });

    const datas = await response.json();
    const table = document.querySelector("table tbody");
    if (datas.length === 0) {
        table.innerHTML =
            "<tr><td  class='no-data' style='text-align:center' colspan='5'><b><h2>No Transaction To Show</h2> </b></td> </tr>";
        return;
    }

    let tableHtml = "";
    datas.forEach((data) => {
        tableHtml += "<tr>";
        tableHtml += `<td>${data.Record.id}</td>`;
        tableHtml += `<td>${data.Record.model}</td>`;
        tableHtml += `<td>${data.Record.numberOfUnit}</td>`;
        tableHtml += `<td>${data.Record.perUnitCost}</td>`;
        tableHtml += "</tr>";
    });
    table.innerHTML = tableHtml;
});
