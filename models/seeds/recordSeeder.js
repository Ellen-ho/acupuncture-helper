const db = require("../../config/mongoose");
const Record = require("../record");
const Patient = require("../patient");

const SEED_RECORD = [
  {
    chartNo: "111",
    date: "2019-10-18",
    startAt: "Tue Oct 18 2019 8:10:49",
    endAt: "Tue Oct 18 2019 8:25:49",
    isCompleted: false,
    headAmount: 3,
    neckAndShoulderAmount: 3,
    leftHandAmount: 3,
    rightHandAmount: 3,
    lowerBackAmount: 3,
    abdomenAmount: 3,
    buttocksAmount: 3,
    leftLegAmount: 3,
    rightLegAmount: 3,
    soleAmount: 1,
    totalAmount: 28,
  },
  {
    chartNo: "222",
    date: "2019-10-18",
    startAt: "Tue Oct 18 2019 8:30:49",
    endAt: "Tue Oct 18 2019 8:45:49",
    isCompleted: false,
    headAmount: 3,
    neckAndShoulderAmount: 3,
    leftHandAmount: 3,
    rightHandAmount: 3,
    lowerBackAmount: 3,
    abdomenAmount: 3,
    buttocksAmount: 3,
    leftLegAmount: 3,
    rightLegAmount: 3,
    soleAmount: 1,
    totalAmount: 28,
  },
  {
    chartNo: "333",
    date: "2019-10-18",
    startAt: "Tue Oct 18 2019 8:50:49",
    endAt: "Tue Oct 18 2019 9:10:49",
    isCompleted: false,
    headAmount: 3,
    neckAndShoulderAmount: 3,
    leftHandAmount: 3,
    rightHandAmount: 3,
    lowerBackAmount: 3,
    abdomenAmount: 3,
    buttocksAmount: 3,
    leftLegAmount: 3,
    rightLegAmount: 3,
    soleAmount: 1,
    totalAmount: 28,
  },
];

db.once("open", async () => {
  try {
    // 建立與 Patient 相關聯的記錄
    for (const seedRecord of SEED_RECORD) {
      const patient = await Patient.findOne({ chartNo: seedRecord.chartNo });

      if (patient) {
        const recordData = {
          ...seedRecord,
          patientId: patient._id, // 使用 Patient 的 _id 作為關聯
        };

        await Record.create(recordData);
      }
    }

    console.log("Record seeder done");
  } catch (error) {
    console.error("Error seeding records:", error);
  } finally {
    db.close();
    process.exit();
  }
});
