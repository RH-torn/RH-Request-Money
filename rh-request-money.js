// ==UserScript==
// @name         Send to Discord via Server
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Send messages to a server which forwards to Discord
// @author       You
// @match        https://www.torn.com/factions.php*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    const SERVER_ENDPOINT = 'http://bank.reluctanthorrors.com/sendToDiscord';

    function getCookie(name) {
        const value = "; " + document.cookie;
        const parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    function sendToServer(username, amount) {
        GM_xmlhttpRequest({
            method: "POST",
            url: SERVER_ENDPOINT,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({ username: username, amount: amount }),
            onload: function(response) {
                console.log(response.responseText);
            }
        });
    }

    function addButton() {
        if (document.getElementById("discord-send-link") === null) {
            const discordButton = `
<a role="button" aria-labelledby="discord-send" class="discord-send t-clear h c-pointer m-icon line-h24 right last" href="#" style="padding-left: 10px; padding-right: 10px" id="discord-send-link">
    <span id="discord-send" style="color:#666666">Request Money</span>
</a>`;
            const target = document.getElementById("top-page-links-button");
            if (target !== null) {
                target.insertAdjacentHTML('beforebegin', discordButton);
            }
        }
    }

    addButton();

document.getElementById("discord-send-link").addEventListener("click", function(event) {
    event.preventDefault();

    let PlayerName = "";

    try {
        const uid = getCookie('uid');
        const data = JSON.parse(sessionStorage.getItem('sidebarData' + uid));
        if (data && data.user) {
            PlayerName = `${data.user.name} [${uid}]`;
        } else {
            alert('Error getting player information');
            return;
        }
    } catch (error) {
        alert('Error getting player information');
        return;
    }

    let amount = prompt("Please enter the amount:", "");

    // Check if the amount is a valid number
    if (isNaN(amount)) {
        alert('Please enter a valid number.');
        return;
    }

    // Format the amount with spaces as separators
    amount = parseFloat(amount).toLocaleString('en-US', { maximumFractionDigits: 0 }).replace(/,/g, ' ');

    if (amount !== null) {
        sendToServer(PlayerName, amount);
    }
});

})();
