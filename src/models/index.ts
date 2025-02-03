import Order from './order'
import FreightSchedule from './freightSchedule'

const models = {
  Order,
  FreightSchedule
}

export default models

export type MyModels = typeof models

Object.entries(models).map(([, model]) => {
  return model
})