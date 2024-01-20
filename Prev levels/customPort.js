const http = require("http");
const fs = require("fs");

let homeContent = "";
let registrationContent = "";
let projectContent = "";

const args = process.argv.slice(2);

let port = 3000;

// Check if --port argument is provided
const portIndex = args.findIndex((arg) => arg.startsWith("--port="));
if (portIndex !== -1) {
  const portValue = args[portIndex].split("=")[1];
  port = parseInt(portValue, 10);
}

fs.readFile("home.html", (err, home) => {
  if (err) {
    throw err;
  }

  homeContent = home;
});

fs.readFile("regestration.html", (err, registration) => {
  if (err) {
    throw err;
  }

  registrationContent = registration;
});

fs.readFile("project.html", (err, project) => {
  if (err) {
    throw err;
  }

  projectContent = project;
});

const server = http.createServer((request, response) => {
  const url = request.url;
  response.writeHeader(200, { "Content-Type": "text/html" });

  switch (url) {
    case "/project":
      response.write(projectContent);
      response.end();
      break;
    case "/registration":
      response.write(registrationContent);
      response.end();
      break;
    default:
      response.write(homeContent);
      response.end();
      break;
  }
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
