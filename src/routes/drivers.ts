import Express from 'express'
import  { Router} from 'express'
import {getDrivers, bulkInsertDrivers} from '../controllers/driverController'
import {assignDrivers} from '../controllers/freightScheduleDriverController'

const router : Router = Express.Router()

router.get("/", getDrivers)
router.post("/", bulkInsertDrivers)
router.post("/assign", assignDrivers)


export default router