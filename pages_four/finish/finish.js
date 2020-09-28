const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  /**
   * 页面的初始数据
   */
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

    c_one: '',

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

    c_two: '',

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

    c_three: '',

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

    c_four: '',

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

    c_five: '',

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

    c_six: ''

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
          that.setData({
            c_one: detail.workExperience - 1,
            c_two: detail.professionalKnowledge - 1,
            c_three: detail.communicationSkills - 1,
            c_four: detail.culturalLevel - 1,
            c_five: detail.jobStability - 1,
            c_six: detail.comprehensiveEvaluation - 1
          })
          that.seteled()
        }
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  seteled: function () {
    let that = this
    let one = that.data.one
    let two = that.data.two
    let three = that.data.three
    let four = that.data.four
    let five = that.data.five
    let six = that.data.six
    console.log(one)

  },

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
      util.sendRequest('/zqhr/app/interviewevaluation/evaluation', 'post', data).then(function (res) {
        console.log(res)
        if (res.code == 200) {
          that.toFinsh()
        } else {
          modal.showToast(res.message, 'none')
        }
      })
    }
  },

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