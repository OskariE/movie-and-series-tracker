# Movie & Series Tracker

https://movie-and-series-tracker.onrender.com/

## Running the site locally:

To run the site locally, make a .env file in the backend folder with the following environmental variables:

`MONGODB_URI=`

`API_BASE=https://www.omdbapi.com/?apikey=[yourkey]&`

`PORT=`


Set the mongodburl to your own mongodb database [MongoDB](https://www.mongodb.com/). 

Replace the `[yourkey]` in api_base with your own api key from [Omdbapi](https://www.omdbapi.com/).

And set the port to whatever port you want the site to run on.


Next, run `npm install` and `npm start` in the backend folder. The site should now be running locally on the port you chose.

## Publishing the site, using Render:

To publish the site, you can use render. [Render](https://render.com/)

In the Render dashboard choose new and Web service, next choose public git repository and copy paste this repository link. (https://github.com/OskariE/movie-and-series-tracker/)

Set the Root directory as `backend`

Set build command as `npm install` and `npm start` as the start command.

Next set the environmental variables as explained above.

Now just click Deploy Web Service, and the site should be live after its done deploying.


# Access the api:

You can access the api by adding /api to the link.

/api/titles will fetch all titles that are in the database.

/api/titles/:id will fetch a single title from the database with the chosen id. ( replace :id with the title database id )
