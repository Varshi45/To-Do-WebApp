const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
app.use(bodyParser.json());

const { Todo } = require("./models");

app.set("view engine", "ejs");

app.get("/", async (request, response) => {
  const allTodos = await Todo.getTodos();
  if (request.accepts("html")) {
    response.render("index", {
      allTodos,
    });
  } else {
    response.json({
      allTodos,
    });
  }
});

app.use(express.static(path.join(__dirname, "public")));

// eslint-disable-next-line no-unused-vars
app.get("/todos", async (request, response) => {
  try {
    const todos = await Todo.findAll();
    return response.json(todos);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/todos", async (request, response) => {
  console.log("creating todo", request.body);
  try {
    const todo = await Todo.addTask({
      title: request.body.title,
      dueDate: request.body.dueDate,
      completed: false,
    });
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsComplete", async (request, response) => {
  console.log("Marked as complete - ", request.params.id);
  try {
    const updatedTodo = await Todo.markAsComplete(request.params.id);
    return response.json(updatedTodo);
  } catch (error) {
    console.error(error);
    return response
      .status(422)
      .json({ error: "Failed to mark todo as complete." });
  }
});

// eslint-disable-next-line no-unused-vars
app.delete("/todos/:id", async (request, response) => {
  console.log("todo deleted with ID - ", request.params.id);
  try {
    const deletedTodoCount = await Todo.destroy({
      where: { id: request.params.id },
    });
    return response.json({ success: deletedTodoCount > 0 });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
});

// app.listen(3000,()=>{
//     console.log("server started at port 3000")
// })

module.exports = app;
