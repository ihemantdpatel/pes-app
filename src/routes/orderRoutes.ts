import Express from 'express'
import  { Router} from 'express'
import {getOrders, bulkInsertOrders} from '../controllers/orderController'

const router : Router = Express.Router()

router.get("/", getOrders)
router.post("/", bulkInsertOrders)

export default router