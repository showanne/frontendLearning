const number1 = 1
const number2 = 2

const add = (num1, num2) => {
  return num1 + num2
}

// 一個檔案只有一個 export，要傳多個值用 {} 包起來
export default {
  number1,
  number2,
  add
}
