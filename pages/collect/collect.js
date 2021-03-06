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

    let token = wx.getStorageSync('token')
    if (token) {
      this.getList()
    } else {
      wx.showModal({
        title: '提示',
        content: '请先登录',
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

  // 收藏列表
  getList: function () {
    let that = this
    let data = {
      enterpriseInfoId: wx.getStorageSync('company').id,
      pageNo: that.data.page,
      pageSize: 10
    }
    util.sendRequest('/zqhr/app/resumecollection/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        that.setData({
          list: that.settle(res.result.records)
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

  // 取消收藏
  toCancle: function (e) {
    let that = this
    wx.showModal({
      title: "提示",
      content: "是否取消收藏",
      success: function (res) {
        if (res.confirm) {
          let list = that.data.list
          let index = e.currentTarget.dataset.index
          let data = {
            id: e.currentTarget.dataset.id
          }
          util.sendRequest('/zqhr/app/resumecollection/cancelcollection', 'get', data).then(function (res) {
            console.log(res)
            if (res.code == 200) {
              list.splice(index, 1)
              that.setData({
                list: list
              })
            } else {
              modal.showToast(res.message, 'none')
            }
          })
        }
      }
    })
  },

  // 查看简历详情
  toDetail: function (e) {
    let that = this
    let data = {
      id: e.currentTarget.dataset.id
    }
    util.sendRequest('/zqhr/hall/curriculumvitae/list', 'get', data).then(function (res) {
      console.log(res)
      if (res.code == 0) {
        that.addlog(that.settle(res.result.records))
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  addlog: function (detail) {
    let that = this
    let data = {
      curriculumVitaeId: detail[0].id,
      enterpriseInfoId: wx.getStorageSync('company').id
    }
    util.sendRequest('/zqhr/app/interview/browse', 'get', data).then(function (res) {
      console.log(res)
      if (res.code == 200) {
        app.globalData.worker = detail[0]
        console.log(detail[0])
        wx.navigateTo({
          url: '/pages/vitae/vitae',
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 邀请面试
  toInvite: function (e) {
    let that = this
    let detail = e.currentTarget.dataset.item
    console.log(detail)
    wx.showModal({
      title: '提示',
      content: "是否发送面试邀约给该投递人",
      success: function (res) {
        if (res.confirm) {
          let date = new Date()
          let time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
          let data = {
            createBy: wx.getStorageSync('company').id,
            curriculumVitaeId: that.data.detail.id,
            enterpriseInfoId: detail.enterpriseInfoId,
            enterprisePostReleaseId: detail.id,
            interviewstate: 'invite',
            submitResumeTime: time
          }
          util.sendRequest('/zqhr/app/interview/invite', 'post', data).then(function (res) {
            console.log(res)
            if (res.code == 200) {
              modal.showToast(res.message)
            } else {
              modal.showToast(res.messgae, 'none')
            }
          })
        }
      }
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
      pageNo: that.data.page + 1,
      pageSize: 10
    }
    util.sendRequest('/zqhr/app/resumecollection/list', 'get', data).then(function (res) {
      console.log(res)
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

  onShow: function () {

    app.setWatcher(app.noticeData, this); // 设置监听器

  }
})