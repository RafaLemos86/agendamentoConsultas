const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");

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
                return { user: await user.find({ "finished": false }), status: true }
            }
        } catch (err) {
            console.log(err)
            return { status: false, msg: err }
        }

    }
}

module.exports = new AppointmentServices()