const mongoose = require('mongoose')

const titleSchema = mongoose.Schema({ 
    title: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    season: { type: Number, required: false },
    episodesTotal: { type: Number, required: false },
    episodesWatched: { type: Number, required: false },
    progressPct: { type: Number, required: false },
    poster: { type: String, required: false},
    hue: { type: Number, required: true }
})

titleSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Title', titleSchema)