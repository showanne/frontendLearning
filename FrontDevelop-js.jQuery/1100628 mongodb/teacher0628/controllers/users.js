import users from '../models/users.js'

export const createUser = async (req, res) => {
  try {
    let result = await users.create(req.body)
    result = result.toObject()
    delete result.password
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

export const createOrder = async (req, res) => {
  try {
    let result = await users.findByIdAndUpdate(req.params.id, {
      // 新增東西進陣列
      $push: {
        orders: {
          date: new Date(),
          items: req.body.items
        }
      }
    }, {new: true})
    // 回傳新增的該筆訂單資料
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

export const getOrders = async (req, res) => {
  try {
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

export const getOrder = async (req, res) => {
  try {
    const result = await users.findOne({'orders._id': req.params.id}, {'orders.$': 1}).populate('orders.items.p_id').lean()
    res.status(200).send({success: true, message: '', result})
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '查無使用者' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const updateOrder = async (req, res) => {
  try {
    // 簡單版
    // 第一步: 找出符合的資料
    const result = await users.findOne({
      'orders._id': req.params.id,
      'orders.items.p_id': req.body.p_id
    })
    // 第二步: 直接做陣列處理改資料
    const orderidx = result.orders.findIndex(order => {
      return order._id = req.params.id
    })
    const itemidx = result.orders[orderidx].items.findIndex(item => {
      return item.p_id = req.body.p_id
    })
    result.orders[orderidx].items[itemidx].amount = req.body.amount
    // 第三步: 存回去
    result.save()
    
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

export const delOrder  = async (req, res) => {
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
