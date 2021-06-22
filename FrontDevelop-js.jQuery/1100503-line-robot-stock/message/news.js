// export file
//  export const obj = { name: 'obj'}; // 此段如果沒有被匯入，則無法運作
//  export function fn() {
//    console.log('這是一段函式')
//  }

// import file
//  import { fn, obj } from './module.js';
//  fn();
//  console.log(obj)

const arrSymbolId = []
const getlist = async () => {
  try {
    const { data } = await axios.get(
      'https://members.sitca.org.tw/OPF/K0000/files/F/01/stock.txt',
      {
        responseType: 'arraybuffer',
        transformResponse: [
          data => {
            // 將檔案編碼改big5
            return iconv.decode(Buffer.from(data), 'big5')
          }
        ]
      }
    )
    // 文字轉成陣列 .split(分割文字)
    const arr = data.split('\r\n')
    for (const i in arr) {
      arr[i] = arr[i].split(',')
      arrSymbolId.push(arr[i][0])
    }
    // console.log(arrSymbolId)
  } catch (error) {
    console.log(error)
  }
}

const responseSearch = await axios.get(
  `https://api.cnyes.com/media/api/v1/search?q=${encodeURI(
    event.message.text.substr(0, newsI)
  )}`
)

const newsArr = responseSearch.data.items.data

// 回復新聞
const flex = [
  {
    type: 'bubble',
    size: 'kilo',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'image',
          url: `${newsArr[0].coverSrc.xl.src}`,
          size: 'full',
          aspectMode: 'cover',
          aspectRatio: '1:1',
          gravity: 'top',
          action: {
            type: 'uri',
            label: 'action',
            uri: `https://news.cnyes.com/news/id/${encodeURI(
              newsArr[0].newsId
            )}`
          }
        },
        {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'box',
              layout: 'baseline',
              contents: [
                {
                  type: 'text',
                  text: `${new Date(newsArr[0].publishAt * 1000)
                    .toLocaleString('zh-tw')
                    .substr(5, 5)}`,
                  color: '#064d8888',
                  size: 'sm',
                  flex: 0
                },
                {
                  type: 'text',
                  color: '#8c8c8c',
                  size: 'xl',
                  flex: 0,
                  text: '|'
                },
                {
                  type: 'text',
                  text: `${newsArr[0].title}`,
                  size: 'md',
                  color: '#064d88',
                  weight: 'bold',
                  maxLines: 1,
                  wrap: true,
                  action: {
                    type: 'uri',
                    label: 'action',
                    uri: `https://news.cnyes.com/news/id/${encodeURI(
                      newsArr[0].newsId
                    )}`
                  }
                }
              ],
              spacing: 'sm'
            }
          ],
          position: 'absolute',
          offsetStart: '0px',
          offsetEnd: '0px',
          backgroundColor: '#eaf3faee',
          paddingAll: '3px',
          offsetTop: '0px',
          paddingStart: '17px',
          paddingEnd: '17px'
        }
      ],
      paddingAll: '0px'
    }
  },
  {
    type: 'bubble',
    size: 'kilo',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'image',
          url: `${newsArr[1].coverSrc.xl.src}`,
          size: 'full',
          aspectMode: 'cover',
          aspectRatio: '1:1',
          gravity: 'top',
          action: {
            type: 'uri',
            label: 'action',
            uri: `https://news.cnyes.com/news/id/${encodeURI(
              newsArr[1].newsId
            )}`
          }
        },
        {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'box',
              layout: 'baseline',
              contents: [
                {
                  type: 'text',
                  text: `${new Date(newsArr[1].publishAt * 1000)
                    .toLocaleString('zh-tw')
                    .substr(5, 5)}`,
                  color: '#064d8888',
                  size: 'sm',
                  flex: 0
                },
                {
                  type: 'text',
                  color: '#064d888c',
                  size: 'xl',
                  flex: 0,
                  text: '|'
                },
                {
                  type: 'text',
                  text: `${newsArr[1].title}`,
                  size: 'md',
                  color: '#064d88',
                  weight: 'bold',
                  maxLines: 1,
                  wrap: true,
                  action: {
                    type: 'uri',
                    label: 'action',
                    uri: `https://news.cnyes.com/news/id/${encodeURI(
                      newsArr[1].newsId
                    )}`
                  }
                }
              ],
              spacing: 'sm'
            }
          ],
          position: 'absolute',
          offsetStart: '0px',
          offsetEnd: '0px',
          backgroundColor: '#eaf3faee',
          paddingAll: '3px',
          offsetTop: '0px',
          paddingStart: '17px',
          paddingEnd: '17px'
        }
      ],
      paddingAll: '0px'
    }
  }
]
