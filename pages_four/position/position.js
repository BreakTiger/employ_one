const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({


  data: {

    //招聘会
    choice_one: '',
    choice_one_name: '',
    elist: [],
    down_one: false,

    // 招聘职位
    choice_two_name: '',
    jlist: [],
    down_two: false,

    // 职位列表
    fid: '',
    page: 1,
    list: []
  },

  onShow: function () {
    this.getElist()
    this.getList()
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
          elist: res.result
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 职位列表
  getList: function () {
    let that = this
    let data = {
      enterpriseInfoId: wx.getStorageSync('company').id,
      postName: that.data.choice_two_name,
      jobFairId: that.data.choice_one,
      pageNo: that.data.page,
      pageSize: 10
    }
    util.sendRequest('/zqhr/hall/position/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        let l = that.settle(res.result.records)
        let p = that.handlePosition(res.result.records)
        that.setData({
          list: l,
          jlist: p
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 整理
  settle: function (list) {
    let after = []
    let temp = []
    for (let i = 0; i < list.length; i++) {
      let ai = list[i];
      if (temp.indexOf(ai.jobFairId) === -1) {
        after.push({
          id: ai.jobFairId,
          name: ai.jobFairName,
          data: [ai]
        })
        temp.push(ai.jobFairId)
      } else {
        for (let j = 0; j < after.length; j++) {
          let as = after[j]
          if (as.id == ai.jobFairId) {
            as.data.push(ai)
            break;
          }
        }
      }
    }
    return after;
  },

  handlePosition(data) {
    let list = [];
    for (const key in data) {
      if (list.indexOf(data[key].postName) === -1) {
        list.push(data[key].postName)
      }
    }
    return list;
  },

  // 显示 / 隐藏 下拉
  showOne: function () {
    let one = this.data.down_one
    if (one) {
      this.setData({
        down_one: false
      })
    } else {
      this.setData({
        down_one: true
      })
    }
  },

  showTwo: function () {
    let two = this.data.down_two
    if (two) {
      this.setData({
        down_two: false
      })
    } else {
      this.setData({
        down_two: true
      })
    }
  },

  // 选择招聘会
  choices_one: function (e) {
    let that = this
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    that.setData({
      choice_one: id,
      choice_one_name: name,
      down_one: false,
      page: 1
    })
    that.getList()
  },

  // 选择职位
  choices_two: function (e) {
    let that = this
    let name = e.currentTarget.dataset.name
    that.setData({
      choice_two_name: name,
      down_two: false,
      page: 1
    })
    that.getList()
  },

  // 添加职位
  addcompanyjob: function () {
    wx.navigateTo({
      url: '/pages/addJob/addJob',
    })
  },


  // 编辑
  toEdit: function (e) {
    wx.navigateTo({
      url: '/pages/addJob/addJob?detail=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  },

  // 删除
  toDel: function (e) {
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否删除该职位',
      success: function (res) {
        if (res.confirm) {
          let data = {
            id: parseInt(e.currentTarget.dataset.id)
          }
          // console.log(data)
          util.sendRequest('/zqhr/hall/position/delete', 'get', data).then(function (res) {
            // console.log(res)
            if (res.code == 200) {
              modal.showToast(res.message)
              let index = e.currentTarget.dataset.index
              let idx = e.currentTarget.dataset.idx
              let list = that.data.list
              let item = list[index].data
              item.splice(idx, 1)
              if (item.length == 0) {
                list.splice(index, 1)
                that.setData({
                  list: list
                })
              } else {
                let items = 'list[' + index + '].data';
                that.setData({
                  [items]: item
                })
              }
            } else {
              modal.showToast(res.message, 'none')
            }
          })
        }
      }
    })
  },

  // 开启 / 关闭 
  isType: function (e) {
    let that = this
    console.log(e.currentTarget.dataset.item)
    let examinestate = e.currentTarget.dataset.item.examinestate
    let type = e.currentTarget.dataset.item.enable
    let id = e.currentTarget.dataset.item.id
    let data = {}
    if (type == 1) {
      data = {
        enable: -1,
        id: id,
        examinestate: examinestate
      }
    } else {
      data = {
        enable: 1,
        id: id,
        examinestate: examinestate
      }
    }
    console.log('参数：', data)
    util.sendRequest('/zqhr/hall/position/enable', 'get', data).then(function (res) {
      if (res.code == 200) {
        // 根据type,来JS变动enable
        let list = that.data.list
        let index = e.currentTarget.dataset.index
        let idx = e.currentTarget.dataset.idx
        let item = list[index].data
        if (type == 1) {
          item[idx].enable = -1
        } else {
          item[idx].enable = 1
        }
        let items = 'list[' + index + '].data';
        that.setData({
          [items]: item
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  onPullDownRefresh: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    this.setData({
      page: 1
    })
    this.getList()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
  },

  onReachBottom: function () {
    let that = this
    let old = that.data.list
    let olds = that.data.jlist
    let data = {
      enterpriseInfoId: wx.getStorageSync('company').id,
      postName: that.data.choice_two_name,
      jobFairId: that.data.choice_one,
      pageNo: that.data.page + 1,
      pageSize: 10
    }
    util.sendRequest('/zqhr/hall/position/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        let news = res.result.records
        if (news.length != 0) {
          that.setData({
            list: old.concat(that.settle(news)),
            jlist: olds.concat(that.handlePosition(news)),
            page: data.pageNo
          })
        } else {

        }
      } else {
        modal.showToast(res.messgae, 'none')
      }
    })
  }
})