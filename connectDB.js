const Sequelize = require("sequelize");
const database = "todo_db";
const username = "postgres";
const password = "1234";
const sequelize = new Sequelize(database,username,password,{
    host : "localhost",
    dialect : "postgres",
    logging : false,
});

// sequelize
//     .authenticate()
//     .then(()=>{
//         console.log("Connected Succesfully");
//     })
//     .catch((error)=>{
//         console.log("couldnt connect",error)
//     });
const connect = async() =>{
    return sequelize.authenticate();
}

module.exports = {
    connect,
    sequelize
}