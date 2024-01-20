// todo.js

class TodoList {
  constructor() {
    this.all = [];
    this.today = new Date().toISOString().slice(0, 10);
  }

  add(todoItem) {
    this.all.push(todoItem);
  }

  markAsComplete(index) {
    if (this.all[index]) {
      this.all[index].completed = true;
    }
  }

  overdue() {
    return this.all.filter(
      (item) => !item.completed && item.dueDate < this.today,
    );
  }

  dueToday() {
    return this.all.filter(
      (item) => !item.completed && item.dueDate === this.today,
    );
  }

  dueLater() {
    return this.all.filter(
      (item) => !item.completed && item.dueDate > this.today,
    );
  }

  toDisplayableList(list) {
    let outputString = "";
    list.forEach((item, index) => {
      outputString += `${index + 1}. ${item.title}`;
      if (item.dueDate && item.dueDate !== this.today) {
        outputString += ` - Due: ${item.dueDate}`;
      }
      outputString += "\n";
    });
    return outputString;
  }
}

module.exports = TodoList;
