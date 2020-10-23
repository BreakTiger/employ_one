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
          if (res.data.code == 300) {
            wx.showModal({
              title: "提示",
              content: "登录失效，请重新登录",
              success: function (res) {
                if (res.confirm) {

                  // 清空所有的缓存
                  wx.clearStorage()

                  wx.navigateTo({
                    url: '/pages/login/login',
                  })
                }
              }
            })
          } else {
            resolve(res.data);
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
  console.log('图片路径', filePath)
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
  let time = []
  let bir = item.birthday
  time = bir.split('-')
  let age = n_year - time[0]
  return age;
}

// 计算从业时间
function calculates(item) {
  let that = this

  let work = ''

  let one = item.workingHoursStart.split('-')
  let two = item.workingHoursEnd.split('-')

  let num = two[0] - one[0]

  // console.log(num)

  if (num == 0) {
    work = "一年以下"
  } else {
    work = num + '年'
  }

  console.log(work)


}


module.exports = {
  sendRequest: sendRequest,
  upLoading: upLoading,
  ages: calculate,
  calculates: calculates
}


