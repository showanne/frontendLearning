{
  "type": "carousel",
  "contents": [
    {
      "type": "bubble",
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "image",
            "url": "https://i.imgur.com/JMwE7GR.jpg",
            "size": "full",
            "aspectMode": "cover",
            "aspectRatio": "12:12",
            "gravity": "top"
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "filler"
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                      {
                        "type": "icon",
                        "url": "https://img.icons8.com/nolan/344/stock-share.png"
                      },
                      {
                        "type": "text",
                        "text": "即時股市行情",
                        "color": "#3c3899",
                        "flex": 0,
                        "offsetTop": "-2px"
                      }
                    ],
                    "spacing": "sm",
                    "paddingStart": "lg"
                  },
                  {
                    "type": "filler"
                  }
                ],
                "borderWidth": "1.5px",
                "cornerRadius": "4px",
                "spacing": "sm",
                "borderColor": "#5e50ff",
                "backgroundColor": "#DEDAFBaa",
                "margin": "md",
                "height": "45px",
                "action": {
                  "type": "postback",
                  "label": "stock market",
                  "data": "1101 market"
                }
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "filler"
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                      {
                        "type": "icon",
                        "url": "https://img.icons8.com/nolan/344/card-exchange.png"
                      },
                      {
                        "type": "text",
                        "text": "個股新聞",
                        "color": "#3c3899",
                        "flex": 0,
                        "offsetTop": "-2px"
                      }
                    ],
                    "spacing": "sm",
                    "paddingStart": "lg"
                  },
                  {
                    "type": "filler"
                  }
                ],
                "borderWidth": "1.5px",
                "cornerRadius": "4px",
                "spacing": "sm",
                "borderColor": "#5e50ff",
                "backgroundColor": "#DEDAFBaa",
                "margin": "md",
                "height": "45px",
                "action": {
                  "type": "postback",
                  "label": "stock news",
                  "data": "1101 news"
                }
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "filler"
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                      {
                        "type": "icon",
                        "url": "https://img.icons8.com/nolan/344/pay-date.png"
                      },
                      {
                        "type": "text",
                        "text": "歷史走勢",
                        "color": "#3c3899",
                        "flex": 0,
                        "offsetTop": "-2px"
                      }
                    ],
                    "spacing": "sm",
                    "action": {
                      "type": "uri",
                      "label": "stock history",
                      "uri": "https://www.google.com/finance/quote/1101:TPE?window=MAX"
                    },
                    "paddingStart": "lg"
                  },
                  {
                    "type": "filler"
                  }
                ],
                "borderWidth": "1.5px",
                "cornerRadius": "4px",
                "spacing": "sm",
                "borderColor": "#5e50ff",
                "backgroundColor": "#DEDAFBaa",
                "margin": "md",
                "height": "45px"
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "filler"
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                      {
                        "type": "icon",
                        "url": "https://img.icons8.com/nolan/344/stock-share.png"
                      },
                      {
                        "type": "text",
                        "text": "使用說明",
                        "color": "#3c3899",
                        "flex": 0,
                        "offsetTop": "-2px"
                      }
                    ],
                    "spacing": "sm",
                    "paddingStart": "lg"
                  },
                  {
                    "type": "filler"
                  }
                ],
                "borderWidth": "1.5px",
                "cornerRadius": "4px",
                "spacing": "sm",
                "borderColor": "#5e50ff",
                "backgroundColor": "#DEDAFBaa",
                "margin": "md",
                "height": "45px",
                "action": {
                  "type": "postback",
                  "label": "Instructions",
                  "data": "Instructions"
                }
              }
            ],
            "position": "absolute",
            "paddingAll": "66px",
            "background": {
              "type": "linearGradient",
              "angle": "110deg",
              "endColor": "#3c389999",
              "centerColor": "#3c389955",
              "startColor": "#3c3899aa",
              "centerPosition": "65%"
            },
            "offsetEnd": "0px",
            "offsetBottom": "0px",
            "offsetStart": "0px",
            "offsetTop": "0px"
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "1101",
                "color": "#dcedfb",
                "align": "center",
                "gravity": "center",
                "wrap": false,
                "adjustMode": "shrink-to-fit",
                "size": "lg"
              }
            ],
            "position": "absolute",
            "cornerRadius": "15px",
            "backgroundColor": "#5e50ffbb",
            "offsetTop": "29px",
            "paddingAll": "xs",
            "paddingStart": "md",
            "paddingEnd": "md",
            "offsetStart": "123px",
            "width": "119px"
          }
        ],
        "paddingAll": "0px"
      }
    }
  ]
}