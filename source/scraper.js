const _ = require("lodash");
const axios = require("axios");
const cheerio = require("cheerio");

const fetchHtml = async function (url) {
	url = url.replace(/^(https?:)?\/\//, "https://"); // enforce HTTPS

	return await axios
		.get(url)
		.then(response => response.data)
		.catch(error => {
			error.status = (error.response && error.response.status) || 500;
			throw error;
		});
}

const scrapeUrl = async function (url, extract) {
	const result = await fetchHtml(url);
	const $ = cheerio.load(result);

	if (_.isFunction(extract)) {
		return extract($);
	}

	if (_.isObject(extract)) {
		return _.mapValues(extract, (fn) => {
			return fn($);
		});
	}

	return $;
};

module.exports = {
	fetchHtml,
	scrapeUrl
};
