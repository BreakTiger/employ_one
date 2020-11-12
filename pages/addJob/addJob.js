const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'




Page({

  data: {
    detail: {},

    // 招聘会
    fair: [],
    fairname: '',
    fairid: '',

    //岗位类型
    type: [],
    choice_one: 0,

    types: [],
    choice_two: '',

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

    areaList: [],
    areaname: '',

    ageList: [],
    agename: '',

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

    is_show: false,

    is_editor: false,

    formats: {},

    readOnly: false

  },

  onLoad: function (options) {
    let that = this
    if (app.globalData.detail) {

      let detail = app.globalData.detail

      console.log(detail)
      if (Object.keys(detail).length != 0) {
        console.log('存在内容,开启修改')
        that.setData({
          is_editor: true
        })
      }

      that.setData({
        detail: detail,
        pricename: detail.salary,
        educationname: detail.educationRequirements,
        expressname: detail.workExperience,
        worktypename: detail.jobNature,
        sex: detail.genderRequirement,
        choice: detail.special,
        describe: detail.jobDescription,
        typeName: detail.jobType,
        fairname: detail.jobFairName,
        fairid: detail.jobFairId,
        areaname: detail.area,
        agename: detail.ageRequirement
      })

      if (that.data.choice) {
        that.seteld(that.data.choice)
      }

    }

    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context;
      that.editorCtx.setContents({
        html: that.data.detail.jobDescription
      })
    }).exec()

    that.getElist()

    that.typeList()

    that.priceList()

    that.educationList()

    that.areaList()

    that.ageList()
  },

  onShow: function () {
    this.onEditorReady()
  },

  // 招聘会列表
  getElist: function () {
    let that = this
    let data = {
      enterpriseInfoId: wx.getStorageSync('company').id
    }
    util.sendRequest('/zqhr/hall/entryenterprise/EntryJobFair', 'get', data).then(function (res) {
      if (res.code == 0) {
        that.setData({
          fair: res.result
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  seteld: function (e) {
    let that = this
    let arr = e.split(',')
    let list = that.data.speciallist
    // console.log(list)
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i]
      for (let j = 0; j < list.length; j++) {
        let items = list[j].name
        if (item == items) {
          list[j].checked = true
        }
      }
    }
    that.setData({
      speciallist: list
    })
  },

  // 岗位类型 - 1
  typeList: function () {
    let that = this
    let data = {
      type: 'jobtype',
      pageSize: 200
    }
    util.sendRequest('/zqhr/base/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        that.setData({
          type: res.result.records
        })
        that.typesList(res.result.records[0].id)
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 岗位类型 - 2
  typesList: function (e) {
    let that = this
    let data = {
      type: 'jobname',
      parentid: e,
      pageSize: 300
    }
    util.sendRequest('/zqhr/base/list', 'get', data).then(function (res) {
      // console.log(res)
      if (res.code == 0) {
        that.setData({
          types: res.result.records
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 薪资待遇
  priceList: function () {
    let that = this
    let data = {
      type: 'salaryrange'
    }
    util.sendRequest('/zqhr/base/list', 'get', data).then(function (res) {
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
    util.sendRequest('/zqhr/base/list', 'get', data).then(function (res) {
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

  // 区域列表
  areaList: function () {
    let that = this
    let data = {
      type: 'area',
      pageSize: 100
    }
    util.sendRequest('/zqhr/base/list', 'get', data).then(function (res) {
      // console.log(res.result.records)
      if (res.code == 0) {
        that.setData({
          areaList: res.result.records
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 年龄要求
  ageList: function () {
    let that = this
    let data = {
      type: 'Age'
    }
    util.sendRequest('/zqhr/base/list', 'get', data).then(function (res) {
      console.log(res.result.records)
      if (res.code == 0) {
        that.setData({
          ageList: res.result.records
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 是否显示
  toShow: function () {
    let type = this.data.is_show
    if (type) {
      this.setData({
        is_show: false
      })
    } else {
      this.setData({
        is_show: true
      })
    }
  },

  // 选择职位类型
  choice_title: function (e) {
    let that = this
    let index = e.currentTarget.dataset.index
    that.setData({
      choice_one: index
    })
    that.typesList(e.currentTarget.dataset.item.id)
  },

  choice_right: function (e) {
    let item = e.currentTarget.dataset.item
    console.log(item)
    this.setData({
      typeName: item.dataName,
      is_show: false
    })
  },

  bindFairChange: function (e) {
    let index = e.detail.value
    console.log(index)
    let list = this.data.fair
    this.setData({
      fairname: list[index].name,
      fairid: list[index].id
    })
  },

  bindPriceChange: function (e) {
    let index = e.detail.value
    console.log(index)
    let list = this.data.price
    this.setData({
      pricename: list[index].dataName
    })
  },

  bindEducationChange: function (e) {
    let index = e.detail.value
    let list = this.data.education
    this.setData({
      educationname: list[index].dataName
    })
  },

  bindExpressChange: function (e) {
    let index = e.detail.value
    let list = this.data.express
    this.setData({
      expressname: list[index]
    })
  },

  bindWorktypeChange: function (e) {
    let index = e.detail.value
    let list = this.data.worktype
    this.setData({
      worktypename: list[index]
    })
  },

  bindAreaChange: function (e) {
    let index = e.detail.value
    let list = this.data.areaList
    this.setData({
      areaname: list[index].dataName
    })
  },

  bindAgeChange: function (e) {
    let index = e.detail.value
    let list = this.data.ageList
    this.setData({
      agename: list[index].dataName
    })
  },

  radioChange: function (e) {
    this.setData({
      sex: e.detail.value
    })
  },

  // 特色服务
  checkboxChange: function (e) {
    let arr = e.detail.value
    this.setData({
      choice: arr.join(',')
    })
  },

  // 提交判断
  formSubmit: function (e) {
    let that = this
    let data = e.detail.value
    if (!that.data.fairname) {
      modal.showToast('请选择要参加的招聘会', 'none')
    } else if (!data.name) {
      modal.showToast('请输入岗位名称', 'none')
    } else if (!that.data.typeName) {
      modal.showToast('请选择岗位类型', 'none')
    } else if (!that.data.pricename) {
      modal.showToast('请设置薪资待遇', 'none')
    } else if (!data.number) {
      modal.showToast('请设置招聘人数', 'none')
    } else if (!that.data.educationname) {
      modal.showToast('请选择学历要求', 'none')
    } else if (!that.data.expressname) {
      modal.showToast('请选择工作经验', 'none')
    } else if (!that.data.areaname) {
      modal.showToast('请选择就职区域', 'none')
    } else if (!that.data.worktypename) {
      modal.showToast('请选择岗位性质', 'none')
    } else if (!that.data.sex) {
      modal.showToast('请选择性别', 'none')
    } else if (!that.data.describe) {
      modal.showToast('请输入岗位描述', 'none')
    } else {
      let param = {
        jobFairId: that.data.fairid,
        createBy: wx.getStorageSync('company').id,
        enterpriseInfoId: wx.getStorageSync('company').id,
        enable: 1,
        postName: data.name,
        jobType: that.data.typeName,
        salary: that.data.pricename,
        recruitment: data.number,
        educationRequirements: that.data.educationname,
        workExperience: that.data.expressname,
        jobNature: that.data.worktypename,
        genderRequirement: that.data.sex,
        special: that.data.choice,
        jobDescription: that.data.describe,
        token: wx.getStorageSync('token'),
        ageRequirement: that.data.agename,
        examinestate: 0,
        area: that.data.areaname
      }
      console.log(param)

      if (!that.data.is_editor) {
        console.log('新增')
        that.add(param)
      } else {
        console.log('修改')
        that.editors(param)
      }

    }
  },

  // 新增
  add: function (data) {
    let that = this
    let date = new Date()
    let time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()+':'+date.getSeconds()
    data.createTime = time
    util.sendRequest('/zqhr/hall/position/add', 'post', data).then(function (res) {
      console.log(res)
      if (res.code == 200) {
        modal.showToast(res.message)
        setTimeout(() => {
          wx.navigateBack({
            delta: 0,
          })
        }, 2000);
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 修改
  editors: function (data) {
    let that = this
    let date = new Date()
    let time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()+':'+date.getSeconds()
    data.updateTime = time
    data.updateBy = wx.getStorageSync('company').id
    data.id = that.data.detail.id
    util.sendRequest('/zqhr/hall/position/editById', 'post', data).then(function (res) {
      console.log(res)
      if (res.code == 200) {
        modal.showToast(res.message)
        setTimeout(() => {
          wx.navigateBack({
            delta: 0,
          })
        }, 2000);
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },


  // 富文本 - 操作
  onEditorReady: function () {
    let that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context;
      that.editorCtx.setContents({
        html: that.data.describe
      })
    }).exec()
  },

  toEditor: function () {
    let that = this
    let describe = that.data.describe
    app.globalData.describe = describe
    wx.navigateTo({
      url: '/pages/wxEditor/wxEditor',
    })
  },


})