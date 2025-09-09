document.addEventListener('DOMContentLoaded', () => {
  const countEl = document.getElementById('count');
  const resetBtn = document.getElementById('reset');
  const saveBtn = document.getElementById('save');
  const blocklistEl = document.getElementById('blocklist');

  chrome.storage.local.get(['count', 'customBlocklist'], (data) => {
    countEl.textContent = data.count || 0;
    blocklistEl.value = (data.customBlocklist || []).join('\n');
  });

  resetBtn.addEventListener('click', () => {
    chrome.storage.local.set({ count: 0 }, () => {
      countEl.textContent = '0';
      chrome.action.setBadgeText({ text: "" });
    });
  });

  saveBtn.addEventListener('click', () => {
    const list = blocklistEl.value.split('\n').map(s => s.trim()).filter(Boolean);
    chrome.storage.local.set({ customBlocklist: list }, () => {
      alert("Blocklist updated.");
    });
  });
});
