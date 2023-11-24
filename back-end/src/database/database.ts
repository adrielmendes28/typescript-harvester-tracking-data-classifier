import { DataSource } from "typeorm"
import { DataPoint } from "../entities/DataPoint"
import DataSimulatorService from "../services/DataSimulatorService"

const AppDataSource = new DataSource({
    type: "mssql",
    host: "localhost",
    port: 1433,
    username: "sa",
    password: "jK3!qY8@rW2#",
    database: "canalog",
    entities: [DataPoint],
    synchronize: true,
    logging: false,
    options: {
        encrypt: false,
    },
})

AppDataSource.initialize()
    .then(() => {
        //console.log("Data Source has been initialized!", __dirname)

        DataSimulatorService.startDataSimulation();
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })

export default AppDataSource;