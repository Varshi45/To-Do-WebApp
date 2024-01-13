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

const db = require("../models/index");
const app = require("../app");

let server, agent;

describe("Todo test suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });
  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });
  test("responds with json at /todos", async () => {
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    expect(response.statusCode).toBe(302);
  });

  //   test("Mark a todo as complete", async () => {
  //     const response = await agent.post("/todos").send({
  //       title: "Buy milk",
  //       dueDate: new Date().toISOString(),
  //       completed: false,
  //     });
  //     const parsedResponse = JSON.parse(response.text);
  //     const todoID = parsedResponse.id;
  //     expect(parsedResponse.completed).toBe(false);

  //     const markCompleteResponse = await agent
  //       .put(`/todos/${todoID}/markAsComplete`)
  //       .send();
  //     const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
  //     expect(parsedUpdateResponse.completed).toBe(true);
  //   });
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
