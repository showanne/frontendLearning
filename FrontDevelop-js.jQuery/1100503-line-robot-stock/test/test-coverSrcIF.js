// test - coverSrcIF.js

import axios from 'axios'

// async event => {
//   const responseSearch = await axios.get(`https://api.cnyes.com/media/api/v1/search?q=${encodeURI(event.postback.data.substr(0, newsI))}`)

//   const newsArr = responseSearch.data.items.data
// }

axios.get('https://api.cnyes.com/media/api/v1/search?q=0056').then(response => {
  const SrcUrl = () => {
    const newsArr = response.data.items.data
    // console.log(newsArr)
    let urlIF = ''
    for (let i = 0; i < newsArr.length; i++) {
      // url: `${newsArr[i].coverSrc.xl.src}`
      if (newsArr[i].coverSrc === null) {
        // https://picsum.photos/960/540/?random=1
        // console.log('url:' + `https://picsum.photos/960/540/?random=${i}`)
        urlIF = 'https://picsum.photos/960/540/?random=1'
        // urlIF = 'url: - - '
      } else if (newsArr[i].coverSrc.xl === undefined) {
        // console.log('url:' + `https://picsum.photos/960/540/?random=${i}`)
        urlIF = '*'
        // urlIF = 'url: * *'
      } else {
        console.log('url:' + newsArr[i].coverSrc.xl.src)
        // urlIF = newsArr[i].coverSrc.xl.src
        urlIF = 'url:' + newsArr[i].coverSrc.xl.src
      }
      // return 'url:' + urlIF
    }
    return urlIF
  }
  SrcUrl()
})
