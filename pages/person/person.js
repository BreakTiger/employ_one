const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 开关
    isCars: true,	// 区域开关

    isPrice: true,	// 行业开关

    isType: true, //学历开关

    list: [], //区域 行业

    //区域
    carid: 0,
    title: '',

    //行业
    priceid: 0,
    price: '',

    //学历
    typeid: 0,
    typetitle: "",

    // 人才列表
    page: 1,
    worklist: [],

  },

  onLoad: function (options) {

    this.setData({
      imaUrl: app.globalData.imaUrl
    })

    this.getList()

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

  // 人才列表
  getList: function () {
    let that = this
    let data = {
      pageNo: that.data.page,
      pageSize: 10,
      workArea: that.data.title,
      intendedPosition: that.data.price,
      education: that.data.typetitle,
      overt: 1
    }
    util.sendRequest('/zqhr/hall/curriculumvitae/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        that.setData({
          worklist: that.settle(res.result.records)
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
    return arr;
  },

  // 开关：

  // 区域
  selectCars: function () {
    let that = this
    let type = that.data.isCars
    if (type) {
      that.condition('area')
      this.setData({
        isCars: false,
        isPrice: true,
        isType: true
      })
    } else {
      this.setData({
        isCars: true,
      })
    }
  },

  // 行业
  selectPrice: function () {
    let that = this
    let type = that.data.isPrice
    if (type) {
      that.getJlist()
      this.setData({
        isCars: true,
        isPrice: false,
        isType: true
      })
    } else {
      this.setData({
        isPrice: true,
      })
    }
  },

  // 学历
  selectType: function () {
    let that = this
    let type = that.data.isType
    if (type) {
      that.condition('education')
      this.setData({
        isCars: true,
        isPrice: true,
        isType: false,
      })
    } else {
      this.setData({
        isType: true,
      })
    }
  },

  getJlist: function () {
    let that = this
    let data = {
      type: 'jobname'
    }
    util.sendRequest('/zqhr/base/list', 'get', data).then(function (res) {
      console.log(res.result.records)
      if (res.code == 0) {
        that.setData({
          list: res.result.records
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 筛选条件 - 列表内容
  condition: async function (type) {
    let that = this
    let data = {
      type: type,
      pageSize: 100
    }
    await util.sendRequest('/zqhr/base/list', 'get', data).then(function (res) {
      console.log(res.result.records)
      if (res.code == 0) {
        that.setData({
          list: res.result.records
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 区域项
  selectcarsitem: function (e) {
    this.setData({
      isCars: true,
      title: e.currentTarget.dataset.title,
      carid: e.currentTarget.dataset.id
    })
    this.getList()
  },

  // 行业项
  selectpriceitem: function (e) {
    console.log(e.currentTarget.dataset)
    this.setData({
      isPrice: true,
      price: e.currentTarget.dataset.title,
      priceid: e.currentTarget.dataset.id
    })
    this.getList()
  },

  // 学历项
  selecttypeitem: function (e) {
    this.setData({
      isType: true,
      typetitle: e.currentTarget.dataset.title,
      typeid: e.currentTarget.dataset.id
    })
    this.getList()
  },

  // 搜索
  toSearch: function () {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  // 简历详情
  toWorkerDetail: function (e) {
    let that = this
    let token = wx.getStorageSync('token')
    if (token) {
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

  onPullDownRefresh: function () {
    this.setData({
      page: 1
    })
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
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
      pageNo: that.data.page + 1,
      pageSize: 10,
      workArea: that.data.title,
      intendedPosition: that.data.price,
      education: that.data.typetitle
    }
    util.sendRequest('/zqhr/hall/curriculumvitae/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        let news = res.result.records
        if (news.length != 0) {
          that.settle(old.concat(news))
          that.setData({
            page: data.pageNo
          })
        } else {

        }
      } else {
        modal.showToast(res.message, 'none')
      }
    })

  }

})