
utools.onPluginEnter(({ type, payload }) => {
    if (payload === "DNS" || payload === "Fluffy DNS" || payload === "DNS记录查询" || payload === "域名解析查询") {
        payload = "";
    }
    document.querySelector("#result-table tbody").innerHTML = "";
    document.getElementById("domain-input").value = "";
    setTimeout(function (){
        document.getElementById("domain-input").value = extractDomain(payload);
        performDNSQuery();
    },700);
})