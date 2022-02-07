const express = require('express');
const {open} = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

const databasePath = path.join(__direname,'todoApplication.db');

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

hashStatusAndPriority = (requestQuery) =>{
    return requestQuery.status !== undefined && requestQuery.priority !== undefined
}
hashCategoryAndPriority = (requestQuery) =>{
    return requestQuery.category !== undefined && requestQuery.priority !== undefined
}
hashCategoryAndStatus = (requestQuery) =>{
    return requestQuery.category !== undefined && requestQuery.status !== undefined
}
hashStatus = (requestQuery) =>{
    return requestQuery.status !== undefined
}
hashPriority = (requestQuery) =>{
    return requestQuery.status !== undefined
}
hashCategory = (requestQuery) =>{
    return requestQuery.status !== undefined
}


app.get("/todo/",async (request,response){
    let data = null;
  let getTodoQuery = "";
  let tempword = ''
   const {search_q = "", priority, status ,category, } = request.query
   switch (true) {
       case hashCategory(request.query):
           getTodoQuery = `SELECT * from todoApplication where 
           todo LIKE '%${search_q}%' and
           category = ${category};`;   
           tempword = "Category"        
           break;

       case hashStatus(request.query):
          getTodoQuery =  `SELECT * from todoApplication where 
           todo LIKE '%${search_q}%' and
           status = ${status};`;  
           tempword = "Status"         
           break;

       case hashPriority(request.query):
            getTodoQuery =`SELECT * from todoApplication where 
           todo LIKE '%${search_q}%' and
           Priority = ${Priority};`;  
           tempword = "Priority"         
           break;

       case hashCategoryAndPriority(request.query):
           getTodoQuery = `SELECT * from todoApplication where 
           todo LIKE '%${search_q}%' and
           category = ${category} and 
           priority = ${priority};`;           
           break;

    case hashStatusAndPriority(request.query):
        getTodoQuery =    `SELECT * from todoApplication where 
           todo LIKE '%${search_q}%' and
           status = ${status} and 
           priority = ${priority};`;  
           tempword = "category"         
           break;           


           case hashCategoryAndStatus(request.query):
          getTodoQuery =  `SELECT * from todoApplication where 
           todo LIKE '%${search_q}%' and
           category = ${category} and
           status = ${status};`;
           break;
       default:
      getTodoQuery = `
      SELECT
        *
      FROM
        todo 
      WHERE
        todo LIKE '%${search_q}%';`;
  }
  const temp =  data.all(getTodoQuery)
  if(temp=== undefined){
      response.status(400)
      response.send(`Invalid Todo ${tempword}`)
  }else{
      response.send(temp)
  }

    

})
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;

  const getTodoQuery = `
    SELECT
      *
    FROM
      todo
    WHERE
      id = ${todoId};`;
  const todo = await database.get(getTodoQuery);
  response.send(todo);
});

app.get("/agenda/", async (request,response)=>{
    const date = format(new Data(2021,1,21),'yyy-MM-dd');
    const fetQ =`select * from todo where due_date = ${date};`;
     const result = await database.get(getQ)
    response.send(result)
});

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const postTodoQuery = `
  INSERT INTO
    todo (id, todo, priority, status)
  VALUES
    (${id}, '${todo}', '${priority}', '${status}');`;
  await database.run(postTodoQuery);
  response.send("Todo Successfully Added");
});

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  let updateColumn = "";
  const requestBody = request.body;
  switch (true) {
    case requestBody.status !== undefined:
      updateColumn = "Status";
      break;
    case requestBody.priority !== undefined:
      updateColumn = "Priority";
      break;
    case requestBody.todo !== undefined:
      updateColumn = "Todo";
      break;
  }
  const previousTodoQuery = `
    SELECT
      *
    FROM
      todo
    WHERE 
      id = ${todoId};`;
  const previousTodo = await database.get(previousTodoQuery);

  const {
    todo = previousTodo.todo,
    priority = previousTodo.priority,
    status = previousTodo.status,
  } = request.body;

  const updateTodoQuery = `
    UPDATE
      todo
    SET
      todo='${todo}',
      priority='${priority}',
      status='${status}'
    WHERE
      id = ${todoId};`;

  await database.run(updateTodoQuery);
  response.send(`${updateColumn} Updated`);
});

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteTodoQuery = `
  DELETE FROM
    todo
  WHERE
    id = ${todoId};`;

  await database.run(deleteTodoQuery);
  response.send("Todo Deleted");
});

module.exports = app;
