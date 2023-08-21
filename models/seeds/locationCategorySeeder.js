const db = require("../../config/mongoose");
const LocationCategory = require("../locationCategory");

db.once("open", () => {
  console.log("start locationCategory seeder!");

  LocationCategory.create(
    {
      locationCategory: "emergency",
      locationCategoryName: "Emergency Service Building",
    },
    {
      locationCategory: "inpatientA",
      locationCategoryName: "Inpatient Building A",
    },
    {
      locationCategory: "inpatientB",
      locationCategoryName: "Inpatient Building B",
    },
    {
      locationCategory: "rcw",
      locationCategoryName: "Respiratory Care Ward",
    },
    {
      locationCategory: "icu",
      locationCategoryName: "Intensive Care Unit",
    },
    {
      locationCategory: "hospice",
      locationCategoryName: "Hospice",
    },
    {
      locationCategory: "hemodialysis",
      locationCategoryName: "Hemodialysis Center",
    },
    {
      locationCategory: "postpartum",
      locationCategoryName: "Postpartum Patient Center",
    }
  )
    .then(() => {
      console.log("locationCategory seeder done");
      db.close();
    })
    .catch(console.error)
    .finally(() => process.exit());
});
