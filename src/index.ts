import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/duration'
dayjs.extend(relativeTime)

import MilkClient from './client'

new MilkClient()
