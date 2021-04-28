//  如果是要匯入檔案一定要加 " ./"
import defaultT from './default.js'
// console.log(defaultT)
console.log(defaultT.number1)
console.log(defaultT.number2)
console.log(defaultT.add(3, 6))

// 具名匯入-個別匯入 以解構方式取得，變數名字需相同，以 {} 包起來
// import { number1, number2 } from './name.js'
// console.log(number1)

// 具名匯入-一次全部匯入 並給所有東西一個名字叫 name
import * as name from './name.js'
console.log(name)

// 具名匯入-個別匯入並重新取名
import { number1 as A } from './name.js'
console.log(A)

// 同時引用 預設 和 具名匯入
import all, { number } from './all.js'
console.log(all)
console.log(number)
