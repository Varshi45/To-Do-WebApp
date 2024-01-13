// // __tests__/todo.js
// /* eslint-disable no-undef */
// const db = require("../models");

// describe("Todolist Test Suite", () => {
//   beforeAll(async () => {
//     await db.sequelize.sync({ force: true });
//   });

//   test("Should add new todo", async () => {
//     const todoItemsCount = await db.Todo.count();
//     await db.Todo.addTask({
//       title: "Test todo",
//       completed: false,
//       dueDate: new Date(),
//     });
//     const newTodoItemsCount = await db.Todo.count();
//     expect(newTodoItemsCount).toBe(todoItemsCount + 1);
//   });
// });
////previous todo.js code

const request = require("supertest");
var cheerio = require("cheerio");

const db = require("../models/index");
const app = require("../app");
// const { parse } = require("path");

let server, agent;

function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

describe("Todo test suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });
  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });
  test("responds with json at /todos", async () => {
    const res = await agent.get("/");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });

  test("Mark a todo as complete", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    const groupedTodosResposne = await agent
      .get("/")
      .set("Accept", "application/json");
    const parsedGroupResponse = JSON.parse(groupedTodosResposne.text);
    console.log(parsedGroupResponse);
    const dueTodayCount = parsedGroupResponse.allTodos.length;
    const latestTodo = parsedGroupResponse.allTodos[dueTodayCount - 1];

    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);

    const markAsCompleteResponse = await agent
      .put(`/todos/${latestTodo.id}/markAsComplete`)
      .send({
        _csrf: csrfToken,
      });
    const parsedUpdatedResponse = JSON.parse(markAsCompleteResponse.text);
    expect(parsedUpdatedResponse.completed).toBe(true);
  });
  //   test("Delete a todo by ID", async () => {
  //     const response = await agent.post("/todos").send({
  //       title: "Delete me",
  //       dueDate: new Date().toISOString(),
  //       completed: false,
  //     });
  //     const parsedResponse = JSON.parse(response.text);
  //     const todoID = parsedResponse.id;

  //     const deleteResponse = await agent.delete(`/todos/${todoID}`).send();
  //     const parsedDeleteResponse = JSON.parse(deleteResponse.text);
  //     expect(parsedDeleteResponse.success).toBe(true);
  //   });
});
