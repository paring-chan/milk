import * as moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'

momentDurationFormatSetup(moment)

import MilkClient from './client'

new MilkClient()
