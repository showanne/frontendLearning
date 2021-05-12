import twstockjs from 'twstockjs'
// https://www.npmjs.com/package/twstockjs

const { History } = twstockjs
const RT = async () => {
  const realtimeData = await History.get('2330', 2019, 12)
  realtimeData()
}
RT()
