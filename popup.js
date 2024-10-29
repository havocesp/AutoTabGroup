document.getElementById("groupTabs").addEventListener("click", () => {
    const groupName = document.getElementById("groupName").value;
    const regexInput = document.getElementById("regexInput").value;
  
    if (groupName && regexInput) {
      chrome.runtime.sendMessage({
        action: "groupMatchingTabs",
        groupName,
        regexInput
      });
    } else {
      alert("Please enter both the group name and regex.");
    }
  });
  