const dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin

dayjs.extend(utc);
dayjs.extend(timezone);

const DEFAULT_TIME_ZONE = "Asia/Taipei";
const DEFAULT_FORMAT_DATE_TIME = "YYYY-MM-DD HH:mm:ss.SSS";

const toLocalTimezone = (utcTime) => {
  const convertedTime = dayjs(utcTime)
    .tz(DEFAULT_TIME_ZONE)
    .format(DEFAULT_FORMAT_DATE_TIME);

  return convertedTime;
};

module.exports = toLocalTimezone;
