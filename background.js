// chrome.action.onClicked.addListener(() => {
//     keepAlive(groupTabs);
// });

async function keepAlive(callback) {
    try {
        await callback();
    } catch (error) {
        console.error("Error keeping service worker alive:", error);
    }
}




async function groupTabs(groupName, regex) {
    try {
        // Get all open tabs
        const tabs = await chrome.tabs.query({});

        // Find or create the target tab group by name
        let groupId = null;
        for (const group of await chrome.tabGroups.query({})) {
            const groupInfo = await chrome.tabGroups.get(group.id);
            if (groupInfo.title === groupName) {
                groupId = group.id;
                break;
            }
        }

        // If group not found, create a new one
        if (!groupId) {
            const firstTab = tabs[0]; // Pick an initial tab to create the group
            groupId = await chrome.tabs.group({ tabIds: firstTab.id });
            await chrome.tabGroups.update(groupId, { title: groupName });
        }

        // Add matching tabs to the group
        for (const tab of tabs) {
            if (regex.test(tab.url)) {
                await chrome.tabs.group({ groupId, tabIds: tab.id });
            }
        }

        console.log("Tabs matched and grouped successfully.");
    } catch (error) {
        console.error("Error grouping tabs:", error);
    }
}

chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "groupMatchingTabs") {
        const { groupName, regexInput } = request;

        // Validate regex input
        let regex;
        try {
            regex = new RegExp(regexInput);
        } catch (e) {
            console.error("Invalid regular expression:", e);
            return;
        }

        // Keep the service worker alive while grouping tabs
        keepAlive(() => groupTabs(groupName, regex));
    }
});


// async function groupTabs() {
//     const regex = /github\.com/i; // Replace with your regular expression
//     const groupName = "GH"; // Desired name of the tab group

//     try {
//         // Get all open tabs
//         const tabs = await chrome.tabs.query({});

//         // Find or create the target tab group
//         let groupId = null;
//         for (const group of await chrome.tabGroups.query({})) {
//             const groupInfo = await chrome.tabGroups.get(group.id);
//             if (groupInfo.title === groupName) {
//                 groupId = group.id;
//                 break;
//             }
//         }

//         // If group not found, create a new one
//         if (!groupId) {
//             const firstTab = tabs[0]; // Pick an initial tab to create the group
//             groupId = await chrome.tabs.group({ tabIds: firstTab.id });
//             await chrome.tabGroups.update(groupId, { title: groupName });
//         }

//         // Add matching tabs to the group
//         for (const tab of tabs) {
//             if (regex.test(tab.url)) {
//                 await chrome.tabs.group({ groupId, tabIds: tab.id });
//             }
//         }

//         console.log("Tabs matched and grouped successfully.");
//     } catch (error) {
//         console.error("Error grouping tabs:", error);
//     }
// }

// chrome.runtime.onMessage.addListener((request) => {
//     if (request.action === "groupMatchingTabs") {
//         keepAlive(groupTabs); // Call the main function to group tabs
//     }
// });