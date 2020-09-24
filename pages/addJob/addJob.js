const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'


Page({

  data: {
    detail: {},

    //岗位类型
    type: [],
    typeName: '',

    //薪资待遇
    price: [],
    pricename: '',

    //学历
    education: [],
    educationname: '',

    //工作经验
    express: ['无经验', '1年以下', '1-3年', '3-5年', '5-10年', '10年以上'],
    expressname: '',

    //工作性质
    worktype: ['全职', '兼职', '实习'],
    worktypename: "",

    //性别
    sex: '', //1 男 2女 0不限

    //特色服务
    speciallist: [
      { name: '五险', checked: false },
      { name: '五险一金', checked: false },
      { name: '补充医疗保险', checked: false },
      { name: '员工旅游', checked: false },
      { name: '交通补贴', checked: false },
      { name: '餐饮补贴', checked: false },
      { name: '出国机会', checked: false },
      { name: '年终奖金', checked: false },
      { name: '定期体检', checked: false },
      { name: '节日福利', checked: false },
      { name: '双休', checked: false },
      { name: '调休', checked: false },
      { name: '年假', checked: false },
      { name: '加班补贴', checked: false },
      { name: '职位晋升', checked: false },
      { name: '包食宿', checked: false }
    ],

    choice: '', //所选的特色服务 逗号分隔

    describe: '', //描述

    is_show: false
  },

  onLoad: function (options) {
    let that = this
    if (options.detail) {
      let detail = JSON.parse(options.detail)
      console.log(detail)

      // that.setData({
      //   detail: detail,
      //   pricename: detail.salary,
      //   educationname: detail.educationRequirements,
      //   expressname: detail.workExperience,
      //   worktypename: detail.jobNature,
      //   sex: detail.genderRequirement,
      //   choice: detail.special
      // })
    }

    that.typeList()

    that.priceList()

    that.educationList()
  },

  // 岗位类型 - 1
  typeList: function () {
    let that = this
    let data = {
      type: 'jobtype'
    }
    util.sendRequest('/jeecg-boot/base/list', 'get', data).then(function (res) {
      // console.log(res.result.records)
      if (res.code == 0) {
        that.setData({
          type: res.result.records
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 岗位类型 - 2
  typeItem: function () {

  },

  // 薪资待遇
  priceList: function () {
    let that = this
    let data = {
      type: 'salaryrange'
    }
    util.sendRequest('/jeecg-boot/base/list', 'get', data).then(function (res) {
      // console.log(res.result.records)
      if (res.code == 0) {
        that.setData({
          price: res.result.records
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 学历要求
  educationList: function () {
    let that = this
    let data = {
      type: 'education'
    }
    util.sendRequest('/jeecg-boot/base/list', 'get', data).then(function (res) {
      // console.log(res.result.records)
      if (res.code == 0) {
        that.setData({
          education: res.result.records
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },


})