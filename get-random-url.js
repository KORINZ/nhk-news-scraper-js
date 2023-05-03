const { fetchHtml } = require('./utilities.js');

function printRandomNewsUrl() {
    getRandomNewsUrl().then((newsUrl) => {
        console.log(newsUrl);
    });
}

function getRandomNewsUrl() {
    return new Promise(async (resolve, reject) => {
        let attempt = 0;
        const maxAttempts = 4;

        while (attempt < maxAttempts) {
            const randomId = await getRandomNewsId();
            const newsHtmlUrl = `https://www3.nhk.or.jp/news/easy/${randomId}/${randomId}.html`;
            const html = await fetchHtml(newsHtmlUrl);
            const uniqueIds = extractUniqueMatchingIds(html);
            const wordCount = uniqueIds.length;

            if (wordCount >= 3) {
                resolve(newsHtmlUrl);
            }

            attempt++;
        }

        reject(null);
    });
}

function getRandomNewsId() {
    return new Promise(async (resolve, reject) => {
        const newsListUrl = 'https://www3.nhk.or.jp/news/easy/top-list.json';
        const jsonFile = await fetchHtml(newsListUrl)
        const newsList = JSON.parse(jsonFile);

        const newsIds = [];
        for (let i = 0; i < 4; i++) {
            const article = newsList[i];
            newsIds.push(article.news_id);
        }

        const randomIndex = Math.floor(Math.random() * newsIds.length);
        const randomId = newsIds[randomIndex];
        resolve(randomId);
    });
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

module.exports = {
    getRandomNewsUrl
};

if (require.main === module) {
    printRandomNewsUrl();
}
