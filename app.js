//app.js
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

    this.startConnect()

  },

  // 启动socket
  startConnect: function () {

    let id = wx.getStorageSync('company').id

    if (id) {

      let url = 'wss://zqrsjjz.jiahangit.com.cn' + '/zqhr/websocket/' + id

      console.log('开启socket')
      console.log('链接为：', url)

      // 创建链接
      sotk = wx.connectSocket({
        url: url,
        header: {
          "content-type": "application/json"
        },
        success: function (res) {
          console.log('创建成功', res)
        },
        fail: function (res) {
          modal.showToast('创建连接失败', 'none')
        }
      })

      // 监听开启
      sotk.onOpen(res => {
        socketOpen = true;
        console.log('监听 WebSocket 连接打开事件。', res);
      })

      // 监听关闭
      sotk.onClose(res => {
        socketOpen = false;
        console.log('监听 WebSocket 连接关闭事件。', onClose)
      })

      // 监听错误
      sotk.onError(onError => {
        socketOpen = true;
        console.log('监听 WebSocket 错误。错误信息', onError)
      })

      // 发送数据
      // wx.onSocketOpen(function () {
      //   wx.sendSocketMessage({
      //     data: 'stock',
      //   })
      // })

      // 收到消息
      sotk.onMessage(onMessage => {
        console.log('监听返回的数据内容：', onMessage);
        let data = JSON.parse(onMessage.data)
        console.log(data)
        // reMsg(data);
      })

    }

  },

  // 断开 webSoket的方法
  closeWebSocket() {
    sotk.close()
    socketOpen = false;
  },

  globalData: {
    imaUrl: 'https://zqrsjjz.jiahangit.com.cn/zqhr',
    notice: {}, //通知信息
    venue: {}, //会场信息
    worker: {}, //简历信息
  },

  onHide: function () {
    this.closeWebSocket();
  }

})