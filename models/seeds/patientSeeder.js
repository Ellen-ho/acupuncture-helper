const db = require('../../config/mongoose')
const Patient = require('../patient')
const LocationCategory = require('../locationCategory')

const SEED_PATIENT = [
  {
    chartNo: '111',
    name: '王大明',
    gender: "Male",
    age: 38,
    wardNumber: '606',
    locationCategory: 'inpatientA'
  },
  {
    chartNo: '222',
    name: '許小芬',
    gender: "Female",
    age: 28,
    wardNumber: '305',
    locationCategory: 'postpartum'
  },
  {
    chartNo: '333',
    name: '翁添文',
    gender: "Male",
    age: 60,
    wardNumber: '203',
    locationCategory: 'rcw'
  }
]

db.once('open', async () => {
  console.log('start patient seeder!')
  const locationCategories = await LocationCategory.find()
  const locationCategoryIdMapping = locationCategories.reduce((prev, curr) => {
    return {
      ...prev,
      [curr.locationCategory]: curr._id
    }
  }, {})

  Promise.all(SEED_PATIENT.map((patient) => {
    return Patient.create({
      chartNo: patient.chartNo,
      name: patient.name,
      gender: patient.gender,
      age: patient.age,
      wardNumber: patient.wardNumber,
      locationCategoryId: locationCategoryIdMapping[patient.locationCategory]
    })
  }))
    .then(() => {
      console.log('patient seeder done')
      db.close()
    })
    .catch(console.error)
    .finally(() => process.exit())
})
