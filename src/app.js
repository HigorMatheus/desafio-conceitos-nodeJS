const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const { isUuid }= require('uuidv4')

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(request, response,next){
  const {id} = request.params

  if(!isUuid(id)){
   return response.status(400).send()
  }
  return next()
}
app.use('/repositories/:id',validateId)

app.get("/repositories", (request, response) => {
  
  return response.json(repositories)

});

app.post("/repositories", (request, response) => {
  const {title, url, techs }= request.body

  const repository ={ id: uuid(),title, url, techs, likes: 0};

  repositories.push(repository)

  return response.status(201).json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params
  const {title, url, techs }= request.body 

  const {likes} = repositories.find(repository=> repository.id ===id)
  const repositoryIndex = repositories.findIndex(repository=> repository.id ===id)

  const repositoryUpdate={
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[repositoryIndex] = repositoryUpdate

  return response.status(201).json(repositoryUpdate)
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params
  const repositoryIndex = repositories.findIndex(repository=> repository.id ===id)

  if(repositoryIndex<0){
    return response.send(400).json({error:'Repository not fald '})
  }
  repositories.splice(repositoryIndex,1)
  return response.send(204)
});

app.put("/repositories/:id/like", (request, response) => {
  const {id}= request.params

  const { likes, title, url, techs } = repositories.find(repository=> repository.id ===id)

   const repositoryIndex = repositories.findIndex(repository=> repository.id ===id)


   const repositoryUpdate={
     id,
     title,
     url,
     techs,
     likes : likes + 1
   }
 
   repositories[repositoryIndex] = repositoryUpdate
 
   return response.status(201).json(repositoryUpdate)
});

module.exports = app;
