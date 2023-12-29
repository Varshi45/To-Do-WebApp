// __tests__/todo.js

const TodoList = require('../todo')

describe('Todo Application Tests', () => {
  let todos

  beforeEach(() => {
    todos = new TodoList()
  })

  test('should add a new todo to the list', () => {
    todos.add({ title: 'Test Todo', dueDate: '2023-12-31', completed: false })
    expect(todos.all.length).toBe(1)
  })

  test('should mark todo as complete', () => {
    todos.add({ title: 'Test Todo', dueDate: '2023-12-31', completed: false })
    todos.markAsComplete(0)
    expect(todos.all[0].completed).toBe(true)
  })

  test('should retrieve overdue items', () => {
    todos.add({ title: 'Overdue Todo', dueDate: '2022-01-01', completed: false })
    const overdueItems = todos.overdue()
    expect(overdueItems.length).toBe(1)
  })

  test('should retrieve today due items', () => {
    todos.add({ title: 'Due Today Todo', dueDate: '2023-12-29', completed: false })
    const todayDueItems = todos.dueToday()
    expect(todayDueItems.length).toBe(1)
  })

  test('should retrieve due later items', () => {
    todos.add({ title: 'Due Later Todo', dueDate: '2024-12-28', completed: false })
    const dueLaterItems = todos.dueLater()
    expect(dueLaterItems.length).toBe(1)
  })
})
