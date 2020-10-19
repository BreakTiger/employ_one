const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({


  data: {

    base: {},

    // 匹配度

    total: 0,

    list: [],

    // 评价

    c_one: 0,

    c_two: 0,

    c_three: 0,

    c_four: 0,

    c_five: 0


  },

  onLoad: function (options) {

    this.setData({
      imaUrl: app.globalData.imaUrl
    })

    // console.log(app.globalData.worker)

    this.getBase(app.globalData.worker)

    this.getOne(app.globalData.worker)

    this.getTwo(app.globalData.worker)

  },

  // 简历数据
  getBase: function (item) {
    let that = this
    let data = {
      id: item.curriculumVitaeId
    }
    util.sendRequest('/zqhr/hall/curriculumvitae/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        let items = res.result.records[0]
        let age = util.ages(items)
        items.age = age
        that.setData({
          base: items
        })
      } else {
        modal.showToast(res.message)
      }
    })
  },

  // 匹配度
  getOne: function (item) {
    let that = this
    let data = {
      curriculumVitaeId: item.curriculumVitaeId,
      enterpriseInfoId: wx.getStorageSync('company').id,
      enterprisePostReleaseId: item.enterpriseInfoId
    }
    util.sendRequest('/zqhr/app/interviewevaluation/matching', 'get', data).then(function (res) {
      // console.log(res.result)
      if (res.code == 0) {
        let datas = res.result
        //综合匹配度
        let total = (datas.jobTypeRatio + datas.tradeRatio + datas.workAreaRatio + datas.workExperienceRatio + datas.educationRatio + datas.salaryRatio) / 6 * 100

        // 整合六种不同的匹配度
        let list = [
          {
            name: '工作职位',
            percent: datas.jobTypeRatio
          },
          {
            name: '工作行业',
            percent: datas.tradeRatio
          },
          {
            name: '工作地点',
            percent: datas.workAreaRatio
          },
          {
            name: '工作年限',
            percent: datas.workExperienceRatio
          },
          {
            name: '文化程度',
            percent: datas.educationRatio
          },
          {
            name: '期望薪资',
            percent: datas.salaryRatio
          }
        ]

        that.setData({
          total: total.toFixed(0),
          list: list
        })

      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 评价查询
  getTwo: function (item) {
    let that = this
    let data = {
      curriculumVitaeId: item.curriculumVitaeId,
      enterpriseInfoId: wx.getStorageSync('company').id,
      enterprisePostReleaseId: item.enterpriseInfoId
    }
    util.sendRequest('/zqhr/app/interviewevaluation/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        if (res.result) {
          console.log(res.result)
        }
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 选择评价星级
  toChoice: function (e) {
    let that = this
    let type = e.currentTarget.dataset.type
    let index = e.currentTarget.dataset.index
    that.setData({
      [type]: index + 1
    })
  },

  // 滑动评星
  toMove: function (e) {
    let that = this
    console.log(e.currentTarget.dataset.type)
  },

  // 待定
  toWait: function () {
    let that = this

  },

  // 入职通知
  toNotice: function () {
    let that = this

  },


})