const { getRandomNewsUrl } = require('./get-random-url.js');
const { fetchHtml } = require('./utilities.js');

async function printDictEntries() {
    // Get a random news url object
    const url = await getRandomNewsUrl();
    const dictUrl = url.replace("html", "out.dic");

    console.log(url);

    // Fetch the HTML for the dictionary data
    const html = await fetchHtml(dictUrl);

    // Parse the HTML as JSON
    const data = JSON.parse(html);

    // Extract the dictionary entries from the data
    const dictEntries = data.reikai.entries;

    // Log the number of words found in the dictionary
    const wordCount = Object.keys(dictEntries).length;
    console.log(`Number of words: ${wordCount}`);

    // Loop over each entry and log the word and its definitions
    for (const entryKey in dictEntries) {
        const entries = dictEntries[entryKey];
        const word = getDictWord(entries);
        const defs = getDictDefs(entries);
        console.log(`${word}: ${defs}`);
    }
}

// Extracts the word from the dictionary entry
function getDictWord(entries) {
    return entries[0].hyouki[0];
}

// Extracts the definitions from the dictionary entry
function getDictDefs(entries) {
    return entries.map((entry, i) => {
        const defs = entry.def.replace(/<rt>.*?<\/rt>|<[^>]+>/g, '');
        return `${toRoman(i + 1)}) ${defs}`;
    }).join('');
}

// Helper function to convert a number to a Roman numeral (assumes the number will not exceed 15)
function toRoman(num) {
    const romanMap = [
        { value: 15, symbol: 'xv' },
        { value: 14, symbol: 'xiv' },
        { value: 13, symbol: 'xiii' },
        { value: 12, symbol: 'xii' },
        { value: 11, symbol: 'xi' },
        { value: 10, symbol: 'x' },
        { value: 9, symbol: 'ix' },
        { value: 5, symbol: 'v' },
        { value: 4, symbol: 'iv' },
        { value: 1, symbol: 'i' },
    ];

    let roman = '';

    for (const { value, symbol } of romanMap) {
        while (num >= value) {
            roman += symbol;
            num -= value;
        }
    }

    return roman;
}

if (require.main === module) {
    printDictEntries();
}
