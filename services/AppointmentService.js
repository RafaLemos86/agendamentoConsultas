const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");
const AppointmentFactory = require("../factories/AppoitmentFactory");

// criando collection
const user = mongoose.model("appointment", Appointment)

class AppointmentServices {
    async Create(name, email, cpf, description, date, time, finished = false) {

        // inserindo no bd

        var insertUser = new user({
            name,
            email,
            cpf,
            description,
            date,
            time,
            finished
        })

        // salvando
        try {
            await insertUser.save()
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    };


    async GetAll(finished) {

        try {
            // todas as consultas
            if (finished) {
                return { user: await user.find(), status: true }
            } else {
                // somente as nao finalizadas

                // pega no banco todas as nao finalizadas
                var appos = await user.find({ "finished": false })

                // inicializa array das consultas
                var appointments = []

                //para cada consulta, faz o Build (formata) e poe no array
                appos.forEach(element => {
                    appointments.push(AppointmentFactory.Build(element))
                });

                // retornar users e status
                return { users: appointments, status: true }
            };


        } catch (err) {
            console.log(err)
            return { status: false, msg: err }
        }

    }
}

module.exports = new AppointmentServices()