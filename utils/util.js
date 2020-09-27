const { default: modals } = require("../modals")

// 网络请求 - 封装文件
const api = "https://zqrsjjz.jiahangit.com.cn" //域名头部


//请求分装 -  不带有登录判断
function sendRequest(url, method, data, loading) {

  var promise = new Promise(function (resolve, reject) {

    if (!loading) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
    }

    wx.request({
      url: api + url,
      method: method,
      data: data,
      header: {
        "content-type": "application/json"
      },
      success: function (res) {
        if (!loading) {
          wx.hideLoading()
        }
        if (res.statusCode == 200) {
          if (res.data.success) {
            resolve(res.data);
          } else {
            wx.showModal({
              title: "提示",
              content: "登录失效，请重新登录",
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/pages/login/login',
                  })
                }
              }
            })
          }
        } else {
          wx.showModal({
            title: "提示",
            content: '访问失败，请检查网络连接情况'
          })
        }
      },
      fail: function (res) {
        if (!loading) {
          wx.hideLoading()
        }
        reject(res);
      }
    })
  })
  return promise;
}

// 上传
function upLoading(filePath, data) {
  var promise = new Promise(function (resolve, reject) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.uploadFile({
      filePath: filePath,
      name: 'file',
      url: api + '/zqhr/base/upload',
      formData: data,
      header: {
        "content-type": "application/json"
      },
      success: function (res) {
        wx.hideLoading()
        if (res.statusCode == 200) {
          resolve(res.data)
        } else {
          resolve(res.data)
        }
      },
      fail: function (res) {
        wx.hideLoading()
        reject(res)
      }
    })
  })
  return promise
}

// 计算年龄
function calculate(item) {
  let that = this

  let date = new Date()
  let n_year = date.getFullYear()
  // console.log('年份：', n_year)

  let time = []
  let bir = item.birthday
  time = bir.split('-')
  // console.log('出生年份：', time[0])

  let age = n_year - time[0]

  // console.log('年龄：', age)

  return age;
}


module.exports = {
  sendRequest: sendRequest,
  upLoading: upLoading,
  ages: calculate
}


