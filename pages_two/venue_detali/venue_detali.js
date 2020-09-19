const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',

    detail: {},

    page: 1,

    joblist: []

    // title: '',
    // tel: '',
    // pid: 1,
  },


  onLoad: function (options) {

    this.setData({
      id: options.id,
      imgurl: app.globalData.imaUrl
    })

    this.getList()// 初始化数据

    this.getPosition()// 企业发布职位查询

  },

  getList: function () {
    let that = this
    let data = {
      id: that.data.id
    }
    util.sendRequest('/jeecg-boot/hall/enterprise/list', 'get', data).then(function (res) {
      // console.log(res)
      if (res.code == 0) {
        that.setData({
          detail: res.result.records[0]
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  getPosition: function () {
    let that = this
    let data = {
      enterpriseInfoId: that.data.id,
      pageNo: that.data.page,
      pageSize: 10
    }
    util.sendRequest('/jeecg-boot/hall/position/list', 'get', data).then(function (res) {
      console.log(res)
      if (res.code == 0) {
        console.log(res.result.records)
        that.setData({
          joblist: res.result.records
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 岗位详情
  toJobDetail: function (e) {
    // var id = e.currentTarget.dataset.id;
    // wx.navigateTo({
    //   url: "/weixinmao_zp/pages/jobmoneydetail/index?id=" + id
    // })
  },


  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.onLoad();
  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {
    return {
      title: this.data.title,
      path: '/weixinmao_zp/pages/companydetail/index?id=' + this.data.id
    }
  }
})