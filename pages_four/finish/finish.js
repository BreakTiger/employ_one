const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  data: {

    detail: {},

    one: [
      {
        text: " 优秀",
        choice: 0
      },
      {
        text: "良好",
        choice: 0
      },
      {
        text: "合格",
        choice: 0
      },
      {
        text: "较差",
        choice: 0
      }
    ],

    two: [
      {
        text: " 优秀",
        choice: 0
      },
      {
        text: "良好",
        choice: 0
      },
      {
        text: "合格",
        choice: 0
      },
      {
        text: "较差",
        choice: 0
      }
    ],

    three: [
      {
        text: " 优秀",
        choice: 0
      },
      {
        text: "良好",
        choice: 0
      },
      {
        text: "合格",
        choice: 0
      },
      {
        text: "较差",
        choice: 0
      }
    ],

    four: [
      {
        text: " 优秀",
        choice: 0
      },
      {
        text: "良好",
        choice: 0
      },
      {
        text: "合格",
        choice: 0
      },
      {
        text: "较差",
        choice: 0
      }
    ],

    five: [
      {
        text: " 优秀",
        choice: 0
      },
      {
        text: "良好",
        choice: 0
      },
      {
        text: "合格",
        choice: 0
      },
      {
        text: "较差",
        choice: 0
      }
    ],

    six: [
      {
        text: "建议录取",
        choice: 0
      },
      {
        text: "推荐复试",
        choice: 0
      },
      {
        text: "人才储备",
        choice: 0
      },
      {
        text: "拒绝录用",
        choice: 0
      }
    ],

    // 选择
    c_one: null,
    c_two: null,
    c_three: null,
    c_four: null,
    c_five: null,
    c_six: null,

    is_edit: false

  },


  onLoad: function (options) {
    console.log(JSON.parse(options.detail))

    this.setData({
      detail: JSON.parse(options.detail)
    })

    this.getData(JSON.parse(options.detail))

  },

  getData: function (e) {
    let that = this
    let data = {
      curriculumVitaeId: e.curriculumVitaeId,
      enterpriseInfoId: wx.getStorageSync('company').id,
      enterprisePostReleaseId: e.enterprisePostReleaseId
    }
    util.sendRequest('/zqhr/app/interviewevaluation/list', 'get', data).then(function (res) {
      console.log(res.result)
      if (res.code == 0) {
        let detail = res.result
        if (detail) {
          // 1.赋值
          that.setData({
            c_one: detail.workExperience - 1,
            c_two: detail.professionalKnowledge - 1,
            c_three: detail.communicationSkills - 1,
            c_four: detail.culturalLevel - 1,
            c_five: detail.jobStability - 1,
            c_six: detail.comprehensiveEvaluation - 1
          })
          
          // 2.判断计算
          // that.seteled()
        }
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 选择：

  toOne: function (e) {
    let that = this
    let indexs = e.currentTarget.dataset.index
    let list = that.data.one
    list.forEach(function (item, index) {
      if (index == indexs) {
        item.choice = 1
        that.setData({
          c_one: indexs + 1
        })
      } else {
        item.choice = 0
      }
    })
    that.setData({
      one: list
    })
  },

  toTwo: function (e) {
    let that = this
    let indexs = e.currentTarget.dataset.index
    let list = that.data.two
    list.forEach(function (item, index) {
      if (index == indexs) {
        item.choice = 1
        that.setData({
          c_two: indexs + 1
        })
      } else {
        item.choice = 0
      }
    })
    that.setData({
      two: list
    })
  },

  toThree: function (e) {
    let that = this
    let indexs = e.currentTarget.dataset.index
    let list = that.data.three
    list.forEach(function (item, index) {
      if (index == indexs) {
        item.choice = 1
        that.setData({
          c_three: indexs + 1
        })
      } else {
        item.choice = 0
      }
    })
    that.setData({
      three: list
    })
  },

  toFour: function (e) {
    let that = this
    let indexs = e.currentTarget.dataset.index
    let list = that.data.four
    list.forEach(function (item, index) {
      if (index == indexs) {
        item.choice = 1
        that.setData({
          c_four: indexs + 1
        })
      } else {
        item.choice = 0
      }
    })
    that.setData({
      four: list
    })
  },

  toFive: function (e) {
    let that = this
    let indexs = e.currentTarget.dataset.index
    let list = that.data.five
    list.forEach(function (item, index) {
      if (index == indexs) {
        item.choice = 1
        that.setData({
          c_five: indexs + 1
        })
      } else {
        item.choice = 0
      }
    })
    that.setData({
      five: list
    })
  },

  toSix: function (e) {
    let that = this
    let indexs = e.currentTarget.dataset.index
    let list = that.data.six
    list.forEach(function (item, index) {
      if (index == indexs) {
        item.choice = 1
        that.setData({
          c_six: indexs + 1
        })
      } else {
        item.choice = 0
      }
    })
    that.setData({
      six: list
    })
  },

  // 提交
  toSubmit: function () {
    let that = this
    if (!that.data.c_one) {
      modal.showToast('请评价工作经验', 'none')
    } else if (!that.data.c_two) {
      modal.showToast('请评价专业知识', 'none')
    } else if (!that.data.c_three) {
      modal.showToast('请评价沟通能力', 'none')
    } else if (!that.data.c_four) {
      modal.showToast('请评价职业文化水平', 'none')
    } else if (!that.data.c_five) {
      modal.showToast('请评价岗位稳定性', 'none')
    } else if (!that.data.c_six) {
      modal.showToast('请选择综合评价', 'none')
    } else {
      let detail = that.data.detail
      let data = {
        curriculumVitaeId: detail.curriculumVitaeId,
        enterpriseInfoId: detail.enterpriseInfoId,
        enterprisePostReleaseId: detail.enterprisePostReleaseId,
        createBy: wx.getStorageSync('company').id,
        workExperience: that.data.c_one,
        professionalKnowledge: that.data.c_two,
        communicationSkills: that.data.c_three,
        culturalLevel: that.data.c_four,
        jobStability: that.data.c_five,
        comprehensiveEvaluation: that.data.c_six
      }
      console.log(data)
      if (that.data.is_edit) {
        that.edit(data)
      } else {
        that.send(data)
      }
    }
  },


  send: function (data) {
    console.log('发布')
    let that = this
    util.sendRequest('/zqhr/app/interviewevaluation/evaluation', 'post', data).then(function (res) {
      console.log(res)
      if (res.code == 200) {
        that.toFinsh()
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 修改
  edit: function (data) {
    console.log('修改')
    let that = this
    util.sendRequest('/zqhr/app/interviewevaluation/editById', 'post', data).then(function (res) {
      console.log(res)
      if (res.code == 200) {
        wx.navigateBack({
          delta: 0,
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 完成
  toFinsh: function () {
    let that = this
    let data = {
      curriculumVitaeId: that.data.detail.curriculumVitaeId,
      enterpriseInfoId: wx.getStorageSync('company').id
    }
    util.sendRequest('/zqhr/app/interview/finish', 'get', data).then(function (res) {
      console.log(res)
      if (res.code == 200) {
        wx.navigateBack({
          delta: 0,
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 取消
  toCancel: function () {
    wx.navigateBack({
      delta: 0,
    })
  }
})