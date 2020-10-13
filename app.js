const util = require('utils/util.js')

let sotk = null; //连接对象
let socketOpen = false; //连接状态




App({

  onLaunch: function () {

    // 强制更新版本
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onShow: function () {
    // 30分钟倒计时

    // wx.showModal({
    //   title: '人才匹配通知',
    //   content: '已检测到15位符合您企业发布职位要求的人才进入会场，是否点击查看',
    //   cancelText: '返回',
    //   confirmText: '查看',
    //   confirmColor: '#3274e5',
    //   success: function (res) {
    //     if (res.confirm) {
        
    //     } else if (res.cancel) {
          
    //     }
    //   }
    // })
  },
  globalData: {
    imaUrl: 'https://zqrsjjz.jiahangit.com.cn/zqhr',
    notice: {}, //通知信息
    venue: {}, //会场信息
    worker: {}, //简历信息
  }
})