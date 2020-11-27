const util = require('utils/util.js')
const { default: modals } = require('./modals')

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

  // 模拟watch周期
  /**
 * 设置监听器
 */
  setWatcher(data, page) { // 接收index.js传过来的data对象和watch对象
    var watch = page.watch;
    Object.keys(watch).forEach(v => {
      let key = v.split('.'); // 将watch中的属性以'.'切分成数组
      let nowData = data; // 将data赋值给nowData
      for (let i = 0; i < key.length - 1; i++) { // 遍历key数组的元素，除了最后一个！
        nowData = nowData[key[i]]; // 将nowData指向它的key属性对象
      }
      let lastKey = key[key.length - 1];
      let watchFun = watch[v].handler || watch[v]; // 兼容带handler和不带handler的两种写法
      let deep = watch[v].deep; // 若未设置deep,则为undefine
      this.observe(nowData, lastKey, watchFun, deep, page); // 监听nowData对象的lastKey
    })
  },
  /**
	 * 监听属性 并执行监听函数
	 */
  observe(obj, key, watchFun, deep, page) {
    var val = obj[key];
    if (deep && val != null && typeof val === 'object') {
      Object.keys(val).forEach(childKey => { // 遍历val对象下的每一个key
        this.observe(val, childKey, watchFun, deep, page); // 递归调用监听函数
      })
    }
    var that = this;
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set: function (value) {
        // 用page对象调用,改变函数内this指向,以便this.data访问data内的属性值
        watchFun.call(page, value, val); // value是新值，val是旧值
        val = value;
        if (deep) { // 若是深度监听,重新监听该对象，以便监听其属性。
          that.observe(obj, key, watchFun, deep, page);
        }
      },
      get: function () {
        return val;
      }
    })
  },

  onShow: function () {
    // 倒计时
    let that = this
    let token = wx.getStorageSync('token')
    if (token) {
      let i = setInterval(() => {
        clearInterval(i) //停止定时器
        let data = {
          enterpriseInfoId: wx.getStorageSync('company').id,
          pageNo: 1,
          pageSize: 10
        }
        util.sendRequest('/zqhr/hall/curriculumvitae/Matchinglist', 'get', data,'1').then(function (res) {
          if (res.code == 0) {
            let list = that.settle(res.result.records)
            let total = res.result.total
            console.log('计时结束：',total)
            // 判断
            if (total != 0) {
              that.noticeData.noticeList = list
              that.noticeData.noticeTotal = total
              that.noticeData.admission = true
            } else {
              that.onShow()
            }
          } else {
            modals.showToast(res.message, 'none')
          }
        })
      }, 300000);
    }
  },

  // 整理，并计算求职者年龄
  settle: function (list) {
    let that = this
    let arr = []
    list.forEach(function (item) {
      let age = util.ages(item)
      let work = util.calculates(item)
      item.workExperience = work
      item.age = age
      arr.push(item)
    })
    return arr
  },

  noticeData: { //通知数据
    admission: false,
    noticeList: [],
    noticeTotal: ''
  },

  globalData: {
    appid: 'wx401a2c2d3d422ffd', //appid
    secret: '5565ab098b19b34e258f1426ba76772c',
    imaUrl: 'https://zqrsjjz.jiahangit.com.cn/zqhr',
    notice: {}, //通知信息
    venue: {}, //会场信息
    worker: {}, //简历信息
    codeData: {}, //入场券信息
    describe: '',
    detail: {} // 职位详细信息
  }

})