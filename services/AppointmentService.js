const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");
const AppointmentFactory = require("../factories/AppoitmentFactory");
const nodemailer = require("nodemailer");

// criando collection
const user = mongoose.model("appointment", Appointment)

class AppointmentServices {
    async Create(name, email, cpf, description, date, time, finished = false, notified = false) {

        // inserindo no bd

        var insertUser = new user({
            name,
            email,
            cpf,
            description,
            date,
            time,
            finished,
            notified
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

    };

    async getById(id) {
        try {
            return (await user.findOne({ "_id": id }))

        } catch (err) {
            console.log(err)
        }
    }

    // finalizando a consulta
    async finish(id) {
        try {
            await user.findByIdAndUpdate(id, { "finished": true })
            return true
        } catch (err) {
            console.log(err)
            return false
        }

    }

    async search(emailCpf) {
        try {
            return (await user.find().or([{ email: emailCpf }, { cpf: emailCpf }]))
        } catch (err) {
            console.log(err)
        }
    };

    // enviar email para os usuarios
    async sendNotification() {
        try {
            // informacoes pegas do site mailtrap
            var transport = nodemailer.createTransport({
                host: "sandbox.smtp.mailtrap.io",
                port: 587,
                auth: {
                    user: "44ce60b9344e53",
                    pass: "e88545b7f825ad"
                }
            });

            var appos = await this.GetAll(false)

            // para cada usuario
            appos.users.forEach(async appo => {
                // pegando a hora de inicio em milisegundos
                var date = appo.start.getTime()
                // diferenca das datas
                var gap = date - Date.now()
                // 1 hora em milisegundos
                const hour = 1000 * 60 * 60


                // se a diferenca for menor ou igual que a hora, mande a notificacao
                if (gap <= hour) {
                    // se ainda nao foi notificado
                    if (!appo.notified) {

                        // mudar o campo notified
                        await user.findByIdAndUpdate(appo.id, { notified: true })

                        transport.sendMail({
                            from: "Rafael Lemos <rafael.lemos@gmail.com>",
                            to: appo.email,
                            subject: "Consulta em 1h!",
                            text: "Sua consulta no laboratório será em menos de 1h"
                        }).then(mensage => {
                            console.log(mensage)

                        }).catch(err => {
                            console.log(err)
                        })
                    } else {
                        return
                    }
                }
            })


        } catch (err) {
            console.log(err)
        }
    };

}

module.exports = new AppointmentServices()