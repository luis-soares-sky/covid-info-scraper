const _ = require("lodash");

const extractCovidNumbers = ($) => {
	return {
		cases: sanitizeNumber($('.maincounter-number').eq(0).text()),
		deaths: sanitizeNumber($('.maincounter-number').eq(1).text()),
		recoveries: sanitizeNumber($('.maincounter-number').eq(2).text())
	}
};

const sanitizeNumber = (number) => {
	if (_.isString(number)) return parseFloat(number.replace(/[^0-9-.]/g, ""));
	if (_.isNumber(number)) return number;
	return null;
};

module.exports = {
	extractCovidNumbers,
	sanitizeNumber
};
