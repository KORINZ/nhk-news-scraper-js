function fetchHtml(url, retryAttempts = 5) {
    return new Promise(async (resolve, reject) => {
        let html = '';
        let error = null;
        for (let i = 0; i < retryAttempts; i++) {
            try {
                const response = await fetch(url);
                html = await response.text();
                break;
            } catch (e) {
                error = e;
                console.log(`Attempt ${i + 1} failed: ${e.message}`);
                await new Promise(r => setTimeout(r, 1000)); // Wait for 1 second before retrying
            }
        }

        if (html === '' && error !== null) {
            console.log(`Error fetching HTML from URL: ${url}`);
            console.log(`Error message: ${error.message}`);
            reject(null);
        } else {
            resolve(html);
        }
    });
}

module.exports = {
    fetchHtml
};
