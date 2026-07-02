require('dotenv').config()
const titlesRouter = require('express').Router()

const API_BASE = process.env.API_BASE;

titlesRouter.get('/:searchTerm', async (request, response) => {
  const { searchTerm } = request.params;
  const titles = await fetch(`${API_BASE}t=${searchTerm}`).then(res => res.json())
  response.json(titles)
})

titlesRouter.get('/byID/:imdbID', async (request, response) => {
  const { imdbID } = request.params;
  const title = await fetch(`${API_BASE}i=${imdbID}`).then(res => res.json())
  response.json(title)
})

module.exports = titlesRouter