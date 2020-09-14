// weixinmao_zp/pages_four/finish/finish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
      },
      {
        text: "很差",
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
      },
      {
        text: "很差",
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
      },
      {
        text: "很差",
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
      },
      {
        text: "很差",
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
      },
      {
        text: "很差",
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

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  toOne: function (e) {
    let that = this
    let indexs = e.currentTarget.dataset.index
    let list = that.data.one
    list.forEach(function (item, index) {
      if (index == indexs) {
        item.choice = 1
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
      } else {
        item.choice = 0
      }
    })
    that.setData({
      six: list
    })
   },

  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})