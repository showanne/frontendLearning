import defaultt from './default.js'

// 個別引用具名匯入匯出
// import { number1 } from './name.js'
// 一次引用具名匯入匯出，給所有東西一個名字叫 name
// import * as name from './name.js'
// 個別引用具名匯入匯出並重新取名
import { number1 as apple } from './name.js'

// 同時引用預設和具名匯入匯出
import all, { number1 } from './all.js'

console.log(defaultt.number1)
console.log(defaultt.number2)
console.log(defaultt.add(5, 10))

// console.log(number1)
// console.log(name)
console.log(apple)

console.log(all)
console.log(number1)
