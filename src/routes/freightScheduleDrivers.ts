import Express from 'express'
import  { Router} from 'express'
import {getSchdulesDriversOrders, emergencyAssignment} from '../controllers/freightScheduleDriverController'

const router : Router = Express.Router()

export default router