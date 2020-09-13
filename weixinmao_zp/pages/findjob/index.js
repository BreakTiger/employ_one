var markersData = [];
var app = getApp();
Page({
  data: {
    city: wx.getStorageSync('companyinfo').city,
    isType: true,
    isSelect: true,
    loadMore: '',
    list: [],
    house_list: [],
    housetypelist: [],
    houseareaid: 0,
    housepriceid: 0,
    housetype: 0,
    letway: 0,
    page: 1,
    title: ''
  },
  // 首屏渲染
  onShow(params) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '招聘会',
    })
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    // var data = { 'name': '住宅', 'id': 1 };
    var housetypelist = [
      { 'name': '初中', 'id': 1 },
      { 'name': '高中', 'id': 2 },
      { 'name': '中技', 'id': 3 },
      { 'name': '中专', 'id': 4 },
      { 'name': '大专', 'id': 5 },
      { 'name': '本科', 'id': 6 },
      { 'name': '硕士', 'id': 7 },
      { 'name': '博士', 'id': 8 },
      { 'name': '博后', 'id': 9 }];

    var housewaylist = [
      { 'name': '全职', 'id': 1 },
      { 'name': '兼职', 'id': 2 }
    ];


    var typeid = 0;
    var carid = 0;
    var priceid = 0;
    var selectid = 0;
    this.setData({ housetypelist: housetypelist, housewaylist: housewaylist, typeid: typeid, carid: carid, priceid: priceid, selectid: selectid });

    var cityinfo = wx.getStorageSync('cityinfo');
    if (cityinfo) {

      wx.setStorageSync('city', cityinfo.name);
      that.initpage();

    } else {

    }


  },

  initpage: function () {

    var that = this;
    var city = wx.getStorageSync('city');
    app.util.request({
      'url': 'entry/wxapp/getinitinfo',
      data: { city: city },
      success: function (res) {
        if (!res.data.message.errno) {
          wx.setStorageSync('cityinfo', res.data.data.cityinfo);

          if (!res.data.data.intro.maincolor) {
            res.data.data.intro.maincolor = '#3274e5';

          }
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: res.data.data.intro.maincolor,
            animation: {
              duration: 400,
              timingFunc: 'easeIn'
            }
          })
          var title = res.data.data.title;
          if (res.data.data.intro.ischeck == 1) {

            wx.setNavigationBarTitle({
              title: '服务中心-' + wx.getStorageSync('companyinfo').name,
            })

          } else {



          }
          that.setData({
            city: wx.getStorageSync('cityinfo').name,
            arealist: res.data.data.arealist,
            jobcatelist: res.data.data.jobcatelist,
            notetitle: title['notetitle'],
            title: '',
            price: '',
            typetitle: '',
            selecttitle: '',
            ischeck: res.data.data.intro.ischeck,
            intro: res.data.data.intro,
            selectworktitle: res.data.data.selectworktitle
          })

          that.gethouselist();
        }
      },
      complete: function () {

        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh();
      }
    });


  },

  join: function () {
    wx.showModal({
      title: '提示',
      content: '请先登录',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/weixinmao_zp/pages/message/index',
          })
        }
      }
    })


  },

  toWorkerDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/weixinmao_zp/pages/workerdetail/index?id=" + id
    })

  },

  toSearch: function (e) {
    wx.navigateTo({
      url: "/weixinmao_zp/pages/searchnote/index"
    })

  },

  gethouselist: function (e) {
    var that = this;
    var cityid = wx.getStorageSync('cityinfo').id;
    app.util.request({
      'url': 'entry/wxapp/getfindworkerlist',
      data: { cityid: cityid, page: that.data.page, houseareaid: that.data.houseareaid, housepriceid: that.data.housepriceid, housetype: that.data.housetype, letway: that.data.letway },
      success: function (res) {
        if (!res.data.message.errno) {
          console.log(res.data.data);
          that.setData({
            worklist: res.data.data.worklist,

          })
        }
      },
      complete: function () {
        that.setData({
          loadMore: ''
        })

      }
    });


  },

  // 下拉加载
  onReachBottom(params) {
    var that = this;
    that.setData({
      loadMore: '正在加载中...'
    })
    this.data.page = this.data.page + 1;
    this.gethouselist();
  },

  // 点击搜索
  clickSearch: function (e) {
    wx.switchTab({
      url: '/pages/search/search'
    })
  },


  //进入会场
  toVenue: function () {
    wx.navigateTo({
      url: '/weixinmao_zp/pages_two/venue/venue',
    })
  },

  selectBrand: function () {
    wx.navigateTo({
      url: '../brand/brand'
    })
  },

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.onShow();
  },
  // 分享
  onShareAppMessage: function () {
    return {
      title: '招聘会',
      path: '/weixinmao_zp/pages/findworkder/index'
    }
  }
})