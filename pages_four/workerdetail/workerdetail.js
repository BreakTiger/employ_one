const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

const WxParse = require('../../wxParse/wxParse.js')

Page({


  data: {

    details: {},

    base: {},

    // 匹配度

    total: 0,

    list: [],

    // 评价

    c_one: 0,

    c_two: 0,

    c_three: 0,

    c_four: 0,

    c_five: 0,

    type: 0 //类型 1录取 2待定

  },

  onLoad: function (options) {

    this.setData({
      details: app.globalData.worker,
      photo:app.globalData.worker.photographResumeAddress,
      imaUrl: app.globalData.imaUrl
    })

    // if(app.globalData.worker.)

    console.log(app.globalData.worker)

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
        let work = util.calculates(items)
        items.workExperience = work
        items.age = age
        that.setData({
          base: items
        })

        let article = items.jobDescription
        if(article){
          WxParse.wxParse('article', 'html', article, that, 5)
        }
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
      enterprisePostReleaseId: item.enterprisePostReleaseId
    }
    util.sendRequest('/zqhr/app/interviewevaluation/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        if (res.result) {
          console.log(res.result)
          let detail = res.result
          that.setData({
            c_one: detail.imageTemperament,
            c_two: detail.languageExpression,
            c_three: detail.workExperience,
            c_four: detail.workingAbility,
            c_five: detail.comprehensiveEvaluation,
            type: detail.interviewResults
          })
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

  // 滑动星
  toMoveOne(e) {
    var num = this.data.c_one;
    var that = this;
    let query = wx.createSelectorQuery().in(this);
    var pingfen = query.select('.s_line').boundingClientRect();
    var level = query.select('.star').boundingClientRect();

    query.exec(res => {
      var starthzW = res[0].width; //盒子宽
      var starMinX = res[0].left; // 初始位置
      var starWidth = res[1].width; //每颗星星宽
      var starLen = (starthzW - starWidth * 5) / 4;
      var touchX = e.touches[0].pageX; //获取当前触摸点X坐标
      var starMaxX = starWidth * 5 + starLen * 4 + starMinX;
      if (touchX > starMinX && touchX < starMaxX) {
        var nums = Math.ceil((touchX - starMinX) / (starWidth + starLen));
        if (num != nums) {
          that.setData({ c_one: nums })
        }
      } else if (touchX < starMinX) {
        that.setData({ c_one: 0 })
      }
    })
  },

  toMoveTwo(e) {
    var num = this.data.c_two;
    var that = this;
    let query = wx.createSelectorQuery().in(this);
    var pingfen = query.select('.s_line').boundingClientRect();
    var level = query.select('.star').boundingClientRect();

    query.exec(res => {
      var starthzW = res[0].width; //盒子宽
      var starMinX = res[0].left; // 初始位置
      var starWidth = res[1].width; //每颗星星宽
      var starLen = (starthzW - starWidth * 5) / 4;
      var touchX = e.touches[0].pageX; //获取当前触摸点X坐标
      var starMaxX = starWidth * 5 + starLen * 4 + starMinX;
      if (touchX > starMinX && touchX < starMaxX) {
        var nums = Math.ceil((touchX - starMinX) / (starWidth + starLen));
        if (num != nums) {
          that.setData({ c_two: nums })
        }
      } else if (touchX < starMinX) {
        that.setData({ c_two: 0 })
      }
    })
  },

  toMoveThree(e) {
    var num = this.data.c_three;
    var that = this;
    let query = wx.createSelectorQuery().in(this);
    var pingfen = query.select('.s_line').boundingClientRect();
    var level = query.select('.star').boundingClientRect();

    query.exec(res => {
      var starthzW = res[0].width; //盒子宽
      var starMinX = res[0].left; // 初始位置
      var starWidth = res[1].width; //每颗星星宽
      var starLen = (starthzW - starWidth * 5) / 4;
      var touchX = e.touches[0].pageX; //获取当前触摸点X坐标
      var starMaxX = starWidth * 5 + starLen * 4 + starMinX;
      if (touchX > starMinX && touchX < starMaxX) {
        var nums = Math.ceil((touchX - starMinX) / (starWidth + starLen));
        if (num != nums) {
          that.setData({ c_three: nums })
        }
      } else if (touchX < starMinX) {
        that.setData({ c_three: 0 })
      }
    })
  },

  toMoveFour(e) {
    var num = this.data.c_four;
    var that = this;
    let query = wx.createSelectorQuery().in(this);
    var pingfen = query.select('.s_line').boundingClientRect();
    var level = query.select('.star').boundingClientRect();

    query.exec(res => {
      var starthzW = res[0].width; //盒子宽
      var starMinX = res[0].left; // 初始位置
      var starWidth = res[1].width; //每颗星星宽
      var starLen = (starthzW - starWidth * 5) / 4;
      var touchX = e.touches[0].pageX; //获取当前触摸点X坐标
      var starMaxX = starWidth * 5 + starLen * 4 + starMinX;
      if (touchX > starMinX && touchX < starMaxX) {
        var nums = Math.ceil((touchX - starMinX) / (starWidth + starLen));
        if (num != nums) {
          that.setData({ c_four: nums })
        }
      } else if (touchX < starMinX) {
        that.setData({ c_four: 0 })
      }
    })
  },

  toMoveFive(e) {
    var num = this.data.c_five;
    var that = this;
    let query = wx.createSelectorQuery().in(this);
    var pingfen = query.select('.s_line').boundingClientRect();
    var level = query.select('.star').boundingClientRect();

    query.exec(res => {
      var starthzW = res[0].width; //盒子宽
      var starMinX = res[0].left; // 初始位置
      var starWidth = res[1].width; //每颗星星宽
      var starLen = (starthzW - starWidth * 5) / 4;
      var touchX = e.touches[0].pageX; //获取当前触摸点X坐标
      var starMaxX = starWidth * 5 + starLen * 4 + starMinX;
      if (touchX > starMinX && touchX < starMaxX) {
        var nums = Math.ceil((touchX - starMinX) / (starWidth + starLen));
        if (num != nums) {
          that.setData({ c_five: nums })
        }
      } else if (touchX < starMinX) {
        that.setData({ c_five: 0 })
      }
    })
  },

  // 待定
  toWait: function (e) {
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否将该简历选待定',
      success: function (res) {
        if (res.confirm) {
          that.judge(e.currentTarget.dataset.type)
        }
      }
    })
  },

  // 入职通知
  toNotice: function (e) {
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否发送入职通知',
      success: function (res) {
        if (res.confirm) {
          that.judge(e.currentTarget.dataset.type)
        }
      }
    })
  },

  // 判断
  judge: function (types) {
    if (this.data.c_one == 0) {
      modal.showToast('请对形象气质评价', 'none')
    } else if (this.data.c_two == 0) {
      modal.showToast('请对语言表达评价', 'none')
    } else if (this.data.c_three == 0) {
      modal.showToast('请对工作经验评价', 'none')
    } else if (this.data.c_four == 0) {
      modal.showToast('请对工作能力评价', 'none')
    } else if (this.data.c_five == 0) {
      modal.showToast('请选择综合评价', 'none')
    } else {
      let that = this
      let data = {
        id:that.data.details.id,
        imageTemperament: that.data.c_one,
        languageExpression: that.data.c_two,
        workExperience: that.data.c_three,
        workingAbility: that.data.c_four,
        comprehensiveEvaluation: that.data.c_five,
        curriculumVitaeId: that.data.details.curriculumVitaeId,
        enterpriseInfoId: wx.getStorageSync('company').id,
        enterprisePostReleaseId: that.data.details.enterprisePostReleaseId,
        interviewResults: types,
        createBy: wx.getStorageSync('company').id
      }
      console.log(data)
      that.send(data)
    }
  },

  send: function (data) {
    let that = this
    util.sendRequest('/zqhr/app/interviewevaluation/evaluation', 'post', data, '1').then(function (res) {
      console.log(res)
      if (res.code == 200) {
        that.finish()
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  finish: function () {
    let that = this
    let data = {
      curriculumVitaeId: that.data.details.curriculumVitaeId,
      enterpriseInfoId: wx.getStorageSync('company').id
    }
    util.sendRequest('/zqhr/app/interview/finish', 'get', data).then(function (res) {
      if (res.code == 200) {
        modal.showToast(res.message, 'none')
        wx.navigateBack({
          delta: 0,
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  }


})