// Dictionary will be loaded from Pastebin
let wordToImage = {};
let imageCache = new Map(); // Cache for image dimensions

// Fetch and update the dictionary
async function fetchDictionaryFromPastebin() {
    const cacheBuster = Date.now()
    const pastebinUrl = `https://corsproxy.io/?url=https://pastebin.com/raw/u2Lj4gfC?cache=${cacheBuster}`; // Replace with your Pastebin URL
    console.log("Fetching dictionary from Pastebin with cache-busting:", pastebinUrl);
    
    try {
        const response = await fetch(pastebinUrl);
        console.log("Pastebin response status:", response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        
        const text = await response.text();
        console.log("Pastebin response text:", text);
        return { success: true, data: text };
    } catch (error) {
        console.error("Error fetching dictionary from Pastebin:", error);
        return { success: false, error: error.message };
    }
}

async function updateDictionary() {
    try {
        console.log("Starting dictionary update...");
        
        // Fetch dictionary from Pastebin
        const response = await fetchDictionaryFromPastebin();
        console.log("Response from fetchDictionaryFromPastebin:", response);
        
        if (!response.success) {
            throw new Error(response.error || 'Failed to fetch dictionary');
        }
        
        const text = response.data;
        console.log("Raw response data:", text);
        
        try {
            // Extract just the object part from the text
            const objectMatch = text.match(/\{[\s\S]*\}/);
            if (!objectMatch) {
                throw new Error('Could not find object in response');
            }
            
            // Parse the object directly
            const newDict = JSON.parse(objectMatch[0].replace(/'/g, '"'));
            console.log("Parsed dictionary:", newDict);
            
            if (typeof newDict === 'object' && newDict !== null) {
                wordToImage = newDict;
                console.log('Dictionary updated successfully. Available words:', Object.keys(wordToImage));
                
                // Check if "test" is in the dictionary
                if ("test" in wordToImage) {
                    console.log('Keyword "test" found in dictionary:', wordToImage["test"]);
                } else {
                    console.log('Keyword "test" NOT found in dictionary');
                }
            } else {
                throw new Error('Dictionary parsing did not return an object');
            }
        } catch (parseError) {
            console.log('Parse error:', parseError);
            // If parse fails, use default values
            wordToImage = {
                'fuel': 'https://i.postimg.cc/wM7cWVd3/Untitled-5.png',
                'nofuel': 'https://i.postimg.cc/c43fr61q/NoFuel.png',
                '8kintel': 'https://i.postimg.cc/vMf5Rq2D/8kintel.png',
                'sniping': 'https://i.postimg.cc/4NnJXFGn/sniping.png',
                'FuelWar': 'https://i.imgur.com/L6kG6S4.jpeg',
                'Fuelium': 'https://i.imgur.com/wBdgjHQ.png',
                'FuelFocus': 'https://i.imgur.com/fmgNiic.jpeg'
            };
        }
    } catch (error) {
        console.log('Error updating dictionary:', error);
    }
}

// Function to get image dimensions
function getImageDimensions(url) {
    return new Promise((resolve) => {
        if (imageCache.has(url)) {
            resolve(imageCache.get(url));
            return;
        }

        const img = new Image();
        img.onload = () => {
            const aspectRatio = img.width / img.height;
            // Scale the image while maintaining aspect ratio
            const height = Math.min(32, img.height);
            const width = height * aspectRatio;
            const dimensions = { 
                width: Math.round(width), 
                height: Math.round(height) 
            };
            imageCache.set(url, dimensions);
            resolve(dimensions);
        };
        img.onerror = () => {
            // Default dimensions on error
            const dimensions = { width: 32, height: 32 };
            imageCache.set(url, dimensions);
            resolve(dimensions);
        };
        img.src = url;
    });
}

// Function to replace text with images
function replaceText(node) {
    // Skip if node is inside the chat input
    if (node.closest && (
        node.closest('[data-a-target="chat-input"]') || 
        node.closest('[data-test-selector="chat-input"]') ||
        node.closest('.chat-input') ||
        node.closest('textarea')
    )) {
        return;
    }

    if (node.nodeType === Node.TEXT_NODE) {
        let text = node.textContent;
        let changed = false;
        let promises = [];
        
        for (let word in wordToImage) {
            const regex = new RegExp(`\\b${word}\\b`, 'gi'); 
            if (regex.test(text)) {
                changed = true;
                console.log(`Found match for: ${word}`);
                console.log('Current dictionary:', wordToImage);
                
                // Create promise for getting image dimensions
                const promise = getImageDimensions(wordToImage[word]).then(dimensions => {
                    text = text.replace(regex, (match) => {
                        const img = document.createElement('img');
                        img.src = wordToImage[word];
                        img.style.display = 'inline';
                        img.style.verticalAlign = 'middle';
                        img.style.width = `${dimensions.width}px`;
                        img.style.height = `${dimensions.height}px`;
                        img.title = word; 
                        return img.outerHTML;
                    });
                });
                
                promises.push(promise);
            }
        }
        
        if (changed) {
            Promise.all(promises).then(() => {
                const span = document.createElement('span');
                span.innerHTML = text;
                if (node.parentNode) {
                    node.parentNode.replaceChild(span, node);
                }
            });
        }
    } else {
        const childNodes = Array.from(node.childNodes);
        childNodes.forEach(child => replaceText(child));
    }
}

// Start the observer
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 || node.nodeType === 3) {
                replaceText(node);
            }
        });
    });
});

// Configure and start the observer
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Initial page scan
replaceText(document.body);

// Wait for page to load before setting up
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, initializing OnlyFuel');
});

// Update dictionary every 5 minutes
setInterval(updateDictionary, 5 * 60 * 1000);

// Initial dictionary update
updateDictionary();
