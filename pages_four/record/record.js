const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  data: {
    page: 1,
    list: [],
    ed_type: false,
    show: true,
    interviewstate: 'invite'
  },

  onShow: function () {

    app.setWatcher(app.noticeData, this); // 设置监听器

    this.setData({
      imaUrl: app.globalData.imaUrl
    })
    this.setData({
      page: 1
    })
    this.getList()
  },
  cutstate() {
    var that = this
    if(that.data.show == true) {
      this.setData({
        show: false,
        interviewstate: 'finish'
      })
    } else {
      this.setData({
        show: true,
        interviewstate: 'invite'
      })
    }
    this.getList()
    
  },
  // 列表
  getList: function () {
    let that = this
    let data = {
      enterpriseInfoId: wx.getStorageSync('company').id,
      interviewstate: that.data.interviewstate,
      pageNo: that.data.page,
      pageSize: 10
    }
    util.sendRequest('/zqhr/app/interview/list', 'get', data).then(function (res) {
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
      // let work = util.calculates(item)
      // item.workExperience = work
      item.age = age
      arr.push(item)
    })
    return arr;
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

  // 新增面试
  toAdd: function () {
    wx.navigateTo({
      url: '/pages_four/add_record/add_record',
    })
  },

  // 删除记录
  toDetele: function (e) {
    let that = this
    wx.showModal({
      title: "提示",
      content: "是否删除该面试记录",
      success: function (res) {
        if (res.confirm) {
          let index = e.currentTarget.dataset.index
          let list = that.data.list
          let data = {
            id: e.currentTarget.dataset.id
          }
          util.sendRequest('/zqhr/app/interview/delete', 'get', data).then(function (res) {
            console.log(res)
            if (res.code == 200) {
              modal.showToast(res.message)
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
    util.sendRequest('/zqhr/app/interview/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        let news = res.result.records
        if (news.length != 0) {
          that.setData({
            page: data.pageNo,
            list: old.concat(news)
          })
        } else {
          // modal.showToast('已经到底', 'none')
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


})