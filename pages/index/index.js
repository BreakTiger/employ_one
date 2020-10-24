const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  data: {
    banners: [],

    notelist: [],

    companycount: 0,

    jobcount: 0,

    notecount: 0,

    noticeCount: 0,

    noevaluationCount: ''

  },

  onLoad: function (options) {
    this.setData({
      imaUrl: app.globalData.imaUrl
    })

    this.getBanner()

    this.getList()

    app.setWatcher(app.noticeData, this); // 设置监听器

  },

  getBanner: function () {
    let that = this
    util.sendRequest('/zqhr/app/enterprisenotice/rotatepictures', 'get', {}).then(function (res) {
      if (res.code == 0) {
        that.setData({
          banners: res.result
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
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

  getData: function () {
    let that = this
    let data = {
      enterpriseInfoId: wx.getStorageSync('company').id
    }
    util.sendRequest('/zqhr/hall/statistics/EnterpriseHomePageStatistics', 'get', data, 1).then(function (res) {
      if (res.code == 0) {
        console.log(res.result)
        that.setData({
          companycount: res.result.enterpriseCount,
          jobcount: res.result.postReleaseCount,
          notecount: res.result.curriculumVitaeCount,
          noevaluationCount: res.result.noevaluationCount,
          noticeCount: res.result.noticeCount
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  getList: function () {
    let that = this
    let data = {
      overt: 1,
      pageNo: 1,
      pageSize: 5
    }
    util.sendRequest('/zqhr/hall/curriculumvitae/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        that.setData({
          notelist:that.settle(res.result.records)
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
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

  // 搜索
  toSearch: function () {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  // 招聘会
  toMeeting: function () {
    wx.switchTab({
      url: '/pages/venue/venue',
    })
  },

  // 企业登录
  companyLogin: function () {
    let token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      modal.showToast('已经登录', 'none')
    }
  },

  // 扫码签到
  scanSign: function () {
    let token = wx.getStorageSync('token')
    if (token) {
      wx.scanCode({
        onlyFromCamera: true,
        scanType: 'qrCode',
        success: function (res) {
          console.log(res)
          let id = wx.getStorageSync('company').id
          let sid = res.result
          wx.navigateTo({
            url: '/pages_one/sign/sign?id=' + id + '&sid=' + sid,
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请您先登录',
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

  // 我的收藏
  myCollect: function () {
    wx.navigateTo({
      url: '/pages/collect/collect',
    })
  },

  // 扫码领取
  scanGet: function () {
    let token = wx.getStorageSync('token')
    if (token) {
      wx.scanCode({
        onlyFromCamera: true,
        scanType: 'qrCode',
        success: function (res) {
          console.log(res)
          wx.navigateTo({
            url: '/pages_one/gain/gain?code=' + res.result,
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请您先登录',
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

  // 入场券
  ticket: function () {
    let data = {
      token: wx.getStorageSync('token')
    }
    util.sendRequest('/zqhr/app/ticket/getticket', 'get', data).then(function (res) {
      if (res.code == 200) {
        app.globalData.codeData = res.result
        wx.navigateTo({
          url: '/pages_one/ticket/ticket',
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 通知
  notice: function () {
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages_four/notice/notice',
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请您先登录',
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

  // 发布职位
  toAddCompanyjob: function () {
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/addJob/addJob',
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

  toManage: function () {
    wx.navigateTo({
      url: '/pages_four/record/record',
    })
  },

  // 更多
  toMore: function () {
    wx.switchTab({
      url: '/pages/person/person',
    })
  },

  // 简历
  toWorkerdetial: function (e) {
    let token = wx.getStorageSync('token')
    if (token) {
      let that = this
      let detail = e.currentTarget.dataset.item
      let data = {
        curriculumVitaeId: detail.id,
        enterpriseInfoId: wx.getStorageSync('company').id
      }
      util.sendRequest('/zqhr/app/interview/browse', 'get', data).then(function (res) {
        console.log(res)
        if (res.code == 200) {
          app.globalData.worker = detail
          wx.navigateTo({
            url: '/pages/vitae/vitae',
          })
        } else {
          modal.showToast(res.message, 'none')
        }
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

  onShow: function () {
    let token = wx.getStorageSync('token')
    if (token) {
      this.getData()
    }
  },


  onPullDownRefresh: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    this.getList()
    let token = wx.getStorageSync('token')
    if (token) {
      this.getData()
    }
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
  }


})