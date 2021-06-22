import axios from 'axios'

const news = async () => {
  try {
    // const cors = 'https://cors-anywhere.herokuapp.com/' // use cors-anywhere to fetch api data
    const responseSearch = await axios.get('https://api.cnyes.com/media/api/v1/search?q=0050')

    console.log(responseSearch.data.items.data[2].title)

    const newsArr = responseSearch.data.items.data
    for (const n in newsArr) {
      console.log(newsArr[n].title)
      console.log(newsArr[n].content)
      console.log(newsArr[n].keyword)
      console.log(newsArr[n].newsId)
      // console.log(newsArr[n].coverSrc.l.src) 有些新聞沒有圖片尺寸會出現 null

      // var NewsId = newsArr[n].newsId

      // const responseNews = await axios.get(`https://news.cnyes.com/news/id/${encodeURI(newsArr[n].newsId)}`)

      console.log(`https://news.cnyes.com/news/id/${encodeURI(newsArr[n].newsId)}`)
    }
  } catch (error) {
    console.log(error)
  }
}

news()
