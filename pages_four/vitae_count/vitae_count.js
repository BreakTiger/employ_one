const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  data: {
    page: 1,
    list: []
  },

  onLoad: function (options) {
    this.getList()
  },

  // 列表
  getList: function () {
    let that = this
    let data = {
      enterpriseInfoId: wx.getStorageSync('company').id,
      pageNo: that.data.page,
      pageSize: 10
    }
    util.sendRequest('/jeecg-boot/app/interview/receivelist', 'get', data).then(function (res) {
      console.log(res.result.records)
      if (res.code == 0) {
        that.setData({
          list: res.result.records
        })
      } else {
        modal.showToast(res.messgae, 'none')
      }
    })
  },

  // 查看简历
  toWatch: function (e) {
    let that = this
    let data = {
      id: e.currentTarget.dataset.id
    }
    util.sendRequest('/jeecg-boot/hall/curriculumvitae/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        let item = res.result.records[0]
        let age = util.ages(item)
        item.age = age
        app.globalData.worker = item
        wx.navigateTo({
          url: '/pages/workerdetail/workerdetail',
        })
      } else {
        modal.showToast(res.message)
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
          let data = {
            createBy: wx.getStorageSync('company').id,
            curriculumVitaeId: detail.curriculumVitaeId,
            enterpriseInfoId: detail.enterpriseInfoId,
            enterprisePostReleaseId: detail.enterprisePostReleaseId,
            interviewstate: 'invite'
          }
          util.sendRequest('/jeecg-boot/app/interview/invite', 'post', data).then(function (res) {
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
  }


})