const express = require("express");
const router = express.Router();
const LocationCategory = require("../../models/locationCategory");
const Patient = require("../../models/patient");
const Record = require("../../models/record");
const dayjs = require("dayjs");
const timeFieldsConvertor = require("../../utils/timeFieldsConvertor");
const toLocalTimezone = require("../../utils/toLocalTimezone");

router.get("/", async (req, res) => {
  const currentLocationCategoryId =
    req.query.currentLocationCategoryId || "all";
  const searchConditions =
    currentLocationCategoryId !== "all"
      ? {
          locationCategoryId: currentLocationCategoryId,
        }
      : {};

  Promise.all([
    LocationCategory.find().lean(),
    Patient.find(searchConditions).lean().sort({ chartNo: "asc" }),
    Record.find({
      date: dayjs().format("YYYY-MM-DD"),
    }).lean(),
  ])
    .then((results) => {
      const [locationCategories, patients, todayRecords] = results;
      console.log(results);

      const patientsWithLocationCategoryName = patients.map((patient) => {
        const locationCategory = locationCategories.find(
          (category) =>
            category._id.toString() === patient.locationCategoryId.toString()
        );

        const locationCategoryName = locationCategory
          ? locationCategory.locationCategoryName
          : "Unknown";

        return {
          ...patient,
          locationCategoryName,
        };
      });

      const todayRecordsWithLocalTime =
        convertTimeFieldsToLocalTime(todayRecords);

      // 原始records
      const originalRecords = todayRecordsWithLocalTime;

      const updatedRecords = originalRecords.map((record) => {
        const updatedRecord = { ...record };

        // 转换日期格式为 "YYYY-MM-DD"
        updatedRecord.date = dayjs(record.date).format("YYYY-MM-DD");

        // 转换时间格式为 "HH:mm:ss"
        updatedRecord.formattedStartAt = dayjs(record.startAt).format(
          "HH:mm:ss"
        );
        updatedRecord.formattedEndAt = dayjs(record.endAt).format("HH:mm:ss");

        return updatedRecord;
      });

      const patientsWithRecord = attachTodayRecords(
        patientsWithLocationCategoryName,
        updatedRecords
      );

      let currentLocationCategoryName;
      let chooseLocationCategories;
      if (currentLocationCategoryId === "all") {
        chooseLocationCategories = locationCategories;
      } else {
        currentLocationCategoryName = getLocationCategoryInfoById(
          currentLocationCategoryId,
          locationCategories
        ).locationCategoryName;
        //去掉目前的選項
        chooseLocationCategories = locationCategories.filter((item) => {
          return item._id.toString() !== currentLocationCategoryId;
        });
      }

      return res.render("index", {
        locationCategories: chooseLocationCategories,
        currentLocationCategoryName,
        patients: patientsWithRecord,
        currentDate: dayjs(toLocalTimezone(dayjs().toISOString())).format(
          "YYYY-MM-DD"
        ),
      });
    })
    .catch((error) => console.log(error));
});

module.exports = router;

function getLocationCategoryInfoById(locationCategoryId, locationCategories) {
  return locationCategories.find((locationCategory) => {
    return locationCategory._id.toString() === locationCategoryId;
  });
}

function attachTodayRecords(patients, todayRecords) {
  return patients.map((patient) => {
    const record = todayRecords.find(
      (record) => record.patientId.toString() === patient._id.toString()
    );
    return {
      ...patient,
      record,
    };
  });
}

function convertTimeFieldsToLocalTime(records) {
  return records.map((record) =>
    timeFieldsConvertor(record, ["date", "startAt", "endAt"])
  );
}

function addLocationCategoryInfo(patients, categories) {
  const newRecord = records.map((record) => {
    const targetCategory = getCategoryInfoById(
      record.categoryId.toString(),
      categories
    );
    return {
      ...record,
      icon: targetCategory.icon,
    };
  });

  return newRecord;
}
