class AppointmentFactory {



    // recebe o json completo da conculta e retorna apenas os campos para inserir no calendar
    Build(simpleAppoitment) {

        var minutes = parseInt(simpleAppoitment.time.split(":")[1])
        var hour = parseInt(simpleAppoitment.time.split(":")[0])

        // para dar o dia certo, getDate retorna um dia anterior
        var day = simpleAppoitment.date.getDate() + 1
        var month = simpleAppoitment.date.getMonth()
        var year = simpleAppoitment.date.getFullYear()




        // criando nova data formatada
        // 0 e 0 são os segundos e milisegundos
        var startDate = new Date(year, month, day, hour, minutes, 0, 0)

        var endDate = new Date(year, month, day, hour, minutes, 0, 0)

        // horario brasileiro e -3 em relacao ao GMT
        // startDate.setHours(startDate.getHours() - 3)

        // horario final e uma hora depois do inicial
        endDate.setHours(endDate.getHours() - 1)


        // retorna data formatada
        var result = {
            id: simpleAppoitment._id,
            title: simpleAppoitment.name + " - " + simpleAppoitment.description,
            start: startDate,
            end: endDate,
            notified: simpleAppoitment.notified,
            email: simpleAppoitment.email
        };

        return result

    }

}

module.exports = new AppointmentFactory