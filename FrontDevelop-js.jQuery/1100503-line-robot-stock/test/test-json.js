// map
const colors = 'fff-613a3a-003049-d62828-f77f00-fcbf49-eae2b7-da2c38-226f54-276fbf-f4f0bb-183059-fa8334-fffd77-ffe882-388697-271033'.split('-').map(a => '#' + a)
console.log(colors)
// ["#fff", "#613a3a", "#003049", "#d62828", "#f77f00", "#fcbf49", "#eae2b7", "#da2c38", "#226f54", "#276fbf", "#f4f0bb", "#183059", "#fa8334", "#fffd77", "#ffe882", "#388697", "#271033"]

// let numbers2 = [100, 200, 300, 400]
// numbers2 = numbers2.filter(num => {
//   return num > 200
// })
// [300, 400]

// let numbers1 = [1, 2, 3, 4]
// numbers1 = numbers1.map(num => {
//   return num * 2
// })
// [2, 4, 6, 8]

// let arr = new Array()
// const obj = new Object()
// for (let i = 0; i < 10; i++) {
//   obj.color = `${i}`
//   obj.doors = `${i + 1}`
//   obj.mpg = 3

//   arr = arr.concat(obj)
// }
// console.log(JSON.stringify(arr))

const fruits = ['apple', 'grape', 'pear']
let arr = new Array()
let obj = new Object()
for (let i = 0; i < fruits.length; i++) {
  obj.num = i
  obj.fruit = fruits[i]
  arr = arr.concat(obj)
}
console.log(JSON.stringify(arr))

return
