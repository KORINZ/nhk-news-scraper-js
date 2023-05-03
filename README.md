# NHK News Scraper

This repository contains a set of JavaScript functions that can be used to scrape NHK News Easy articles and extract useful information such as vocabulary, pronunciations, titles, dates, and content.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Features

- Fetch a random news article URL
- Print vocabulary and pronunciations from a news article
- Print the title, date, and content of a news article
- Print dictionary entries for words in a news article

## Installation

1. Clone this repository:

```bash
git clone https://github.com/KORINZ/nhk-news-scraper.git
```

2. Change to the project directory:

```bash
cd nhk-news-scraper
```

3. Install the required dependencies:

```bash
npm install
```

## Usage

1. Import the functions from the respective JavaScript files into your main script.

```javascript
const { getRandomNewsUrl, fetchHtml } = require('./utilities.js');
const { printVocabulary } = require('./printVocabulary.js');
const { printNewsArticleContent } = require('./printNewsArticleContent.js');
const { printDictEntries } = require('./printDictEntries.js');
```

2. Use the functions in your main script:

```javascript
(async () => {
  // Example usage: Print a random news article URL
  const randomNewsUrl = await getRandomNewsUrl();
  console.log(randomNewsUrl);

  // Example usage: Print vocabulary and pronunciations from a news article
  await printVocabulary(randomNewsUrl);

  // Example usage: Print the title, date, and content of a news article
  await printNewsArticleContent(randomNewsUrl);

  // Example usage: Print dictionary entries for words in a news article
  await printDictEntries(randomNewsUrl);
})();
```

## License

This project is released under the [MIT License](LICENSE).
