const { getRandomNewsUrl } = require('./get-random-url.js');
const { fetchHtml } = require('./utilities.js');

async function printVocabulary() {
    const url = await getRandomNewsUrl();
    const html = await fetchHtml(url);

    console.log(url);

    const uniqueIds = extractUniqueMatchingIds(html);

    for (let i = 0; i < uniqueIds.length; i++) {
        const id = uniqueIds[i];
        const word = extractWordForId(html, id);

        if (word) {
            console.log('Word ' + (i + 1) + ': ' + word);
        } else {
            console.log('Could not retrieve word for ID ' + id);
        }
    }

    const wordPronunciationMap = createWordPronunciationMap(html, uniqueIds);
    console.log("Word-Pronunciation Map: " + JSON.stringify(wordPronunciationMap));
}

function createWordPronunciationMap(html, ids) {
    const wordPronunciationMap = {};

    for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const wordHtml = extractWordHtmlForId(html, id);
        const rtMatches = extractRtMatches(wordHtml);
        const combinedRtMatches = rtMatches.length > 0 ? rtMatches.join('、') : null;
        const word = wordHtml.replace(/<rt>.*?<\/rt>/g, '').replace(/<[^>]*>/g, '').trim();

        if (word) {
            wordPronunciationMap[word] = combinedRtMatches ? [combinedRtMatches] : [];
        }
    }

    return wordPronunciationMap;
}

function extractWordHtmlForId(html, id) {
    const wordPattern = new RegExp('<a href="javascript:void\\(0\\)" class="dicWin" id="' + id + '">(.*?)<\/a>', 'g');
    const wordMatch = wordPattern.exec(html);

    return wordMatch ? wordMatch[1] : null;
}

function extractUniqueMatchingIds(html) {
    const pattern = /id="(RSHOK-[^"]*)"/g;
    let match;
    const uniqueMatchingIds = new Set();

    while (match = pattern.exec(html)) {
        const id = match[1];
        uniqueMatchingIds.add(id);
    }

    return Array.from(uniqueMatchingIds);
}

function extractWordForId(html, id) {
    const wordPattern = new RegExp('<a href="javascript:void\\(0\\)" class="dicWin" id="' + id + '">(.*?)<\/a>', 'g');
    const wordMatch = wordPattern.exec(html);

    if (wordMatch) {
        const wordHtml = wordMatch[1];
        let word = wordHtml.replace(/<[^>]*>/g, '');
        const rtMatches = extractRtMatches(wordHtml);

        if (rtMatches.length > 0) {
            const combinedRtMatches = rtMatches.join('、');
            word = wordHtml.replace(/<rt>.*?<\/rt>/g, '');
            word = word.replace(/<[^>]*>/g, '');
            word = word.trim() + ' (' + combinedRtMatches + ')';
        }

        word = word.replace(/（/g, '(').replace(/）/g, ')');
        return word;
    } else {
        return null;
    }
}

function extractRtMatches(wordHtml) {
    const rtPattern = /<rt>(.*?)<\/rt>/g;
    const rtMatches = [];
    let rtMatch;

    while (rtMatch = rtPattern.exec(wordHtml)) {
        rtMatches.push(rtMatch[1]);
    }

    return rtMatches;
}

if (require.main === module) {
    printVocabulary();
}
