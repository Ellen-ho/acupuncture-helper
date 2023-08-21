const express = require("express");
const router = express.Router();
const Patient = require("../../models/patient");
const Record = require("../../models/record");

router.get("/:id", (req, res) => {
  const _id = req.params.id;
  return Record.findOne({ _id })
    .lean()
    .then(async (result) => {
      try {
        const patient = await Patient.findById(result.patientId).lean();
        const patientName = patient ? patient.name : "Unknown";
        const recordWithPatientName = {
          ...result,
          patientName,
        };
        console.log(recordWithPatientName);
        return res.render("recordDetail", { recordWithPatientName });
      } catch (error) {
        console.error(error);
      }
    });
});

router.delete("/:id", (req, res) => {
  const _id = req.params.id;
  return Record.findOne({ _id })
    .then((Record) => Record.remove())
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

module.exports = router;

function sumRecordsAmount(records) {
  let totalAmount = 0;

  records.forEach((r) => {
    totalAmount = totalAmount + r.amount;
  });

  return totalAmount;
}

function convertTimeFieldsToLocalTime(records) {
  return records.map((record) =>
    timeFieldsConvertor(record, ["date", "startAt", "endAt"])
  );
}
