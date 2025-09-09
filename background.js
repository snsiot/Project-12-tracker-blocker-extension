let blockedCount = 0;

const defaultBlocklist = [
  "tracker.example.com",
  "ads.example.net",
  "analytics.fake"
];

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const url = new URL(details.url);
    const domain = url.hostname;

    chrome.storage.local.get(["customBlocklist"], (data) => {
      const customList = data.customBlocklist || [];
      const blocklist = new Set([...defaultBlocklist, ...customList]);

      if (blocklist.has(domain)) {
        blockedCount++;
        chrome.storage.local.set({ count: blockedCount });
        updateBadge(blockedCount);
        return { cancel: true };
      }
    });
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

function updateBadge(count) {
  chrome.action.setBadgeText({ text: count.toString() });
  chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ count: 0 });
  updateBadge(0);
});
