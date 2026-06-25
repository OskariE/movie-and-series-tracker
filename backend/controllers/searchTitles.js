require('dotenv').config()
const titlesRouter = require('express').Router()

const API_BASE = process.env.API_BASE;

titlesRouter.get('/:searchTerm', async (request, response) => {
  const { searchTerm } = request.params;
  console.log(`Searching for: ${searchTerm}`);
  const titles = await fetch(`${API_BASE}t=${searchTerm}`).then(res => res.json())
  response.json(titles)
})

module.exports = titlesRouter