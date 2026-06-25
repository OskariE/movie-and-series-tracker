const localRouter = require('express').Router()
const Title = require('../models/title')

localRouter.get('/', async (request, response) => {
  const titles = await Title.find({})
  response.json(titles)
})

localRouter.post('/', async (request, response) => {
  const body = request.body
  const title = new Title({
    title: body.title,
    type: body.type,
    status: body.status,
    episodesTotal: body.episodesTotal,
    episodesWatched: body.episodesWatched,
    progressPct: body.progressPct,
    poster: body.poster,
    hue: Math.floor(Math.random() * 360)
  })

  const savedTitle = await title.save()
  console.log("saved title: ",savedTitle)
  response.json(savedTitle)
})

localRouter.get('/:id', async (request, response) => {
  const title = await Title.findById(request.params.id)
  if (title) {
    response.json(title)
  } else {
    response.status(404).end()
  }
})

localRouter.put('/:id', async (request, response) => {
  const body = request.body
  const newTitle = {
    _id: body.id,
    title: body.title,
    type: body.type,
    status: body.status,
    episodesTotal: body.episodesTotal,
    episodesWatched: body.episodesWatched,
    progressPct: body.progressPct,
    poster: body.poster,
    hue: Math.floor(Math.random() * 360)
  }

  const updatedTitle = await Title.findByIdAndUpdate(request.params.id, newTitle, { returnDocument: "after" })

  console.log("title was updated:", updatedTitle)
  response.status(200).json(updatedTitle).end()
})

module.exports = localRouter