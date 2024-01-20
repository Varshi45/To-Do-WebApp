// models/todo.js
"use strict";
const { Op } = require("sequelize");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Todo.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }

    static async addTask(params) {
      try {
        return await Todo.create(params);
      } catch (error) {
        throw error;
      }
    }

    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      const overdueTasks = await Todo.overdue();
      overdueTasks.forEach((task) => console.log(task.displayableString()));

      console.log("Due Today");
      const dueTodayTasks = await Todo.dueToday();
      dueTodayTasks.forEach((task) => console.log(task.displayableString()));

      console.log("Due Later");
      const dueLaterTasks = await Todo.dueLater();
      dueLaterTasks.forEach((task) => console.log(task.displayableString()));

      console.log("\nCompleted");
      const completedTasks = await Todo.completed();
      completedTasks.forEach((task) => console.log(task.displayableString()));
    }

    static async setCompletionStatus(id, completed) {
      try {
        const todo = await Todo.findByPk(id);

        if (!todo) {
          throw new Error(`Todo with ID ${id} not found.`);
        }

        // Toggle completion status
        todo.completed = !todo.completed;
        await todo.save();

        console.log(
          `Todo with ID ${id} marked as ${
            todo.completed ? "completed" : "incomplete"
          }.`,
        );

        // Return the updated todo after setting completion status
        return todo.toJSON();
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    static async remove(id, userId) {
      return this.destroy({
        where: {
          id,
          userId,
        },
      });
    }

    static async markAsComplete(id) {
      try {
        const todo = await Todo.findByPk(id);

        if (!todo) {
          throw new Error(`Todo with ID ${id} not found.`);
        }

        todo.completed = !todo.completed;
        await todo.save();
        console.log(`Todo with ID ${id} marked as ${todo.completed}.`);

        // Return the updated todo after marking as complete
        return todo.toJSON();
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    static getTodos() {
      return this.findAll();
    }

    static async overdue(userId) {
      try {
        const currentDate = new Date();
        return await Todo.findAll({
          where: {
            dueDate: {
              [Op.lt]: currentDate,
            },
            userId,
            completed: false,
          },
        });
      } catch (error) {
        console.error(error);
        throw error; // Rethrow the error after logging
      }
    }

    static async dueToday(userId) {
      try {
        const currentDate = new Date();
        const tomorrowDate = new Date(currentDate);
        tomorrowDate.setDate(currentDate.getDate() + 1);

        return await Todo.findAll({
          where: {
            dueDate: {
              [Op.gte]: currentDate,
              [Op.lt]: tomorrowDate,
            },
            userId,
            completed: false,
          },
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    static async dueLater(userId) {
      try {
        const currentDate = new Date();
        const tomorrowDate = new Date(currentDate);
        tomorrowDate.setDate(currentDate.getDate() + 1);

        return await Todo.findAll({
          where: {
            dueDate: {
              [Op.gte]: tomorrowDate,
            },
            userId,
            completed: false,
          },
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    static async completed(userId) {
      try {
        return await Todo.findAll({
          where: {
            completed: true,
            userId,
          },
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
    static associate(models) {
      // define association here
    }
    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
    }
  }
  Todo.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          len: 5,
        },
      },
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    },
  );
  return Todo;
};
