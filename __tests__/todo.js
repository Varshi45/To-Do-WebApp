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

  test("Updating a Todo completing status", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: true,
      _csrf: csrfToken,
    });

    const groupedTodosResposne = await agent
      .get("/")
      .set("Accept", "application/json");
    const parsedGroupResponse = JSON.parse(groupedTodosResposne.text);
    const dueTodayCount = parsedGroupResponse.allTodos.length;
    const latestTodo = parsedGroupResponse.allTodos[dueTodayCount - 1];

    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);

    await agent.put(`/todos/${latestTodo.id}`).send({
      _csrf: csrfToken,
    });
    expect(latestTodo.completed).toBe(false);
  });
  test("Delete a todo by ID", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Delete me",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    const groupedTodosResposne = await agent
      .get("/")
      .set("Accept", "application/json");
    const parsedGroupResponse = JSON.parse(groupedTodosResposne.text);
    const dueTodayCount = parsedGroupResponse.allTodos.length;
    const latestTodo = parsedGroupResponse.allTodos[dueTodayCount - 1];

    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);

    await agent.delete(`/todos/${latestTodo.id}`).send({
      _csrf: csrfToken,
    });

    const groupedTodosResposne1 = await agent
      .get("/")
      .set("Accept", "application/json");
    const parsedGroupResponse1 = JSON.parse(groupedTodosResposne1.text);
    const dueTodayCount1 = parsedGroupResponse1.allTodos.length;
    const latestTodo1 = parsedGroupResponse1.allTodos[dueTodayCount1 - 1];
    expect(latestTodo == latestTodo1).toBe(false);
  });
});
