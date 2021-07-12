import multer from 'multer'
import FTPStorage from 'multer-ftp'
import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

// 收到檔案後的儲存設定
let storage
if (process.env.FTP === 'true') {
  storage = new FTPStorage({
    ftp: {
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASS,
      secure: false
    },
    destination (req, file, options, callback) {
      // 用時間當檔名，這裡的檔名是完整的路徑
      callback(null, '/' + Date.now() + path.extname(file.originalname))
    }
  })
} else {
  storage = multer.diskStorage({
    // 存放位置
    destination (req, file, callback) {
      // 用 path 套件將目前 node.js 執行的資料夾和 upload 組成路徑
      const folder = path.join(process.cwd(), '/upload')
      // 如果路徑不存在
      if (!fs.existsSync(folder)) {
        // 建立資料夾
        fs.mkdirSync(folder)
      }
      callback(null, 'upload/')
    },
    // 檔案命名規則
    filename (req, file, callback) {
      // 使用日期當檔名，加上原始檔案的副檔名
      callback(null, Date.now() + path.extname(file.originalname))
    }
  })
}

// 設定 multer
const upload = multer({
  storage,
  // 過濾檔案，因為內建的 limits 無法過濾檔案類型所以要自己寫
  fileFilter (req, file, callback) {
    // 檢查檔案類型是不是圖片
    if (!file.mimetype.includes('image')) {
      // 觸發一個自訂的 LIMIT_FORMAT 錯誤，因為套件內建的錯誤都是 LIMIT 開頭，所以跟隨套件風格
      callback(new multer.MulterError('LIMIT_FORMAT'), false)
    } else {
      callback(null, true)
    }
  },
  // 限制上傳檔案
  limits: {
    // 大小 1MB
    fileSize: 1024 * 1024
  }
})

export default async (req, res, next) => {
  // 只接受上傳一個欄位是 image 的檔案
  upload.single('image')(req, res, async error => {
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
      console.log(error)
      // 其他錯誤
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    } else {
      // 沒有錯誤就繼續
      // req.file 是傳入的檔案資訊
      if (req.file) {
        console.log(req.file)
        req.filepath = process.env.FTP ? path.basename(req.file.path) : req.file.filename
      }
      next()
    }
  })
}
