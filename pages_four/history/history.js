const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  data: {
    page: 1,
    list: []
  },

  onLoad: function (options) {
    this.setData({
      imaUrl: app.globalData.imaUrl
    })
    this.getList()
  },

  getList: function () {
    let that = this
    let data = {
      enterpriseInfoId: wx.getStorageSync('company').id,
      interviewstate: 'finish',
      pageNo: that.data.page,
      pageSize: 10
    }
    util.sendRequest('/zqhr/app/interview/list', 'get', data).then(function (res) {
      console.log(res)
      if (res.code == 0) {
        that.setData({
          list: that.settle(res.result.records)
        })
      } else {
        modal.showToast(res.messgae, 'none')
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

  // 查看简历
  toWatch: function (e) {
    let that = this
    let item = e.currentTarget.dataset.item
    let data = {
      curriculumVitaeId: item.curriculumVitaeId,
      enterpriseInfoId: wx.getStorageSync('company').id
    }
    util.sendRequest('/zqhr/app/interview/browse', 'get', data).then(function (res) {
      if (res.code == 200) {
        app.globalData.worker = item
        wx.navigateTo({
          url: '/pages_four/workerdetail/workerdetail',
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  //评价面试
  toFinsh: function (e) {
    wx.navigateTo({
      url: '/pages_four/finish/finish?detail=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  },

  onPullDownRefresh: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    this.setData({
      page: 1
    })
    this.getList()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
  },

  onReachBottom: function () {
    let that = this
    let old = that.data.list
    let data = {
      enterpriseInfoId: wx.getStorageSync('company').id,
      interviewstate: 'finish',
      pageNo: that.data.page + 1,
      pageSize: 10
    }
    util.sendRequest('/zqhr/app/interview/list', 'get', data).then(function (res) {
      console.log(res.result.records)
      if (res.code == 0) {
        let news = res.result.records
        if (news.length != 0) {
          that.setData({
            list: old.concat(news),
            page: data.pageNo
          })
        } else {

        }
      } else {
        modal.showToast(res.messgae, 'none')
      }
    })
  }

})