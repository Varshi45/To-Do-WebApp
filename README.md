---

# Todo List Application

This is a simple todo list application built with Express.js, Sequelize, and Passport.js.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)

## Introduction

This application allows users to create, manage, and organize their todo tasks. Users can sign up for an account, log in, add new todos, mark todos as completed, and delete todos. 

## Features

- User authentication using Passport.js
- Password encryption with bcrypt
- CSRF protection with csurf
- Flash messages for user feedback
- Sequelize ORM for database interactions
- Responsive design using EJS templates
- RESTful API endpoints for todo management

## Installation

To install and run this application locally, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies using `npm install`.
4. Set up a PostgreSQL database and configure the connection in `config/config.json`.
5. Run the database migrations using `npx sequelize-cli db:migrate`.
6. Start the server using `npm start`.
7. Open your web browser and go to `http://localhost:3000`.

## Usage

- Visit the homepage (`/`) to view all todos.
- Sign up for a new account by visiting `/signup`.
- Log in to your account at `/login`.
- Add new todos by clicking on the "Add Todo" button.
- Mark todos as completed by checking the checkbox next to each todo.
- Delete todos by clicking on the "Delete" button next to each todo.
- Log out of your account by visiting `/signout`.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature/new-feature`).
3. Make your changes and commit them (`git commit -am 'Add new feature'`).
4. Push your changes to your fork (`git push origin feature/new-feature`).
5. Create a new pull request.


---

Feel free to customize this README file according to your project's specific features, requirements, and preferences.
