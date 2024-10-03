const express = require("express");
const router = express.Router();
const Patient = require("../../models/patient");
const Record = require("../../models/record");
const LocationCategory = require("../../models/locationCategory");
const dayjs = require("dayjs");
const timeFieldsConvertor = require("../../utils/timeFieldsConvertor");
const toLocalTimezone = require("../../utils/toLocalTimezone");

// 取得newPatient頁面(新增頁面用)
router.get("/new", (req, res) => {
  LocationCategory.find()
    .lean()
    .sort({ _id: "asc" })
    .then((locationCategories) => {
      return res.render("newPatient", { locationCategories });
    })
    .catch((error) => console.log(error));
});

router.get("/check-chart-no", async (req, res) => {
  const { chartNo } = req.query;

  try {
    const existingPatient = await Patient.findOne({ chartNo });
    if (existingPatient) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 新增患者，後導回 patients/list頁面
router.post("/new", (req, res) => {
  const newPatient = req.body;
  return Patient.create({ ...newPatient })
    .then(() => res.redirect("/patients/list"))
    .catch((error) => console.log(error));
});

//瀏覽patient list
router.get("/list", async (req, res) => {
  try {
    const patients = await Patient.find().lean().sort({ chartNo: "asc" });
    return res.render("patientList", { patients });
  } catch (error) {
    console.log(error);
  }
});

//瀏覽某個 patient 的 recordList
router.get("/:id/recordList", (req, res) => {
  const patientId = req.params.id;
  Promise.all([
    Patient.findOne({ _id: patientId }).lean(),
    Record.find({ patientId }).lean().sort({ date: "desc" }),
  ])
    .then((results) => {
      const [patient, recordList] = results;

      const recordsWithLocalTime = convertTimeFieldsToLocalTime(recordList);

      const originalRecords = recordsWithLocalTime;

      const updatedRecords = originalRecords.map((record) => {
        const updatedRecord = { ...record };
        updatedRecord.date = dayjs(record.date).format("YYYY-MM-DD");
        updatedRecord.formattedStartAt = dayjs(record.startAt).format(
          "HH:mm:ss"
        );
        updatedRecord.formattedEndAt = dayjs(record.endAt).format("HH:mm:ss");

        return updatedRecord;
      });

      return res.render("recordList", { patient, updatedRecords });
    })
    .catch((error) => console.log(error));
});

//刪除某個患者，後導回 patients/list 頁面
router.delete("/:id", (req, res) => {
  const _id = req.params.id;
  return Patient.findOne({ _id })
    .then((Patient) => Patient.remove())
    .then(() => res.redirect("/patients/list"))
    .catch((error) => console.log(error));
});

// 取得新增某個 patient's record 的頁面
router.get("/:id/records/new", async (req, res) => {
  try {
    const patientId = req.params.id;
    const patient = await Patient.findOne({ _id: patientId }).lean();
    return res.render("newRecord", { patient });
  } catch (error) {
    console.log(error);
  }
});

// 確認新增某個 patient's record ，後導回首頁(當天記針實況)
router.post("/:id/records/new", async (req, res) => {
  try {
    const patientId = req.params.id;
    const patient = await Patient.findOne({ _id: patientId }).lean();
    const newRecord = req.body;
    await Record.create({
      ...newRecord,
      isCompleted: false,
      totalAmount: getTotalAmount(newRecord),
      patientId: patient._id,
      startAt: dayjs(),
      endAt: dayjs().add(15, "minute"),
    });
    return res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

// 修改某個 patient 的某一筆 record 的 isComplete 狀態，後導回首頁(當天記針實況)
router.put("/:patientId/records/:recordId/complete", async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const recordId = req.params.recordId;
    const condition = { _id: recordId };
    const update = { isCompleted: true };
    const result = await Record.updateOne(condition, update);
    return res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

// 取得修改某個 patient 的頁面
router.get("/:id", (req, res) => {
  const _id = req.params.id;
  Promise.all([
    LocationCategory.find().lean().sort({ _id: "asc" }),
    Patient.findOne({ _id }).lean(),
  ])
    .then((results) => {
      return res.render("editPatient", {
        patient: results[1],
        locationCategories: results[0],
      });
    })
    .catch((error) => console.log(error));
});

// 修改某個 patient 的資料，後導回 patients/list 頁面
router.put("/:id", (req, res) => {
  const _id = req.params.id;
  return Patient.findOne({ _id })
    .then((patient) => {
      results = Object.assign(patient, req.body);
      return patient.save();
    })
    .then(() => res.redirect("/patients/list"))
    .catch((error) => console.log(error));
});

module.exports = router;

function getTotalAmount(myObject) {
  const keyToDelete = "date";
  const { [keyToDelete]: deletedKey, ...remainingObject } = myObject;
  let totalAmount = 0;
  for (const key in remainingObject) {
    totalAmount += Number(remainingObject[key]);
  }
  return totalAmount;
}

function convertTimeFieldsToLocalTime(records) {
  return records.map((record) =>
    timeFieldsConvertor(record, ["date", "startAt", "endAt"])
  );
}
