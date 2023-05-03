const { getRandomNewsUrl } = require('./get-random-url.js');
const { fetchHtml } = require('./utilities.js');

async function printNewsArticleContent() {
    // Fetch the HTML content of the webpage
    const url = await getRandomNewsUrl();
    const html = await fetchHtml(url);

    // Extract the title, date, and article content from the HTML
    const title = extractTitle(html);
    const date = extractDate(html);
    const articleContent = extractArticleContent(html);

    // Log the extracted information
    console.log(url);
    console.log(title);
    console.log(date);
    console.log(articleContent);
}

// Extract the title from the HTML content
function extractTitle(html) {
    const titleMatch = html.match(/<h1[^>]*class="article-main__title"[^>]*>((.|\n)*?)<\/h1>/i);
    return titleMatch ? titleMatch[1].trim().replace(/<ruby>(.*?)<rt>.*?<\/rt><\/ruby>/g, '$1') : "Title not found";
}

// Extract the date from the HTML content
function extractDate(html) {
    const dateMatch = html.match(/<p[^>]*class="article-main__date"[^>]*>(.*?)<\/p>/i);
    return dateMatch ? dateMatch[1] : "Date not found";
}

// Extract the article content from the HTML content
function extractArticleContent(html) {
    // Remove the playerWrapper div from the HTML content (video player element)
    html = html.replace(/<div class="playerWrapper"[^>]*>((.|\n)*?)<\/div>/i, '');

    // Extract the article body from the HTML content
    const articleMatch = html.match(/<div[^>]*class="article-main__body article-body"[^>]*>((.|\n)*?)<\/div>/i);

    if (articleMatch) {
        const articleBody = articleMatch[1];
        const paragraphs = articleBody.match(/<p[^>]*>(.*?)<\/p>/gi);
        let articleContent = "";

        // Clean up each paragraph and add it to the article content
        paragraphs.forEach(function (paragraph, index) {
            const cleanedParagraph = paragraph.replace(/<ruby>(.*?)<rt>.*?<\/rt><\/ruby>/g, '$1').replace(/<[^>]*>/g, "");
            articleContent += cleanedParagraph;
            if (index < paragraphs.length - 1) {
                articleContent += "\n\n";
            }
        });

        return articleContent;
    } else {
        return "Article content not found";
    }
}

if (require.main === module) {
    printNewsArticleContent();
}
