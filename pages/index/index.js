const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'



Page({

  data: {
    banners: [
      {
        thumb: 'http://120.79.207.87:8091//img/zqzpImg/1.jpg'
      },
      {
        thumb: 'http://120.79.207.87:8091//img/zqzpImg/2.jpg'
      }
    ],
    notelist: [],

    companycount: 0,

    jobcount: 0,

    notecount: 0,

    noevaluationCount: ''

  },

  onLoad: function (options) {
    this.setData({
      imaUrl: app.globalData.imaUrl
    })

    this.getList()
  },

  getData: function () {
    let that = this
    let data = {
      enterpriseInfoId: wx.getStorageSync('company').id
    }
    util.sendRequest('/zqhr/hall/statistics/EnterpriseHomePageStatistics', 'get', data, 1).then(function (res) {
      if (res.code == 0) {
        that.setData({
          companycount: res.result.enterpriseCount,
          jobcount: res.result.postReleaseCount,
          notecount: res.result.curriculumVitaeCount,
          noevaluationCount: res.result.noevaluationCount
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
        that.settle(res.result.records)
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
      item.age = age
      arr.push(item)
    })
    that.setData({
      notelist: arr
    })
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
      modal.showToast('已经进行登录', 'none')
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
      console.log(res.result)
      if (res.code == 200) {
        wx.navigateTo({
          url: '/pages_one/ticket/ticket',
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
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