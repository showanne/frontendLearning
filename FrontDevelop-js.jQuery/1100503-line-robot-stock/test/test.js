import axios from 'axios'

const test = async () => {
  try {
    const response = await axios.get('https://api.fugle.tw/realtime/v0/intraday/meta?symbolId=0056&apiToken=bcb3f1d25b0a8e5d3ad0e7acbdbe10b0')
    console.log(response.data)
    console.log(response.data.length)
  } catch (error) {
    // console.error(error)
    console.log(error)
  }
}
test()
