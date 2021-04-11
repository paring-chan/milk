import * as moment from 'moment'
import 'moment/locale/ko'
import momentDurationFormatSetup from 'moment-duration-format'
moment.locale('ko')

momentDurationFormatSetup(moment)

import MilkClient from './client'

new MilkClient()
