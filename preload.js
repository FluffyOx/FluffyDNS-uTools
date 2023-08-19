utools.onPluginEnter(({ type, payload }) => {
    if (payload === "DNS" || payload === "Fluffy DNS" || payload === "DNS记录查询" || payload === "域名解析查询") {
        payload = "";
    }
    var tableBody = document.querySelector("#result-table tbody");
    tableBody.innerHTML = "";
    disableInputListenerOnce = true;
    document.getElementById('domain-input').value = extractDomain(payload);
    setTimeout(performDNSQuery,256);
})