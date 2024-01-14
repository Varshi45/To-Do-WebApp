const express = require("express");
var csrf = require("csurf");
const app = express();
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const path = require("path");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secret string"));
app.use(csrf({ cookie: true }));

const { Todo } = require("./models");

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (request, response) => {
  try {
    const allTodos = await Todo.getTodos();
    if (request.accepts("html")) {
      response.render("index", {
        allTodos,
        csrfToken: request.csrfToken(),
      });
    } else {
      response.json({
        allTodos,
      });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

// eslint-disable-next-line no-unused-vars
app
  .route("/todos")
  .get(async (request, response) => {
    try {
      const todos = await Todo.findAll();
      return response.json(todos);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Internal Server Error" });
    }
  })
  .post(async (request, response) => {
    try {
      const { title, dueDate } = request.body;

      // Server-side validation
      if (!title || !dueDate) {
        return response
          .status(422)
          .json({ error: "Title and dueDate are required." });
      }

      await Todo.addTask({
        title,
        dueDate,
        completed: false,
      });

      return response.redirect("/");
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  });

app
  .route("/todos/:id")
  .put(async (request, response) => {
    try {
      const { completed } = request.body;

      if (completed === undefined) {
        return response
          .status(422)
          .json({ error: "Missing 'completed' field in the request body." });
      }

      const updatedTodo = await Todo.setCompletionStatus(
        request.params.id,
        completed,
      );
      return response.json(updatedTodo);
    } catch (error) {
      console.error(error);
      return response.status(422).json({ error: "Failed to update todo." });
    }
  })
  .delete(async (request, response) => {
    try {
      await Todo.remove(request.params.id);
      return response.json({ success: true });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Internal Server Error" });
    }
  });

// app.listen(3000,()=>{
//     console.log("server started at port 3000")
// })

module.exports = app;
