var disableInputListenerOnce = false;
window.addEventListener("load", function() {
  var domainInput = document.getElementById("domain-input");
  var searchParams = new URLSearchParams(window.location.search);
  var isDirectParam = false;

  domainInput.focus();

  var queryButton = document.getElementById("query-button");
  queryButton.addEventListener("click", performDNSQuery);

  domainInput.addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
      performDNSQuery();
    }
  });

  var suffixList = loadDomainSuffixListFromStorage(); // 尝试从存储中加载域名后缀列表
  if (suffixList) {
    handleDomainInput(suffixList);
  } else {
    loadDomainSuffixList();
  }
});

function loadDomainSuffixList() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "public_suffix_list.json", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var suffixList = JSON.parse(xhr.responseText);
      handleDomainInput(suffixList);
      storeDomainSuffixListToStorage(suffixList); // 将域名后缀列表存储到存储中
    }
  };
  xhr.send();
}

function storeDomainSuffixListToStorage(suffixList) {
  var expirationDate = new Date();
  expirationDate.setMonth(expirationDate.getMonth() + 1); // 设置一个月后的过期时间
  var storageData = {
    suffixList: suffixList,
    expirationDate: expirationDate.getTime()
  };
  localStorage.setItem("domainSuffixList", JSON.stringify(storageData));
}

function loadDomainSuffixListFromStorage() {
  var storageData = localStorage.getItem("domainSuffixList");
  if (storageData) {
    var parsedData = JSON.parse(storageData);
    var expirationDate = new Date(parsedData.expirationDate);
    if (expirationDate > new Date()) {
      return parsedData.suffixList;
    } else {
      localStorage.removeItem("domainSuffixList"); // 删除过期的存储数据
    }
  }
  return null;
}

var inputTimer; // 用于存储延迟触发查询的计时器

function handleDomainInput(suffixList) {
  if(!disableInputListenerOnce){
    disableInputListenerOnce = false;
    var domainInput = document.getElementById("domain-input");
    var inputTimer = null;

    domainInput.addEventListener("input", function() {
      clearTimeout(inputTimer); // 清除之前的计时器

      inputTimer = setTimeout(function() {
        var inputDomain = domainInput.value.trim();
        var suffixIndex = inputDomain.lastIndexOf(".");
        if (suffixIndex > 0) {
          var suffix = inputDomain.substring(suffixIndex + 1).trim();
          if (suffix !== "" && suffixList.includes(suffix)) {
            performDNSQuery();
          }
        }
      }, 500); // 设置延迟时间，单位为毫秒
    });
  }
}
