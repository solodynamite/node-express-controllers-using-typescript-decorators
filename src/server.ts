import { ExpressService } from '../middleware/services/ExpressService'

const port = process.env.PORT || 3000

const server = ExpressService.start(port, './dist/src/controllers');