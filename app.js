const express = require("express");
var csrf = require("csurf");
const app = express();
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const path = require("path");
// const { error } = require("console");

const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

const saltRounds = 10;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secret string"));
app.use(csrf({ cookie: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

app.use(
  session({
    secret: "my-secret-key-127287123873",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, //24hours
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({ where: { email: username } })
        .then(async (user) => {
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          } else {
            done("Invalid password");
          }
        })
        .catch((error) => {
          return error;
        });
    },
  ),
);

passport.serializeUser((user, done) => {
  console.log("serializing user in session", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

const { Todo, User } = require("./models");

app.get("/", async (request, response) => {
  try {
    response.render("index", {
      csrfToken: request.csrfToken(),
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/signup", (request, response) => {
  response.render("signup", { csrfToken: request.csrfToken() });
});

app.get("/login", (request, response) => {
  response.render("login", { csrfToken: request.csrfToken() });
});

app.get("/signout", (request, response, next) => {
  request.logout((err) => {
    if (err) {
      return next(err);
    }
    response.redirect("/");
  });
});

app.post("/users", async (request, response) => {
  const hashedPwd = await bcrypt.hash(request.body.password, saltRounds);
  try {
    const user = await User.create({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: hashedPwd,
    });
    request.login(user, (err) => {
      if (err) {
        console.log(err);
      }
      response.redirect("/todos");
    });
  } catch (error) {
    console.log(error);
  }
});

app.post(
  "/session",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (request, response) => {
    console.log(request.user);
    response.redirect("/todos");
  },
);

app
  .route("/todos")
  .get(connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    try {
      const allTodos = await Todo.getTodos();
      const loggedInUser = request.user.id;

      // Fetch todos for each category
      const overdueTodos = await Todo.overdue(loggedInUser);
      const dueTodayTodos = await Todo.dueToday(loggedInUser);
      const dueLaterTodos = await Todo.dueLater(loggedInUser);
      const completedTodos = await Todo.completed(loggedInUser);

      if (request.accepts("html")) {
        response.render("todos", {
          allTodos,
          overdueTodos,
          dueTodayTodos,
          dueLaterTodos,
          completedTodos,
          csrfToken: request.csrfToken(),
        });
      } else {
        response.json({
          allTodos,
          overdueTodos,
          dueTodayTodos,
          dueLaterTodos,
          completedTodos,
        });
      }
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  })
  .post(connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    try {
      const { title, dueDate } = request.body;
      const userId = request.user.id;
      // console.log(userId, "userId value ");
      // Server-side validation
      if (!title || !dueDate) {
        return response
          .status(422)
          .json({ error: "Title and dueDate are required." });
      }

      await Todo.addTask({
        userId,
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
  .put(connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
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
  .delete(connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
    try {
      const userId = request.user.id;
      await Todo.remove(request.params.id, userId);
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
