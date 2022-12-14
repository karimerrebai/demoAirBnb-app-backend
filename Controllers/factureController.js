const Facture = require('../Models/Facture')
const Lodge = require('../Models/Lodge')
const Reservation = require('../Models/Reservation')
countFacture = async (req, res) => {
  const nights = req.body.nights
  const price = req.body.price
  const sum = await nights * price
  res.status(200).json({
    data: sum, msg: 'price of nights '
  })
  res.status(404).json({ msg: 'failed ' })
}

addFacture = async (req, res) => {
  try {
    const facture = new Facture(req.body)
    await facture.save()
    res.status(200).json({ data: facture, msg: 'facture created ' })


  } catch (error) {
    res.status(404).json({
      message: 'failed to create a facture ' + error.message
    })

  }
}
getAllFactures = async (req, res) => {
  const facture = await Facture.find({})
  res.status(200).json({
    msg: 'all categories',
    data: facture
  })
}


getFactureByid = async (req, res) => {
  const facture = await Facture.findById({ _id: req.params.id })
  res.status(200).json({ data: facture, msg: 'facture by id' })
}
updateFacture = async (req, res) => {
  const facture = await Facture.findByIdAndUpdate({ _id: req.params.id }, req.body)
  res.status(200).json({
    msg: 'facture updated '
  })
}
deleteFacture = async (req, res) => {
  const deletedFacture = await Facture.findByIdAndRemove({ _id: req.params.id })
  res.status(200).json({
    msg: 'deleted successfully '
  })
}

module.exports = {
  addFacture, deleteFacture, updateFacture, getFactureByid, getAllFactures, countFacture
}