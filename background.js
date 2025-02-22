// Background script with hardcoded dictionary
const DEFAULT_DICTIONARY = {
    'fuel': 'https://i.postimg.cc/wM7cWVd3/Untitled-5.png',
    'nofuel': 'https://i.postimg.cc/c43fr61q/NoFuel.png',
    '8kintel': 'https://i.postimg.cc/vMf5Rq2D/8kintel.png',
    'sniping': 'https://i.postimg.cc/4NnJXFGn/sniping.png',
    'FuelWar': 'https://i.postimg.cc/Y0T251hd/fuelwar.png',
    'Fuelium': 'https://i.imgur.com/wBdgjHQ.png',
    'FuelFocus': 'https://i.imgur.com/fmgNiic.jpeg',
    'eyes': 'https://i.imgur.com/sGqIF1o.jpeg'
};

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fetchDictionary') {
        // Return the hardcoded dictionary immediately
        sendResponse({ 
            success: true, 
            data: JSON.stringify(DEFAULT_DICTIONARY)
        });
        return true;
    }
});
