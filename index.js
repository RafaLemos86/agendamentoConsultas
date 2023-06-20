const express = require("express");
const app = express();
const bodyparser = require("body-parser")
const mongoose = require("mongoose");
const appointmentServices = require("./services/AppointmentService");

app.use(express.static("public"))

// configuracoes body-parser
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());


app.set("view engine", "ejs");

// conectando ao banco
mongoose.connect("mongodb://localhost:27017/agendamento",
    { useNewUrlParser: true, useUnifiedTopology: true });



// rota principal
app.get("/", (req, res) => {
    res.render("index")
});

// criar agendamento
app.get("/create", (req, res) => {
    res.render("create")
});

// criando usuários
app.post("/create", async (req, res) => {
    var { name, email, cpf, description, date, time } = req.body

    var insertStatus = await appointmentServices.Create(
        name,
        email,
        cpf,
        description,
        date,
        time
    );

    if (insertStatus) {
        res.redirect("/")
    } else {
        res.send("Ocorreu um erro")
    }

});

// resgatando usuários
app.get("/users", async (req, res) => {
    var users = await appointmentServices.GetAll(false);

    if (users.status) {
        res.json(users.users)
    } else {
        res.send(users.msg)
    }
})

// pegando usuario pelo id para gerar a tela de cada usuario
app.get("/event/:id", async (req, res) => {
    var id = req.params.id
    var userId = await appointmentServices.getById(id)

    res.render("event", { appo: userId })


})



app.listen(8080, () => {
    console.log("servidor rodando")
});