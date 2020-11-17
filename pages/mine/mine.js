const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  data: {
    login: 0,
    company: {},
    detail: {},

  },


  onLoad: function (options) {
    this.setData({
      imgUrl: app.globalData.imaUrl
    })

    let that = this
    let token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }

    app.setWatcher(app.noticeData, this); // 设置监听器

  },

  watch: { // 监听
    admission(newValue) { // admission 要监测的具体数据
      let that = this
      if (newValue == true) {
        that.setData({
          total: app.noticeData.noticeTotal,
          nlist: app.noticeData.noticeList
        })
        that.showDialog();
      }
    }
  },

  onReady: function () {
    this.dialog = this.selectComponent("#dialog");
  },

  showDialog() { // 显示弹出框
    this.dialog.showDialog();
  },

  //取消事件
  _cancelEvent() {
    app.noticeData.admission = false
    this.dialog.hideDialog();
    app.onShow()
  },

  //确认事件
  _confirmEvent() {
    app.noticeData.admission = false
    wx.navigateTo({
      url: '/pages/list/list?list=' + JSON.stringify(app.noticeData.noticeList)
    })
    this.dialog.hideDialog();
    app.onShow()
  },

  onShow: function () {
    let that = this
    let token = wx.getStorageSync('token')
    if (token) {
      that.getData()
    }
  },

  getData: function () {
    let that = this
    let data = {
      enterpriseInfoId: wx.getStorageSync('company').id
    }
    util.sendRequest('/zqhr/hall/statistics/EnterpriseStatistics', 'get', data).then(function (res) {
      console.log(res.result)
      if (res.code == 0) {
        let company = res.result.enterprise
        wx.setStorageSync('company', company)
        that.setData({
          detail: res.result,
          company: wx.getStorageSync('company'),
          login: 1
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 登陆
  toLogin: function () {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },



  // 退出登录
  loginout: function () {
    let that = this
    wx.showModal({
      title: "提示",
      content: "是否退出登录",
      success: function (res) {
        if (res.confirm) {
          let data = {
            token: wx.getStorageSync('token')
          }
          util.sendRequest('/zqhr/app/user/logout', 'get', data).then(function (res) {
            if (res.code == 0) {
              modal.showToast(res.message)
              wx.clearStorage()
              that.setData({
                login: 0,
                detail: {}
              })
            } else {
              modal.showToast(res.message, 'none')
            }
          })
        }
      }
    })
  },

  // 跳转:

  //收到简历
  toCount: function () {
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages_four/vitae_count/vitae_count',
      })
    } else {
      wx.showModal({
        title: "提示",
        content: "请先登录",
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        }
      })
    }

  },

  // 编辑企业信息
  toEditcompany: function (e) {
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: "/pages_four/edit/edit"
      })
    } else {
      wx.showModal({
        title: "提示",
        content: "请先登录",
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        }
      })
    }
  },

  // 媒体上传
  upMedia: function () {
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages_four/media/media',
      })
    } else {
      wx.showModal({
        title: "提示",
        content: "请先登录",
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        }
      })
    }
  },

  // 员工管理
  toStaff: function () {
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages_four/staff/staff',
      })
    } else {
      wx.showModal({
        title: "提示",
        content: "请先登录",
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        }
      })
    }
  },

  //面试记录
  toHistory: function () {
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages_four/history/history',
      })
    } else {
      wx.showModal({
        title: "提示",
        content: "请先登录",
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        }
      })
    }
  },

  // 匹配简历
  toMatchnote: function () {
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: "/pages_four/match/match"
      })
    } else {
      wx.showModal({
        title: "提示",
        content: "请先登录",
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        }
      })
    }
  },

  // 职位管理
  toMyjoblist: function (e) {
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: "/pages_four/position/position"
      })
    } else {
      wx.showModal({
        title: "提示",
        content: "请先登录",
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        }
      })
    }

  },

  // 面试管理
  vitae: function () {
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages_four/record/record',
      })
    } else {
      wx.showModal({
        title: "提示",
        content: "请先登录",
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        }
      })
    }

  },

  // 收藏简历
  collect: function () {
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/collect/collect',
      })
    } else {
      wx.showModal({
        title: "提示",
        content: "请先登录",
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        }
      })
    }

  },

  onPullDownRefresh: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    let token = wx.getStorageSync('token')
    if (token) {
      this.getData()
    }
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
  },
})