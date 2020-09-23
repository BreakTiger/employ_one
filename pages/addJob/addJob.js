const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({


  data: {

    detail: {},

    //薪资待遇
    price: ['2k以下', '2-2.5k', '2.5-3k', '3-3.5k', '3.5-4.5k', '4.5-5.5k', '5.5-6.5k', '6.5k-8k', '8k-10k', '10k-12k', '12-14k', '14-16k', '16-18k', '18-20k', '20k以上'],
    pricename: '',

    //学历
    education: ['不限', '初中以上', '高中以上', '中技以上', '中专以上', '大专以上', '本科以上', '硕士以上', '博士以上', '博后'],
    educationname: '',

    //工作经验
    express: ['无经验', '1年以下', '1-3年', '3-5年', '5-10年', '10年以上'],
    expressname: '',

    //工作性质
    worktype: ['全职', '兼职', '实习'],
    worktypename: "",

    //性别
    sex: null, //1 男 2女 0不限

    speciallist: [{ name: '五险', checked: false },
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
    ],//特色服务

    choice: '', //所选的特色服务 逗号分隔
  },


  onLoad: function (options) {
    let that = this
    if (options.detail) {
      let detail = JSON.parse(options.detail)
      console.log(detail)

      that.setData({
        detail: detail,
        pricename: detail.salary,
        educationname: detail.educationRequirements,
        expressname: detail.workExperience,
        worktypename: detail.jobNature,
        sex: detail.genderRequirement,
        choice: detail.special
      })

    }
  },

  // 选项：

  //薪资
  bindPriceChange: function (e) {
    let that = this
    let index = e.detail.value
    let list = that.data.price
    that.setData({
      pricename: list[index]
    })
  },

  // 学历
  bindEducationChange: function (e) {
    let that = this
    let index = e.detail.value
    let list = that.data.education
    that.setData({
      educationname: list[index]
    })
  },

  // 经验
  bindExpressChange: function (e) {
    let that = this
    let index = e.detail.value
    let list = that.data.express
    that.setData({
      expressname: list[index]
    })
  },

  // 岗位性质
  bindWorktypeChange: function (e) {

    let that = this
    let index = e.detail.value
    let list = that.data.worktype
    that.setData({
      worktypename: list[index]
    })
  },

  // 性别
  radioChange: function (e) {
    this.data.sex = e.detail.value;
  },

  // 特色服务
  checkboxChange: function (e) {
    var arr = this.data.choice
    var list = e.detail.value
    list.forEach(function (item, index) {
      arr += item + ','
    })
    arr = arr.substring(0, arr.length - 1)
    this.setData({
      choice: arr
    })
  },


  // 提交 - 验证
  formSubmit: function (e) {
    let that = this
    let data = e.detail.value
    console.log(data)
    if (!data.name) {
      modal.showToast('请输入岗位名称', 'none')
    } else if (!data.type) {
      modal.showToast('请输入岗位类型', 'none')
    } else if (!that.data.pricename) {
      modal.showToast('请设置薪资待遇', 'none')
    } else if (!data.number) {
      modal.showToast('请设置招聘人数', 'none')
    } else if (!that.data.educationname) {
      modal.showToast('请选择学历要求', 'none')
    } else if (!that.data.expressname) {
      modal.showToast('请选择工作经验', 'none')
    } else if (!that.data.worktypename) {
      modal.showToast('请选择工作性质', 'none')
    } else if (!that.data.sex) {
      modal.showToast('请选择性别', 'none')
    } else if (!data.describe) {
      modal.showToast('请输入职位描述', 'none')
    } else {
      console.log(111)
      let param = {
        enterprisePostRelease: {
          postName: data.name,
          jobType: data.type,
          salary: that.data.pricename,
          recruitment: data.number,
          educationRequirements: that.data.educationname,
          workExperience: that.data.worktypename,
          jobNature: that.data.worktypename,
          genderRequirement: that.data.sex,
          special: that.data.choice,
          jobDescription: data.describe,
          createBy: wx.getStorageSync('company').id,
          enterpriseInfoId: wx.getStorageSync('company').id
        },
        token: wx.getStorageSync('token'),
      }
      console.log(param)
      util.sendRequest('/jeecg-boot/hall/position/release', 'post', param).then(function (res) {
        console.log(res)
        if (res.code == 0) {
          modal.showToast('添加成功')
          setTimeout(() => {
            wx.navigateBack({
              delta: 0,
            })
          }, 2000);
        } else {
          modal.showToast(res.message, 'none')
        }
      })
    }
  }


})