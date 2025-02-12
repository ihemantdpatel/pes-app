import Express from 'express'
import  { Router} from 'express'
import {scheduleOrdersOnToTheTransport, loadedOrders} from '../controllers/scheduleOrderController'

const router : Router = Express.Router()

router.post("/schedule-orders", scheduleOrdersOnToTheTransport)
router.get("/loaded-orders/:id", loadedOrders)

export default router