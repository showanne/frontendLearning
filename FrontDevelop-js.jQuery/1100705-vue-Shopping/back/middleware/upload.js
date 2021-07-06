// 處理使用者丟的檔案 套件
import multer from 'multer'
// 將檔案丟ftp 套件
import FTPStorage from 'multer-ftp'
// 處理跟路經有關的事情 套件
import path from 'path'
// 處理跟檔案資料夾有關的事情 套件
import fs from 'fs'

import dotenv from 'dotenv'

dotenv.config()

// 先命名一個 storage 變數，沒加 =''代表  undefined
let storage
// 收到檔案後的儲存設定
// 判斷是否上傳 FTP
if (process.env.FTP === 'true') {
  storage = new FTPStorage({
    ftp: {
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASS,
      secure: false // 安全傳輸設定
    },
    // secure: false  安全傳輸設定
    destination (req, file, options, callback) {
      // 用時間當檔名，這裡的檔名是完整的路徑
      callback(null, '/' + Date.now() + path.extname(file.originalname))
    }
  })
} else {
  // 不上傳 FTP 存電腦
  storage = multer.diskStorage({
    // 存放位置 / file 上傳的檔案
    destination (req, file, callback) {
      // 用 path 套件將目前 node.js 執行的資料夾和 upload 組成路徑
      // path.join 將路徑組合在一起
      // ex path.join('c:\\'+'zz'+'aa.jpg') → c:/zz/aa.jpg
      const folder = path.join(process.cwd(), '/upload')
      // 如果路徑不存在
      if (!fs.existsSync(folder)) {
        // 建立新資料夾
        fs.mkdirSync(folder)
      }
      // callback (錯誤做的事, 成功做的事 'upload/' -> 放到 upload 資料夾)
      callback(null, 'upload/')
    },
    // 檔案命名規則
    filename (req, file, callback) {
      // Date.now() 使用日期當檔名，path.extname 加上原始檔案的副檔名
      callback(null, Date.now() + path.extname(file.originalname))
    }
  })
}

// 設定 multer
const upload = multer({
  storage,
  // 過濾檔案，因為內建的 limits 無法過濾檔案類型所以要自己寫
  fileFilter (req, file, callback) {
    console.log(file)
    // 檢查檔案類型(mimetype)是不是圖片
    if (!file.mimetype.includes('image')) {
      // 觸發一個自訂的 LIMIT_FORMAT 錯誤，因為套件內建的錯誤都是 LIMIT 開頭，所以跟隨套件風格
      // callback (錯誤做的事, 成功做的事)
      callback(new multer.MulterError('LIMI_FORMAT'), false)
    } else {
      callback(null, true)
    }
  },
  // 限制上傳檔案
  limits: {
    // 大小 1MB 1024 = 1kb
    fileSize: 1024 * 1024
  }
})

export default async (req, res, next) => {
  // 只接受上傳一個欄位是 image 的檔案
  upload.single('image')(req, res, async error => {
    // multer.MulterError 檔案上傳錯誤
    if (error instanceof multer.MulterError) {
      // 如果上傳發生錯誤
      let message = '上傳錯誤'
      if (error.code === 'LIMIT_FILE_SIZE') {
        message = '檔案太大'
      } else if (error.code === 'LIMIT_FORMAT') {
        message = '格式不符'
      }

      res.status(400).send({ success: false, message })
    } else if (error) {
      // 其他錯誤
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    } else {
      // 沒有錯誤就繼續
      // req.file 是傳入的檔案資訊
      if (req.file) {
        // 將檔案儲存路徑放到 req
        // console.log(req.file)
        // req.file.path = req.file.filename
        // 2個套件的存取路徑不同
        req.filepath = process.env.FTP ? path.basename(req.file.path) : req.file.filename
      }
      next()
    }
  })
}
