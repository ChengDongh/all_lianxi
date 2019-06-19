var utils = require("../../utils/util.js");
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    changeaddressid: '',
    currentExpress: {}, //地址信息
    addressInfo: false,
    address_id: '',
    total: 0,
    total_a: 0,
    provinces: [],
    citys: [],
    districts: [],
    index: [],
    show: false,
    product: [],
    id: null,
    defaultCheck: 1,
    freight: 0,
    notifyFlag: 1,
    comment: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      openid: wx.getStorageSync('openid')
    })
    this.getProvince();
  },
  getoptions: function(options) {
    let changeaddressid = options.addressid;
    this.setData({
      changeaddressid
    })
  },
  getProvince: function() {
    var that = this;
    wx.request({
      url: 'http://hisin.natapp1.cc/address/getProvince',
      method: 'POST',
      data: {
        openid: that.data.openid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code == 200) {
          that.setData({
            provinces: res.data.data,
            index: [0, 0, 0]
          })
          that.getCity();
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }

      },
      fail: function(err) {
        console.log(err)
      }
    })
  },
  getCity: function() {
    var that = this;
    var provinces = that.data.provinces;
    var inde = that.data.index;
    new Promise(function(resolve, reject) {
      wx.request({
        url: 'http://hisin.natapp1.cc/address/getCity',
        method: 'POST',
        data: {
          openid: that.data.openid,
          provinceId: provinces[inde[0]].provinceId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          if (res.data.code == 200) {
            that.setData({
              citys: res.data.data,
            })
            resolve(res.data.data[inde[1]].cityId)
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
            })
          }

        },
      })
    }).then(function(cityId) {
      wx.request({
        url: 'http://hisin.natapp1.cc/address/getArea',
        method: 'POST',
        data: {
          openid: that.data.openid,
          cityId: cityId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          if (res.data.code == 200) {
            that.setData({
              districts: res.data.data,
            })
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
            })
          }
        },
        fail: function(err) {
          console.log(err)
        }
      })
    })
  },
  switch1Change: function(e) {
    var defaultCheck = this.data.defaultCheck
    if (e.detail.value == true) {
      defaultCheck = 1
    } else {
      defaultCheck = 0
    }
    this.setData({
      defaultCheck
    })
  },
  switch2Change: function(e) {
    var notifyFlag = this.data.notifyFlag
    if (e.detail.value == true) {
      notifyFlag = 1
    } else {
      notifyFlag = 0
    }
    this.setData({
      notifyFlag
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  //获取input输入值
  addinfor: function(e) {
    var currentExpress = this.data.currentExpress;
    switch (e.currentTarget.dataset.index) {
      case 'name':
        currentExpress.name = e.detail.value
        break;
      case 'mobile':
        currentExpress.mobile = e.detail.value
        break;
      case 'location':
        currentExpress.location = e.detail.value
        break;
    }
    this.setData({
      currentExpress
    })
  },
  //selet选择器改变时触发
  bindChange: function(e) {
    var value = e.detail.value
    var idx = this.data.index
    if (value[0] != idx[0]) {
      this.setData({
        index: [value[0], 0, 0]
      })
    } else if (value[1] != idx[1]) {
      this.setData({
        index: [value[0], value[1], 0]
      })
    } else if (value[2] != idx[2]) {
      this.setData({
        index: [value[0], value[1], value[2]]
      })
    }
    this.getCity();
  },
  //关闭打开select
  selectCity: function() {
    var show = this.data.show;
    this.setData({
      show: !show
    })
  },
  //确定按钮 保存select的值
  saveCity: function() {
    var index = this.data.index;
    var show = this.data.show;
    var currentExpress = this.data.currentExpress;
    currentExpress.province = this.data.provinces[index[0]].provinceName;
    currentExpress.provinceId = this.data.provinces[index[0]].provinceId;
    currentExpress.city = this.data.citys[index[1]].cityName;
    currentExpress.cityId = this.data.citys[index[1]].cityId;
    currentExpress.area = this.data.districts[index[2]].area;
    currentExpress.areaId = this.data.districts[index[2]].areaId;
    this.setData({
      currentExpress,
      show: !show
    })
  },
  addMessage: function(e) {
    var comment = e.detail.value;
    this.setData({
      comment
    })
  },
  //保存收货人信息
  saveAddress: function() {
    var message = '';
    var that = this;
    if (that.data.currentExpress.name == undefined) {
      message = '请填写收货人姓名'
    } else if ((!utils.isphone(that.data.currentExpress.mobile) && that.data.currentExpress.mobile == undefined) || (!utils.isphone(that.data.currentExpress.mobile) && that.data.currentExpress.mobile != undefined)) {
      message = '请输入正确的手机号'
    } else if (that.data.currentExpress.province == undefined) {
      message = '请选择地区'
    } else if (that.data.currentExpress.location == undefined) {
      message = '请填写详细地址'
    }
    if (message !== '') {
      wx.showModal({
        title: '提示',
        content: message,
      })
    } else {
      var currentExpress = that.data.currentExpress;
      wx.request({
        url: 'http://hisin.natapp1.cc/address/saveOrUpdateAddress',
        method: 'POST',
        data: {
          openid: that.data.openid,
          id: that.data.address_id,
          name: that.data.currentExpress.name,
          mobile: that.data.currentExpress.mobile,
          location: that.data.currentExpress.location,
          provinceId: that.data.currentExpress.provinceId,
          province: that.data.currentExpress.province,
          cityId: that.data.currentExpress.cityId,
          city: that.data.currentExpress.city,
          areaId: that.data.currentExpress.areaId,
          area: that.data.currentExpress.area,
          defaultCheck: that.data.defaultCheck,
          discarded: '',
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          if (res.data.code == 200) {
            that.getAddress();
            that.setData({
              addressInfo: true
            })
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
            })
          }
        },
        fail: function(err) {
          console.log(err)
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */

  onShow: function() {
    var that = this;
    WxNotificationCenter.addNotification("changeaddressid", that.getoptions, that);
    if (that.data.changeaddressid) {
      that.getAddressAll();
    } else {
      that.getAddress();
    }
    wx.getStorage({ //获取结算商品的信息
      key: 'orderInfo',
      success: function(res) {
        var total = 0;
        var total_a = that.data.total_a;
        var freight = that.data.freight;
        for (let i of res.data) {
          total = total + Number(i.sku.price) * i.num;
          freight = freight + Number(i.freight);
        }
        total_a = total;
        that.setData({
          product: res.data,
          total: total.toFixed(2),
          total_a: total_a.toFixed(2),
          freight: 10,
        })
      },
    })
  },
  // 获取地址
  getAddress: function() {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    wx.request({
      url: 'http://hisin.natapp1.cc/address/getOneAddress',
      method: 'POST',
      data: {
        openid: that.data.openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading();
        var currentExpress = that.data.currentExpress
        if (res.data.code == 200) {
          if (res.data.data) {
            currentExpress = res.data.data
            that.setData({
              addressInfo: true,
              currentExpress,
            })
          } else {
            that.getAddressAll()
          }
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }

      },
      fail: function(err) {
        console.log(err)
      }
    })
  },
  // 获取所有地址
  getAddressAll: function() {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    wx.request({
      url: 'http://hisin.natapp1.cc/address/getAllAddress',
      method: 'POST',
      data: {
        openid: that.data.openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading();
        var currentExpress = that.data.currentExpress
        if (res.data.code == 200) {
          var addressAll = res.data.data;
          if (addressAll.length > 0) {
            if (that.data.changeaddressid) {
              for (let i in addressAll) {
                if (addressAll[i].id == that.data.changeaddressid) {
                  currentExpress = addressAll[i];
                }
              }
            } else {
              currentExpress = res.data.data[0]
            }
            that.setData({
              addressInfo: true,
              currentExpress
            })
          } else {
            that.setData({
              addressInfo: false,
              currentExpress: {}
            })
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }

      },
      fail: function(err) {
        console.log(err)
      }
    })
  },
  //支付
  payment_btn: function() {
    var that = this;
    var cart = [];
    for (let i of that.data.product) {
      cart.push({
        num: i.num,
        id: i.sku.id
      });
    }
    if (that.data.addressInfo == false) {
      wx.showModal({
        title: '提示',
        content: '请输入地址信息！',
      })
      return false;
    }
    var data = {
      openid: that.data.openid,
      addressId: that.data.currentExpress.id,
      comment: that.data.comment,
      cart: cart,
      notifyFlag: that.data.notifyFlag,
      payPrice: that.data.total,
      orderNum:'',
    }
    wx.request({
      url: 'http://hisin.natapp1.cc/order/createOrder',
      method: 'POST',
      data: JSON.stringify(data),
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.code == 200) {
          let timeStamp = String(res.data.data.timeStamp); //时间戳
          let nonceStr = res.data.data.nonceStr; //随机字符串
          let packages = res.data.data.wxOrderPrepayId; //返回的订单id
          let paySign = res.data.data.paySign;
          let signType = res.data.data.signType;
          wx.requestPayment({
            'timeStamp': timeStamp,
            'nonceStr': nonceStr,
            'package': packages,
            'signType': signType,
            'paySign': paySign,
            'success': function(res) {
              if (res.errMsg == 'requestPayment:ok') {
                wx.showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 2000,
                  success: function() {
                    setTimeout(function() {
                      wx.navigateTo({
                        url: '/pages/orderList/orderList',
                      })
                    }, 1500)

                  }
                })
              }
            },
            'fail': function(res) {
              wx.showToast({
                title: '支付失败',
                icon: 'none',
                duration: 2000,
                success: function() {
                  setTimeout(function() {
                    wx.navigateTo({
                      url: '/pages/orderList/orderList',
                    })
                  }, 1500)
                }
              })
            }
          })
        }
      },
      fail: function(err) {
        console.log(err)
      }
    })
  },
  go_delivery: function() {
    wx.navigateTo({
      url: '/pages/delivery/delivery',
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})