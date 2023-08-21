const toLocalTimezone = require("./toLocalTimezone");

const timeFieldsConvertor = (originalObject, targetFields) => {
  const convertedObject = { ...originalObject };

  for (let field of targetFields) {
    convertedObject[field] = toLocalTimezone(convertedObject[field]);
  }

  return convertedObject;
};

module.exports = timeFieldsConvertor;
