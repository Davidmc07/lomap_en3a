import express, { Router } from 'express';
import {getPlaces, addPlace, deletePlace, updatePlace, findPlaceByTitle} from "./src/controllers/places/PlacesController";
import {addPlaceChecks, deletePlaceChecks, updatePlaceChecks, findPlaceByTitleChecks} from "./src/controllers/checks"
import cors from "cors";

const api:Router = express.Router()
let hostIp: string = "20.168.251.141";

api.use(
    cors({
        credentials: true,
        origin: ["https://" + "lomapen3a.cloudns.ph", "https://" + hostIp, "https://localhost"],
        allowedHeaders: ["Content-Type", "Authorization"],
        preflightContinue: true,
    })
);

api.get("/places/list", getPlaces);
api.post("/places/add", addPlaceChecks, addPlace);
api.get("/places/delete/:title", deletePlaceChecks, deletePlace);
api.post("/places/update/:title", updatePlaceChecks, updatePlace);
api.get("/places/get/:title", findPlaceByTitleChecks, findPlaceByTitle);

export default api;