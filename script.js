 function hideHeader() {
    let headerElement = document.getElementById("dismissible-header");
    // Add the 'hidden' class to the header to hide it
    headerElement.classList.add("hidden");
}

// Update the time display
function updateTime() {
    const timeDisplay = document.getElementById("time-display");
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

// Update time immediately and then every second
updateTime();
setInterval(updateTime, 1000);
