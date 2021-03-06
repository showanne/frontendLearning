{
  "type": "carousel",
  "contents": [
    {
      "type": "bubble",
      "size": "nano",
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "image",
            "url": "https://i.imgur.com/vlu1wnz.png",
            "size": "full",
            "aspectMode": "cover",
            "aspectRatio": "35:11",
            "gravity": "top"
          },
          {
            "type": "box",
            "layout": "baseline",
            "contents": [
              {
                "type": "icon",
                "url": "https://img.icons8.com/nolan/2x/combo-chart.png"
              },
              {
                "type": "text",
                "text": "歷史走勢",
                "color": "#1a2a62",
                "align": "center",
                "size": "md",
                "margin": "md"
              }
            ],
            "position": "absolute",
            "paddingAll": "xl",
            "offsetStart": "xs",
            "paddingTop": "xxl"
          }
        ],
        "paddingAll": "0px",
        "justifyContent": "center"
      },
      "action": {
        "type": "uri",
        "label": "action",
        "uri": "http://linecorp.com/"
      }
    },
    {
      "type": "bubble",
      "size": "nano",
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "image",
            "url": "https://i.imgur.com/vlu1wnz.png",
            "size": "full",
            "aspectMode": "cover",
            "aspectRatio": "35:11",
            "gravity": "top"
          },
          {
            "type": "box",
            "layout": "baseline",
            "contents": [
              {
                "type": "icon",
                "url": "https://img.icons8.com/nolan/2x/improvement.png"
              },
              {
                "type": "text",
                "text": "即時走勢",
                "color": "#1a2a62",
                "align": "center",
                "size": "md",
                "margin": "md"
              }
            ],
            "position": "absolute",
            "paddingAll": "xl",
            "offsetStart": "xs",
            "paddingTop": "xxl"
          }
        ],
        "paddingAll": "0px",
        "justifyContent": "center"
      },
      "action": {
        "type": "message",
        "label": "action",
        "text": "hello"
      }
    }
  ]
}

// const message = {
          //   type: 'text',
          //   text: `${event.message.text.substr(0, historyI)} 走勢`,
          //   quickReply: {
          //     items: [
          //       {
          //         type: 'action',
          //         imageUrl: 'https://img.icons8.com/nolan/2x/combo-chart.png',
          //         action: {
          //           type: 'uri',
          //           label: '歷史走勢',
          //           uri: `https://www.google.com/finance/quote/${encodeURI(
          //             event.message.text.substr(0, historyI)
          //           )}:TPE?window=MAX`
          //         }
          //       },
          //       {
          //         type: 'action',
          //         imageUrl: 'https://img.icons8.com/nolan/2x/combo-chart.png',
          //         action: {
          //           type: 'uri',
          //           label: '即時走勢',
          //           uri: `https://www.google.com/finance/quote/${encodeURI(
          //             event.message.text.substr(0, historyI)
          //           )}:TPE`
          //         }
          //       }
          //       // ,
          //       // {
          //       //   type: 'action',
          //       //   action: {
          //       //     type: 'location',
          //       //     label: '選擇地點'
          //       //   }
          //       // }
          //     ]
          //   }
          // }