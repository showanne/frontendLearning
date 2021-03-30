// 用 ID 抓取元素
const header = document.getElementById('header')

// innerText 取出元素內的文字
console.log(header.innerText)
/* 顯示結果
回首頁
遊戲介紹
角色列表
個性套裝
關卡對戰
關於我們*/

// innerHTML 取出元素內的html
console.log(header.innerHTML)
/* 顯示結果
<div class="logo">
			<a href="#section01">
				<img src="./images/logo.png" alt="快打旋風" title="快打旋風">
			</a>
		</div>
		<ul class="menu">
			<li><a href="#section01">回首頁</a></li>
			<li><a href="#section02">遊戲介紹</a></li>
			<li><a href="#section03">角色列表</a></li>
			<li><a href="#section04">個性套裝</a></li>
			<li><a href="#section05">關卡對戰</a></li>
			<li><a href="#footer">關於我們</a></li>
		</ul> */

// 取得所有 a 標籤，結果會得到一個陣列
// 不能用 array.forEach 跑，但是可以用 for / for in / for of
const links = document.getElementsByTagName('a')

for (let link of links) {
  // 修改文字
  link.innerText = '我改'
}

console.log(links)
/* 顯示結果
HTMLCollection(8)
0: a
1: a
2: a
3: a
4: a
5: a
6: a
7: a
length: 8 */

// 用 class 抓取元素
const menus = document.getElementsByClassName('menu')
for (let menu of menus) {
  // 取 CSS 值
  console.log(menu.style.background)
  // 改 CSS 值
  menu.style.background = 'lightblue'
}

// 抓取某 ID 內的標籤
const section03Img = document.getElementById('section03').getElementsByTagName('img')
console.log(section03Img)
/* 顯示結果
HTMLCollection(44) 
[img, img, img, img, img, img, img, img, img, img, img, img, img, img, img, img, img, img, img, img, img, img, img, img, img, img, img, img, img, img, img, img, img, img, img, img, img, img, img, img, img, img, img, img]
 */

// 先選 role_list 的 class ， 再選第一個 role_list 的 Img 標籤
const roleList = document.getElementsByClassName('role_list')
const roleImg = roleList[0].getElementsByTagName('img')
//取第一張圖片的 src
console.log(roleImg[0].src)
//修改第一張圖片的 src
roleImg[0].src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS36cWKM1tPIycphOmWzdVU5G6VOB2EihLHRQ&usqp=CAU'

// querySelector 用 CSS 選擇器選取符合的第一個元素
const mainNews = document.querySelector('.main-news h1')
mainNews.innerText = 'Hi~Welcome^^'

// querySelectorAll 用 CSS 選擇器選取符合的所有元素
const containers = document.querySelectorAll('.container')
for (let container of containers) {
  container.style.background = 'url(https://cf.shopee.tw/file/e0113bcc0c429997b1f08f91a8cb1acb)'
  container.style.color = 'darkblue'
}

// 探索更多清單
const list1 = document.querySelector('.card ul')
console.log(list1)
/* 顯示結果
<ul>
      <li>熱門活動</li>
      <li>最新優惠</li>
      <li>遊戲資訊</li>
      <li>密技公開</li>
      <li>電競比賽</li>
    </ul> */

// children 選取清單 ul 的所有 li
for (let li of list1.children) {
  console.log(li.innerText)
}
/* 顯示結果
熱門活動
最新優惠
遊戲資訊
密技公開
電競比賽
熱門活動
最新優惠
遊戲資訊
密技公開
電競比賽 */

// ul 裡面的第一個 li 的 class 加上新 class
list1.firstElementChild.classList.add('text-color')
list1.lastElementChild.classList.add('text-center')

// 從遊戲資訊改後面第二個東西的字
list1.children[2].previousElementSibling.innerText = '下一個'
list1.children[2].nextElementSibling.innerText = '上一個'
// 從遊戲資訊改後面第二個東西的字
let el = list1.children[2]
for (let i = 1; i <= 2; i++) {
  el = el.nextElementSibling
}
el.innerText = '從遊戲資訊改最後一個'

// 改上層的屬性
header.parentElement.style.filter = 'hue-rotate(190deg)'

const iframe = document.getElementsByTagName('iframe')[0]
// 移除元素
iframe.remove()

// 在元素內插入 HTML ，有四個位置，beforeend, beforebegin, afterend, afterbegin
mainNews.insertAdjacentHTML(
  'afterend',
  '<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis sequi dignissimos maiores, expedita maxime est esse sed beatae consectetur adipisci! Saepe dolores exercitationem dolorum in eveniet quaerat iste incidunt dolore.</p>'
)
