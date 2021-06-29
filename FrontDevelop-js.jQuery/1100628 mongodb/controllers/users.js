import users from '../models/users.js'

// 新增商品資料
export const createUser = async (req, res) => {
  // post http://localhost:3020/users
  try {
    let result = await users.create(req.body)
    console.log(typeof result)
    // .toObject() 將回傳的 Mongoose Document(Mongoose 特有格式，非JSON物件) 格式轉為 JS 格式才能進行相關操作
    result = result.toObject()
    // 回傳時 刪除密碼欄位 顯示
    delete result.password

    console.log(result)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      // 如果是驗證錯誤
      // 因為驗證錯誤是拿資料欄位當 key 值，所以用 Object.keys 取第一個
      const key = Object.keys(error.errors)[0]
      // 取驗證失敗的訊息
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

// 新增訂單進購物車
export const createOrder = async (req, res) => {
  // post http://localhost:3020/users/使用者 id/orders
  try {
    let result = await users.findByIdAndUpdate(req.params.id, {
      // 將資料傳進 OrderItemSchema 然後再放到 OrderSchema items[]，接著放到 userSchema orders[]
      $push: {
        orders: {
          date: new Date(),
          items: req.body.items
        }
      }
    }, {new: true})
    // 回傳新增的該筆訂單資料
    // 先將 result 格式轉為 json 格式，並取 result內的 orders 陣列最後一筆資料顯示
    result = result.toObject().orders.reverse()[0]
    res.status(200).send({success: true, message: '', result})
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

// 查詢 使用者新增的購物車資料
export const getOrders = async (req, res) => {
  // get http://localhost:3020/users/使用者 id/orders
  try {
    // populate 會回傳 該筆 (p_id) 商品的所有內容
    // -> 即取 ref: 'xxx' 的資料
    // orders.items.p_id 就是 userSchema orders[] 的 OrderSchema items[] 的 OrderItemSchema p_id{}
    // .lean() 把 mongoose 資料型態變為 一般 JS {} 型態
    const result = await users.findById(req.params.id, 'orders').populate('orders.items.p_id').lean()
    res.status(200).send({success: true, message: '', result})
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '查無使用者' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

// 查詢 某指定訂單的資料
export const getOrder = async (req, res) => {
  // get http://localhost:3020/users/orders/訂單 id
  try {
    // findOne 找一筆資料
    // _id: req.params.uid   找 _id 是使用者傳進來的 id
    // 'orders._id': req.params.oid   找 orders._id 是新訂單的 id
    // .findOne({_id: req.params.uid, 'orders._id': req.params.oid}, 'orders')  <- 查詢結果為id 是有該筆 orders._id 的訂單資訊，所以還是會全部訂單出現
    // {'orders.$': 1} 意思是查詢到符合($) orders._id 的第一筆
    const result = await users.findOne(
      {
        'orders._id': req.params.id
      },{
        'orders.$': 1
      }
    ).populate('orders.items.p_id').lean()
    res.status(200).send({success: true, message: '', result})
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '查無使用者' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

// 更新 訂單內單個商品的數量
export const updateOrder = async (req, res) => {
  // patch http://localhost:3020/users/orders/訂單 id
  // body 輸入修改的值 "p_id": "訂單內的商品 p_id", "amount": 修改的數量
  try {
    // 簡單版
    // 第一步: 找出符合的資料
    const result = await users.findOne({
      'orders._id': req.params.id,
      'orders.items.p_id': req.body.p_id
    })
    // 第二步: 直接做陣列處理改資料
    // .toString() 將 moogoose 資料型態改為 一般資料型態 可使判斷成立 2邊型態相等
    const orderidx = result.orders.findIndex(order => {
      return order._id.toString() === req.params.id
    })
    const itemidx = result.orders[orderidx].items.findIndex(item => {
      return item.p_id.toString() === req.body.p_id
    })
    result.orders[orderidx].items[itemidx].amount = req.body.amount
    // 第三步: 存回去
    result.save()
    res.status(200).send({success: true, message: '', result})

    // 複雜版
    // const result = await users.findOneAndUpdate(
    //   // 尋找符合指定的 orders 的 id 和 orders 內的商品 p_id
    //   {
    //     'orders._id': req.params.id,
    //     'orders.items.p_id': req.body.p_id
    //   },
    //   // 將找到的第一筆設定為傳入的新數量
    //   {
    //     $set: {
    //       'orders.$[a].items.$[b].amount': req.body.amount
    //     }
    //   },
    //   { new: true, arrayFilters: [{'a._id': req.params.id}, {'b.p_id': req.body.p_id}] }
    // )
    // res.status(200).send({success: true, message: ''})
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '查無使用者' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

// 刪除 指定訂單的整筆資料
export const delOrder  = async (req, res) => {
  // delete http://localhost:3020/users/orders/訂單 id
  try {
    const result = await users.findOneAndUpdate(
      {'orders._id': req.params.id},
      {
        // 刪除陣列，裡面放條件
        $pull: {
          // 要刪除的陣列的欄位名稱
          orders: {
            // _id 符合傳進來的 id
            _id: req.params.id
          }
        }
      }
    )
    res.status(200).send({success: true, message: ''})
  } catch (error) {
    console.log(error);
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '查無使用者' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}