import Express from 'express'
import  { Router} from 'express'
import {getFreightSchedules, bulkInsertFreightSchedules, viewFreightScheduleDetails} from '../controllers/freightScheduleController'
import {getSchdulesDriversOrders, emergencyAssignment} from '../controllers/freightScheduleDriverController'
const router : Router = Express.Router()

router.get("/", getFreightSchedules)
router.post("/", bulkInsertFreightSchedules)
router.get("/details", getSchdulesDriversOrders)
router.get("/:id", viewFreightScheduleDetails)
router.post("/:id/emergency-driver", emergencyAssignment)

export default router