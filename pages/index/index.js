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
      },
      {
        thumb: 'http://120.79.207.87:8091//img/zqzpImg/3.jpg'
      }
    ],
    notelist: [],

    companycount: '',

    jobcount: '',

    notecount: ''

  },

  onLoad: function (options) {
    this.setData({
      imaUrl: app.globalData.imaUrl
    })
    this.getData()

    this.getList()
  },

  getData: function () {
    let that = this
    util.sendRequest('/jeecg-boot/hall/statistics/HomePageStatistics', 'get', {}).then(function (res) {
      if (res.code == 0) {
        that.setData({
          companycount: res.result.enterpriseCount,
          jobcount: res.result.postReleaseCount,
          notecount: res.result.curriculumVitaeCount
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  getList: function () {
    let that = this
    let data = {
      pageNo: 1,
      pageSize: 5
    }
    util.sendRequest('/jeecg-boot/hall/curriculumvitae/list', 'get', data).then(function (res) {
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
      if (item.enable == 1) {
        let age = util.ages(item)
        item.age = age
        arr.push(item)
      }
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
    wx.navigateTo({
      url: '/pages/login/login',
    })
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
      let sign = wx.getStorageSync('sign')
      if (sign) {
        wx.scanCode({
          onlyFromCamera: true,
          scanType: 'qrCode',
          success: function (res) {
            console.log(res)
            let arr = []
            arr = res.result.split("|")
            console.log(arr)
            wx.navigateTo({
              url: '/pages_one/gain/gain?code=' + arr[0] + '&sid=' + arr[1],
            })
          }
        })
      } else {
        wx.showModal({
          title: "提示",
          content: "请先扫码签到",
          showCancel: false,
        })
      }
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
    wx.navigateTo({
      url: '/pages_one/ticket/ticket',
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

  // 更多
  toMore: function () {
    wx.switchTab({
      url: '/pages/person/person',
    })
  },

  // 简历
  toWorkerdetial: function (e) {
    app.globalData.worker = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/vitae/vitae',
    })
  }
})