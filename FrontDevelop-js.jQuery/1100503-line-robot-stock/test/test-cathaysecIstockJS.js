import $ from 'jquery'

$(function () {
  GetStockDetail(getUrlParameter('para'))

  if (true) {
    $('#markShow').click(function () {
      GA_Event('股東會詳情', '點擊', '發放原則', '0')
    })

    $('#股東會日期與地點').click(function () {
      GA_Event('股東會詳情', '點擊', '日期與地點', '0')
    })

    $('#股代資訊').click(function () {
      GA_Event('股東會詳情', '點擊', '股代資訊', '0')
    })

    $('#我要分享').click(function () {
      GA_Event('股東會詳情', '點擊', '分享_' + $('#公司名稱').text(), '0')
    })

    $('#goBack').click(function () {
      let para = $('#goBack').attr('data-herf')
      if (para == undefined) {
        para = ''
      }

      location.href = GetUrlPara('index.aspx', para)
    })

    $('#紀念品').click(function () {
      GA_Event('股東會詳情', '點擊', 'Google搜尋_' + $('#公司名稱').text(), '0')
    })
  }
})

function GetStockDetail(para) {
  $.ajax({
    type: 'POST',
    url: 'Service.aspx/SouvenirDetail',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    async: true,
    data: JSON.stringify({
      para: para
    }),
    success: function (response) {
      const result = response.d
      if (result.ResultCode == '0000') {
        $('#股票代號').text(result.股票代號)
        $('#公司名稱').text(result.公司名稱)
        $('#紀念品').text(result.紀念品)
        $('#紀念品').attr(
          'href',
          "javascript:symbolSouvenir('" + result.紀念品 + "+股東會+紀念品')"
        )

        if (result.發放原則 == '可領') {
          $('#souvenirShow').show()
          $('#發放原則文字').text(result.發放原則文字)
        } else {
          $('#souvenirShow').hide()
        }

        if (result.紀念品 == '本次不發放紀念品') {
          $('#markShow').hide()
        } else {
          $('#markShow').show()
        }

        $('#最後買進日').text(result.最後買進日)
        $('#開會日期').text(result.開會日期)
        $('#開會地點').text(result.開會地點)
        $('#股務代理').text(result.股務代理)
        $('#股務電話').text(result.股務電話)

        $('#hashtag').empty()
        $.each(result.股票標籤s, function (key, value) {
          $('#hashtag').append('<div class="hashtag">' + value + '</div>') // 載入分鏡
        })

        const shareText =
          '這是「' +
          result.股票代號 +
          result.公司名稱 +
          '」的股東會紀念品相關資訊，參考看看~'

        $('#desc').attr('content', shareText)
        $('#desc2').attr('content', shareText)

        // 牌卡
        const riseFall = parseFloat(result.RiseFall)

        $('#ClosePrice').text(result.ClosePrice)
        $('#RiseFall').text(riseFall + '(' + result.GainsPrcnt + '%)')

        if (riseFall > 0) {
          $('#ClosePrice').attr('class', 'closePrice priceColor-red')
          $('#RiseFall').attr('class', 'info priceColor-red')
        } else if (riseFall == 0) {
          $('#ClosePrice').attr('class', 'closePrice')
          $('#RiseFall').attr('class', 'info')
        } else if (riseFall < 0) {
          $('#ClosePrice').attr('class', 'closePrice priceColor-green')
          $('#RiseFall').attr('class', 'info priceColor-green')
        }

        $('#TDate').text(result.TDate)
        $('#DealVolumn').text('成交量(張): ' + formatNumber(result.DealVolumn))
        $('#stockImg').attr(
          'src',
          'https://webap.cathaysec.com.tw/TreasuryStock/kchart/lastclose/' +
            result.股票代號 +
            '.png' +
            '?t=' +
            new Date().getTime()
        )

        // 重新複寫FB LINE分享
        share_fb_line()
      } else {
        ShowAlertBox(result.ResultMessage)
      }

      CloseWaitBox()
    },
    error: function () {
      ShowAlertBox('GetStockDetail()系統發生錯誤')
    }
  })
}
