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
    runTime: body.runTime,
    poster: body.poster,
    imdbID: body.imdbID,
    hue: Math.floor(Math.random() * 360)
  })

  const savedTitle = await title.save()
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
    runTime: body.Runtime,
    poster: body.poster,
    imdbID: body.imdbID,
    hue: body.hue
  }

  const updatedTitle = await Title.findByIdAndUpdate(request.params.id, newTitle, { returnDocument: "after" })

  response.status(200).json(updatedTitle).end()
})

localRouter.delete('/:id', async (request, response) => {
  const title = await Title.findById(request.params.id)
  if (!title) {
    return response.status(404).end()
  }
  await Title.findByIdAndDelete(request.params.id)
  response.status(200).end()
})

module.exports = localRouter