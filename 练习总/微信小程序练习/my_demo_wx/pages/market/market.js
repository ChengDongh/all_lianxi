// pages/market/market.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotSearch: [{
      id: 0,
      title: '推荐'
    }, {
      id: 1,
      title: '居家百货'
    }, {
      id: 2,
      title: '优雅女装'
    }, {
      id: 3,
      title: '美容护肤'
    }, {
      id: 4,
      title: '男士皮鞋'
    }, {
      id: 5,
      title: '彩妆香氛'
    }, {
      id: 6,
      title: '品牌特价'
    }],
    category_id: 0,
    banners: [{
      target_id: 0,
      pic: '../resource/image/mybanner.png'
    }, {
      target_id: 1,
      pic: '../resource/image/makemoneyimg.png'
    }, {
      target_id: 2,
      pic: '../resource/image/mybanner.png'
    }],
    banners_1: [{
      target_id: 0,
      pic: '../resource/image/mybanner.png'
    }, {
      target_id: 1,
      pic: '../resource/image/makemoneyimg.png'
    }, {
      target_id: 2,
      pic: '../resource/image/mybanner.png'
    }],
    products: [{
      id: 0,
      title: '商品一',
      image: '../resource/image/img1.png',
      spec: '侧耳聆听，世界都变得安静，高清音质体验世界都变得安静，高清音质体验',
      price: '266.50',
      pre_price: '604.00'
    }, {
      id: 1,
      title: '商品二',
      image: '../resource/image/img2.png',
      spec: '侧耳聆听，世界都变得安静，高清音质体验世界都变得安静，高清音质体验',
      price: '266.50',
      pre_price: '604.00'
    }, {
      id: 2,
      title: '商品一',
      image: '../resource/image/img1.png',
      spec: '侧耳聆听，世界都变得安静，高清音质体验世界都变得安静，高清音质体验',
      price: '266.50',
      pre_price: '604.00'
    }, {
      id: 3,
      title: '商品二',
      image: '../resource/image/img2.png',
      spec: '侧耳聆听，世界都变得安静，高清音质体验世界都变得安静，高清音质体验',
      price: '266.50',
      pre_price: '604.00'
    }],
    products_1: [{
      id: 0,
      title: '商品一',
      image: '../resource/image/img1.png',
      spec: '侧耳聆听，世界都变得安静，高清音质体验世界都变得安静，高清音质体验',
      price: '266.50',
      pre_price: '604.00'
    }, {
      id: 1,
      title: '商品二',
      image: '../resource/image/img2.png',
      spec: '侧耳聆听，世界都变得安静，高清音质体验世界都变得安静，高清音质体验',
      price: '266.50',
      pre_price: '604.00'
    }, {
      id: 2,
      title: '商品一',
      image: '../resource/image/img1.png',
      spec: '侧耳聆听，世界都变得安静，高清音质体验世界都变得安静，高清音质体验',
      price: '266.50',
      pre_price: '604.00'
    }, {
      id: 3,
      title: '商品二',
      image: '../resource/image/img2.png',
      spec: '侧耳聆听，世界都变得安静，高清音质体验世界都变得安静，高清音质体验',
      price: '266.50',
      pre_price: '604.00'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    console.log(11111)
  },
  //头部导航条
  hotSearch(e) {
    let category_id = 0;
    let title = '';
    category_id = e.currentTarget.dataset.key.id;
    this.setData({
      category_id,
    })
    this.loadData();
  },
  loadData: function() {
    var that = this;
    that.setData({
      products: [],
      banners: []
    });
    wx.showLoading({
      title: '加载中',
    });
    setTimeout(() => {
      var products = that.data.products_1;
      var banners = that.data.banners_1;
      that.setData({
        products,
        banners
      });
      wx.hideLoading();
    }, 2000)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  // onReady: function() {

  // },

  /**
   * 生命周期函数--监听页面显示
   */
  // onShow: function() {

  // },

  /**
   * 生命周期函数--监听页面隐藏
   */
  // onHide: function() {

  // },

  /**
   * 生命周期函数--监听页面卸载
   */
  // onUnload: function() {

  // },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log(2222)
    wx.showLoading({
      title: '加载中',
    });
    setTimeout(() => {
      var products = this.data.products_1;
      this.setData({
        products
      });
      wx.hideLoading();
      wx.stopPullDownRefresh();
    }, 2000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var products = this.data.products;
    products.push(...this.data.products_1);
    this.setData({
      products
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

    wx.showShareMenu({
      withShareTicket: true
    })


    return {
      title: '转发时显示的标题',
      path: '转发的页面路径',

      success: res => {
        console.log('--- 转发回调 ---', res);

        //onShareAppMessage回调的shareTickets，如果没有，就说明不是转发到群聊的
        console.log('--- shareTickets ---', res.shareTickets);
        wx.showToast({
          title: res,
        })
        //转发到群里的才会有shareTickets
        if (res.shareTickets && res.shareTickets[0]) {

          //获取转发的详细信息
          wx.getShareInfo({
            shareTicket: res.shareTickets[0],
            success: res => {
              console.log('--- 错误信息 ---', res.errMsg);
              console.log('--- 包括敏感数据在内的完整转发信息的加密数据 ---', res.encryptedData);
              console.log('--- 错误信息 ---', res.iv);
            },
            fail: error => {
              console.log('--- getShareInfo fail ---', error);
            }
          })
        }
      },
      fail: () => {
        console.log('--- 转发失败 ---', path);
      }

    }
  }
})