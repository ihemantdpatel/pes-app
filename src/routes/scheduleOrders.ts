import Express from 'express'
import  { Router} from 'express'
import {scheduleOrdersOnToTheTransport, loadedOrders} from '../controllers/scheduleOrderController'

const router : Router = Express.Router()

router.post("/scheduleOrders", scheduleOrdersOnToTheTransport)
router.get("/loadedOrders/:id", loadedOrders)

export default router