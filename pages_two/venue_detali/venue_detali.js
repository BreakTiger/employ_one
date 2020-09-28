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


  },


  onLoad: function (options) {

    this.setData({
      id: options.id,
      imgurl: app.globalData.imaUrl
    })

    this.getList()// 初始化数据

    this.getPosition()// 企业发布职位查询

  },

  // 企业信息
  getList: function () {
    let that = this
    let data = {
      id: that.data.id
    }
    util.sendRequest('/zqhr/hall/enterprise/list', 'get', data).then(function (res) {
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

  // 发布职位
  getPosition: function () {
    let that = this
    let data = {
      enterpriseInfoId: that.data.id,
      pageNo: that.data.page,
      pageSize: 10
    }
    util.sendRequest('/zqhr/hall/position/list', 'get', data).then(function (res) {
      // console.log(res)
      if (res.code == 0) {
        let list = res.result.records
        list.forEach(function (item) {
          let arr = item.special.split(',')
          console.log(arr)
          item.special = arr
        })

        console.log(list)

        that.setData({
          joblist: list
        })
        
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 岗位详情
  toJobDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages_two/job_detail/job_detail?id=' + id,
    })
  }
})