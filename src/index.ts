import { appDataSource } from "./data-source";

appDataSource.initialize().then(() => {
    console.log("Everything ok");
}).catch(() => console.log("Error"));