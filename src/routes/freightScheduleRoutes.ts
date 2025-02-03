import Express from 'express'
import  { Router} from 'express'
import {getFreightSchedules, bulkInsertFreightSchedules, viewFreightScheduleDetails} from '../controllers/freightScheduleController'

const router : Router = Express.Router()

router.get("/", getFreightSchedules)
router.post("/", bulkInsertFreightSchedules)
router.get("/:id", viewFreightScheduleDetails)

export default router