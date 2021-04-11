import moment from 'moment'

export function formatDuration(duration: number) {
  return moment
    .duration(duration)
    .format('Y[년] M[월] D[일] H[시간] m[분] s[초]')
}
