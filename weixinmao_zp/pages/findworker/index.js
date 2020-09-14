var config = require('../../resource/js/config.js');

var markersData = [];
var app = getApp();

Page({

  data: {
    city: wx.getStorageSync('companyinfo').city,
    isCars: true,	// 选择车源开关
    isSort: true,	// 选择排序开关
    isPrice: true,	// 选择价格开关
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
    title: '',
    worklist: [
      {
        name: '张学航',
        sex: '1',
        jobtitle: '产品经理',
        age: '24',
        education: '大专',
        express: '一年一下'
      },
      {
        name: '李勇存',
        sex: '1',
        jobtitle: '项目经理',
        age: '35',
        education: '本科',
        express: '10年'
      },
      {
        name: '张雪',
        sex: '1',
        jobtitle: '前端工程师',
        age: '22',
        education: '本科',
        express: '一年以下'
      }

    ],
    arealist: [
      {
        name: '端州区'
      },
      {
        name: '鼎湖区'
      }, {
        name: '高要区'
      }, {
        name: '广宁县'
      }, {
        name: '德庆县'
      }, {
        name: '封开县'
      }, {
        name: '怀集县'
      }, {
        name: '四会市'
      }
    ]
  },

  // 首屏渲染
  onShow(params) {
    var that = this;
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

    //  housetypelist.push(data);
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

            // wx.setNavigationBarTitle({
            //   title: title['findwork'] + '-' + wx.getStorageSync('companyinfo').name,
            // })

          }
          that.setData({
            city: wx.getStorageSync('cityinfo').name,
            // arealist: res.data.data.arealist,
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

  toWorkerDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/weixinmao_zp/pages/workerdetail/index?id=" + id
    })

  }
  ,
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
          // console.log(res.data.data);
          // that.setData({
          //   worklist: res.data.data.worklist,

          // })
        }
      },
      complete: function () {
        that.setData({
          loadMore: ''
        })

      }
    });


  },
  selectcarsitem: function (e) {
    console.log(e.currentTarget.id);
    var carid = e.currentTarget.id;
    var title = e.currentTarget.dataset.title;
    console.log(e.currentTarget);

    this.setData({ carid: carid, isCars: true, title: title });
    this.data.houseareaid = carid;
    this.gethouselist();

  }
  ,
  selectpriceitem: function (e) {
    console.log(e.currentTarget.id);
    var priceid = e.currentTarget.id;
    var title = e.currentTarget.dataset.title;
    console.log(e.currentTarget);
    this.setData({ priceid: priceid, isPrice: true, price: title });
    this.data.housepriceid = priceid;
    this.gethouselist();
  }
  ,
  selecttypeitem: function (e) {
    console.log(e.currentTarget.id);
    var typeid = e.currentTarget.id;
    var title = e.currentTarget.dataset.title;
    console.log(e.currentTarget);
    this.setData({ typeid: typeid, isType: true, typetitle: title });
    this.data.housetype = typeid;
    this.gethouselist();
  }
  ,

  selectwayitem: function (e) {
    console.log(e.currentTarget.id);
    var selectid = e.currentTarget.id;
    var title = e.currentTarget.dataset.title;
    this.data.selecttitle = title;
    console.log(e.currentTarget);
    this.setData({ selectid: selectid, isSelect: true, selecttitle: title });
    this.data.letway = selectid;
    this.gethouselist();
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
  // 点击列表
  clickList: function () {
    wx.navigateTo({
      url: '../cars/cars'
    })
  },
  // 选择排序方式
  selectCars: function (e) {
    var that = this;
    that.setData({
      isSort: true,
      isPrice: true,
      isType: true,
      isCars: (!that.data.isCars)
    })
  },
  selectPrice: function () {
    var that = this;
    that.setData({
      isSort: true,
      isCars: true,
      isType: true,
      isPrice: (!that.data.isPrice)
    })
  },
  selectType: function () {
    var that = this;
    that.setData({
      isSort: true,
      isCars: true,
      isPrice: true,
      isType: (!that.data.isType)
    })
  },
  selectSort: function () {
    var that = this;
    that.setData({
      isCars: true,
      isPrice: true,
      isType: true,
      isSort: (!that.data.isSort)
    })
  },

  selectWay: function () {
    var that = this;
    that.setData({
      isSort: true,
      isCars: true,
      isPrice: true,
      isType: true,
      isSelect: (!that.data.isSelect)
    })
  },
  selectBrand: function () {
    wx.navigateTo({
      url: '../brand/brand'
    })
  }, onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.onShow();
  },
  // 分享
  onShareAppMessage: function () {
    return {
      title: '招人才-' + wx.getStorageSync('companyinfo').name,
      path: '/weixinmao_zp/pages/findworkder/index'
    }
  }
})