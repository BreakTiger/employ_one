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
  },

  // 人才列表
  getList: function () {
    let that = this
    let data = {
      pageNo: that.data.page,
      pageSize: 10,
      workArea: that.data.title,
      intendedIndustries: that.data.price,
      education: that.data.typetitle
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
    // console.log(list)
    let that = this
    let arr = []
    list.forEach(function (item) {
      let age = util.ages(item)
      item.age = age
      arr.push(item)
    })
    console.log(arr)
    that.setData({
      worklist: arr
    })

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
      that.condition('industrytype')
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

  // 筛选条件 - 列表内容
  condition: async function (type) {
    let that = this
    let data = {
      type: type
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
      intendedIndustries: that.data.price,
      education: that.data.typetitle
    }
    util.sendRequest('/zqhr/hall/curriculumvitae/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        let news = res.result.records
        if (news.length != 0) {
          that.settle(old.concat(news))
          that.setData({
            page:data.pageNo
          })
        } else {

        }
      } else {
        modal.showToast(res.message, 'none')
      }
    })

  }

})