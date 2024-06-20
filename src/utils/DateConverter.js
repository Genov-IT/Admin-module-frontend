// datetimeUtils.js

/**
 * Convert UTC date to Kolkata (Indian Standard Time, IST) and format it.
 * @param {string | number | Date} utcDate UTC date
 * @returns {string} Formatted date in Kolkata time
 */
function convertAndFormatToKolkataTime(utcDate) {
    const utcTime = new Date(utcDate);
    const options = { timeZone: 'Asia/Kolkata' };
    const kolkataTime = new Date(utcTime.toLocaleString('en-US', options));
    // Format the date as needed (adjust format according to your requirements)
    return kolkataTime.toLocaleString();
}

module.exports = {
    convertAndFormatToKolkataTime
};
