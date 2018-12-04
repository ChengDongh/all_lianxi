var ktop = require('../../utils/ktop.js')
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js")
var utils = require("../../utils/util.js");
const md5 = require('../../utils/md5.js');
Page({
  data: {
    orderDetails: [],
    product: null,
    orderKey: "",
    addressInfo: false,
    postFee: 0,
    taxFee: 0,
    totalPrice: 0,
    skusPrice: 0,
    quantity: 1,
    canShowPostFee: false,
    relName: '',
    id_card: '',
    ticket: null,
    productPrice: 0,
    state: -1,
    fromid: null,
    total: '',
    isShow: false, //显示地址选择
    area: null,
    provinces: [],
    citys: [],
    districts: [],
    index: [],
    currentExpress: {},
    options: {},
    province_id: null,
    expressmesg:null,//运费提示
    max_freight:0,//运费,
    paymenttotal:null,//支付总价,
    address_id:null,//地址id
    message:'',
    checked:false
  },
  onLoad: function(options) {
    this.setData({
      fromid: options.fromid ? options.fromid : null,
    })
    this.loadArea();
    this.getshopinfor();
    // var app = getApp()
    // var product = app.product
    /*var orderDetails = []
    for (var i = 0; i < product.productStyleInfos.length; i++) {
      var style = product.productStyleInfos[i]
      for (var j = 0; j < style.productSkuInfos.length; j++) {
        var sku = style.productSkuInfos[j]
        if (sku.quantity > 0) {
          orderDetails.push(sku)
        }
      }
    }*/
    // var orderKey = "p_" + product.id
    // this.setData({
    /*orderDetails: orderDetails,*/
    //   product: product,
    //   orderKey: orderKey
    // })
    // WxNotificationCenter.addNotification("expressChooseNotification", this.expressChoosed, this)
    // WxNotificationCenter.addNotification("senderChooseNotification", this.senderChoosed, this)
    // WxNotificationCenter.addNotification("expressChooseCoupon", this.senderTicket, this)
    /*this.calFee()*/
    // this.updateFee();

  },
  paymenttotal:function(){//计算需要支付的总价
  let total=this.data.total;//商品总价
    let max_freight = this.data.max_freight?this.data.max_freight:0;//运费
    let coupon = this.data.ticket?this.data.ticket.price:0;
    let paymenttotal = Number(total) + Number(max_freight) - Number(coupon) > 0 ? Number(total) + Number(max_freight) - Number(coupon):0.01;
      this.setData({
        paymenttotal,
      })
  },
  getoptions: function(options) {
    let box = this.data.options;
    for (let i in options) {
      box[i] = options[i]
    }
    this.setData({
      options: box
    })
  },
  deliveryPriceByProvince: function() {//根据地址和商品信息获取运费
  let that=this;
    let province_id = this.data.province_id;
    let shoplistid = [];
    for (let i of this.data.product) {
      shoplistid.push(i.productId);
    }
    shoplistid = JSON.stringify(shoplistid);
    ktop.request({
      api: '/freight',
      data: {
        province_id,
        spu_ids: shoplistid
      },
      finish: function(res) {
        if(res.code==0)
        { 
          that.setData({
            expressmesg:res.data.message,
            max_freight: res.data.max_freight
          })
          that.paymenttotal();
        }else{
          console.log(res.msg);
        }
      }

    })
 
  },
  onShow: function() {
    WxNotificationCenter.addNotification("changeaddressid", this.getoptions, this);
    WxNotificationCenter.addNotification("changecouponid", this.getoptions, this);
    let that = this;
    let openid = wx.getStorageSync('openid');
    wx.setNavigationBarTitle({
      title: '待付款订单'
    })
    if (this.data.options.couponid) { //判断是否有选择优惠券
      ktop.request({
        api: "/getUserHongbao1",
        data: {
          id: this.data.options.couponid,
          openid: wx.getStorageSync('openid')
        },
        finish: function(res, code) {
          console.log(res)
          if (res.code == 0) {
            that.setData({
              ticket: res.data,
            })
            that.paymenttotal();
          } else {
            wx.showModal({
              title: '提示',
              content: res.msg,
            })
          }
        }
      })
    }else{
      that.setData({
        ticket: null,
      })
    }
    if (this.data.options.addressid) { //判断是否有选择地址
      ktop.request({
        api: "/getUserAddress1",
        data: {
          openid: openid,
          id: this.data.options.addressid
        },
        finish: function(res, code) {
          if (res.code == 0) {
            let currentExpress = that.data.currentExpress;
            currentExpress.province = res.data.province;
            currentExpress.city = res.data.city;
            currentExpress.area = res.data.area;
            currentExpress.location = res.data.location;
            currentExpress.name = res.data.name;
            that.setData({
              currentExpress: currentExpress,
              addressInfo: true,
              province_id: res.data.province_id,
              address_id:res.data.id
            })
            that.deliveryPriceByProvince();
          } else {
            console.log(res.msg);
          }
        }
      })
    } else {
      ktop.request({
        api: "/getUserAddress",
        data: {
          openid: openid
        },
        finish: function(res, code) {
          if (res.code == 0) {
            if (res.data.length > 0) {
              let currentExpress = that.data.currentExpress;
              currentExpress.province = res.data[0].province;
              currentExpress.city = res.data[0].city;
              currentExpress.area = res.data[0].area;
              currentExpress.location = res.data[0].location;
              currentExpress.name = res.data[0].name;
              that.setData({
                currentExpress: currentExpress,
                addressInfo: true,
                province_id: res.data[0].province_id,
                address_id: res.data[0].id
              })
              that.deliveryPriceByProvince();
            } else {
              that.setData({
                addressInfo: false
              })
            }

          } else {
            console.log(res.msg)
          }
        }
      })

    }
  },
  loadArea: function(addressid, callback) {
    var that = this;
    /*ktop.request({
      api: "kml.exp.checkAreaInfo",
      loading: false,
      data: {
        areaVersion: areaVersion
      },
      finish: function (res, code) {
        if (callback) {
          callback();
        }
        if (code == 0) {
          if (res.needUpdate > 0) {
            that.setData({
              area: res,
              index: [0, 0, 0]
            })
            that.upArea()
            wx.setStorageSync("area", res)
          }
        }
      }
    })*/
    ktop.request({
      api: "/getProvince",
      finish: function(res) {
        that.setData({
          area: res.data,
          index: [0, 0, 0]
        })
        wx.setStorageSync("area", res.data)
        that.upArea()
      }
    })
  },
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
    this.upArea()
  },
  upArea: function() {
    const that = this
    new Promise((resolve, reject) => {
      var indx = this.data.index;
      var ar = this.data.area;
      var ps = ar;
      var cs = [];
      var ds = [];
      ktop.request({
        api: "/getCity",
        data: {
          provinceId: ar[indx[0]].provinceID
        },
        finish: function(res) {
          cs = res.data;
          that.setData({
            provinces: ps,
            citys: cs
          })
          resolve(cs[indx[1]].cityID)
        }
      })
    }).then(function(id) {
      ktop.request({
        api: "/getArea",
        data: {
          cityId: id
        },
        finish: function(res) {
          that.setData({
            districts: res.data
          })
        }
      })
    })
  },
  saveCity: function() {
    var index = this.data.index;
    var currentExpress = this.data.currentExpress;
    console.log(currentExpress)
    currentExpress.province = this.data.provinces[index[0]].province;
    currentExpress.province_id = this.data.provinces[index[0]].provinceID;
    currentExpress.city = this.data.citys[index[1]].city;
    currentExpress.city_id = this.data.citys[index[1]].cityID;
    currentExpress.area = this.data.districts[index[2]].area;
    currentExpress.area_id = this.data.districts[index[2]].areaID;
    this.setData({
      currentExpress: currentExpress,
      province_id: this.data.provinces[index[0]].provinceID
    })
    this.selectCity()
  },
  selectCity: function() {
    var isShow = this.data.isShow;
    this.setData({
      isShow: !isShow
    })
  },
  addinfor: function(e) { //输入地址的wei双向绑定
    console.log(e.detail.value)
    let currentExpress = this.data.currentExpress;
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
  saveaddress: function() {
    let that = this;
    let message = '';
    if (this.data.currentExpress.name == '')
      message = '请填写收件人';
    else if (this.data.currentExpress.mobile == '')
      message = '请填写手机号码';
    else if (!this.data.currentExpress.province)
      message = '请填写地区选择';
    else if (this.data.currentExpress.location == '')
      message = '请填写详细地址';
    else if (!utils.isphone(this.data.currentExpress.mobile) && this.data.currentExpress.mobile !== '')
      message = '请填写正确格式的手机号码';
      console.log(message)
    new Promise(function(resolve, reject) {
      if (message != '') {
        wx.showModal({
          title: '提示',
          content: message,
        })
        resolve();
      } else {
        reject();
      }
    }).then(function() {}).catch(() => {
        let currentExpress = this.data.currentExpress;
        let openid = wx.getStorageSync('openid');
        ktop.request({
          api: "/addressUpdate",
          data: {
            name: currentExpress.name,
            mobile: currentExpress.mobile,
            province_id: currentExpress.province_id,
            province: currentExpress.province,
            city_id: currentExpress.city_id,
            city: currentExpress.city,
            area_id: currentExpress.area_id,
            area: currentExpress.area,
            location: currentExpress.location,
            openid: openid
          },
          finish: function(res) {
            console.log(res)
            if (res.code == 0) {
              that.setData({
                addressInfo: true,
                address_id: res.data.id,
              })
              that.deliveryPriceByProvince();
            } else {
              console.log(res.msg)
            }
          }
        })
      }

    )


  },
  getshopinfor: function() { //获取商品的信息缓存
    if (this.data.fromid == 0) {
      let shopinfor = wx.getStorageSync('buyinfor');
      this.setData({
        product: [shopinfor],
        total: shopinfor.num * shopinfor.sku.price
      })
    } else if (this.data.fromid == 1) {
      let shopinfor = wx.getStorageSync('orderinfor');
      let total = 0;
      for (let i of shopinfor) {
        total = total + i.num * i.sku.price;
      }
      this.setData({
        product: shopinfor,
        total: total
      })
    }
    this.paymenttotal();
  },
  onUnload: function() {
    var that = this
    WxNotificationCenter.removeNotification("expressChooseNotification", that)
    WxNotificationCenter.removeNotification("senderChooseNotification", that)
    WxNotificationCenter.removeNotification("expressChooseCoupon", that)
    var app = getApp()
    app.product = null
  },
  chooseAddress: function(e) {
    if (this.data.fromid && (this.data.fromid === "0" || this.data.fromid === "1"))
      wx.navigateTo({
        url: '/pages/express/express?fromplaceorder=true',
      })
  },
  expressChoosed: function(exp) {
    this.setData({
      addressInfo: exp
    })
    /*this.calPostFee()*/
    this.updateFee()
  },
  refreshSku: function(msku) {
    var orderDetails = this.data.orderDetails
    for (var i = 0; i < orderDetails.length; i++) {
      var sku = orderDetails[i]
      if (sku.id == msku.id) {
        orderDetails[i] = msku
        this.setData({
          orderDetails: orderDetails
        })
        /*this.calFee()*/
        return;
      }
    }
  },
  /*calFee: function () {
    var canShowPostFee = false
    var postFee = 0
    var taxFee = 0
    var skusPrice = 0
    var quantity = 0
    var orderDetails = this.data.orderDetails
    console.log(orderDetails)
    var product = this.data.product
    for (var i = 0; i < orderDetails.length; i++) {
      var sku = orderDetails[i]
      quantity += sku.quantity
      skusPrice += sku.current_level_price * sku.quantity
    }
    taxFee = skusPrice * product.tax_rate / 100.
    this.setData({
      taxFee: taxFee,
      skusPrice: this.toDecimal(skusPrice),
      quantity: quantity,
      canShowPostFee: canShowPostFee
    })
    this.updateFee()
    /*this.calPostFee()
  },*/
  /*calPostFee() {
    var canShowPostFee = false
    var postFee = 0
    var skusPrice = this.data.skusPrice
    var quantity = this.data.quantity
    var product = this.data.product
    if (product.package_flag == 0 || (product.free_shipping_numbers > 0 && quantity >= product.free_shipping_numbers)) {
      postFee = 0
      canShowPostFee = true
      this.updateFee(canShowPostFee, postFee, skusPrice)
    } else {
      var addressInfo = this.data.addressInfo
      if (!addressInfo || !addressInfo.province_id) {
        this.updateFee(false, postFee, skusPrice)
      } else {
        var orderDetailParseInfos = []
        var orderDetails = this.data.orderDetails
        var product = this.data.product
        for (var i = 0; i < orderDetails.length; i++) {
          var sku = orderDetails[i]
          orderDetailParseInfos.push({
            productSkuId: sku.id,
            quantity: sku.quantity
          })
        }
        var orderKey = this.data.orderKey
        var orderArr = [{
          orderKey: orderKey,
          orderDetailParseInfos: orderDetailParseInfos
        }]
        var json = JSON.stringify(orderArr)
        var that = this
        ktop.request({
          api: "kml.p.postfee",
          loading: true,
          data: {
            orders: json,
            provinceId: addressInfo.province_id
          },
          finish: function (res, code) {
            if (code == 0) {
              for (var i = 0; i < res.length; i++) {
                var model = res[i]
                if ([model.orderKey == orderKey]) {
                  postFee = model.postFee
                  canShowPostFee = true
                  that.updateFee(canShowPostFee, postFee, skusPrice)
                  break
                }
              }
            } else {
              setTimeout(function () {
                /*that.calPostFee()
                this.updateFee()
              }, 1.0)
            }
          }
        })
      }
    }
  },*/
  updateFee: function() { //运费
    /*postFee = this.toDecimal(postFee)
    var totalPrice = this.toDecimal(skusPrice + postFee)
    this.setData({
      postFee: postFee,
      totalPrice: totalPrice,
      canShowPostFee: canShowPostFee
    })*/
    let quantity = this.data.quantity
    if (!quantity) {
      quantity = 1
    }
    let price = Number(this.data.product.price) * Number(quantity);
    this.setData({
      productPrice: price
    })
    let postFee = 0;
    const addressInfo = this.data.addressInfo || {}
    const product = this.data.product
    let canShowPostFee = false
    const that = this
    if (product.package_flag === '0') {
      canShowPostFee = true
      postFee = 0
    }
    new Promise(function(resolve, reject) {
      if (addressInfo.id) {
        canShowPostFee = true
        if (product.package_flag !== '0') {
          wx.request({
            url: 'https://yiapi.qiqiangkeji.com/deliveryPriceByProvince',
            header: {
              'content-type': 'application/json'
            },
            data: {
              province_id: addressInfo.province_id,
              product_id: product.id
            },
            method: 'POST',
            success: function(res) {
              postFee = Number(res.data.data.default_price)
              resolve()
            }
          })
        } else {
          postFee = 0
          resolve()
        }
      } else {
        resolve()
      }
    }).then(function() {
      let ticket = 0
      if (that.data.ticket) {
        ticket = that.data.ticket.price
      }
      let totalPrice = Number((price + postFee - ticket).toFixed(2))
      if (totalPrice <= 0) {
        totalPrice = 0.01
      }
      that.setData({
        postFee: postFee || 0,
        totalPrice: totalPrice,
        canShowPostFee: canShowPostFee
      })
    })
  },
  checked:function(e){
    this.setData({
      checked:e.detail.value
    })
  },
  message:function(e){
  this.setData({
    message:e.detail.value
  })
  },
  placeorder:function(){
    if (this.data.addressInfo==false){
      wx.showModal({
        title: '提示',
        content: '请输入地址信息！',
      })
      return false;
    }
    let cart=[];
    for (let i of this.data.product)
    {
      cart.push({num:i.num,id:i.sku.id});
    }
    let data={
      openid: wx.getStorageSync('openid') ?wx.getStorageSync('openid'):'',
      address_id: this.data.address_id ? this.data.address_id:0,
      hongbao_id: this.data.ticket ? this.data.ticket.id:0,
      delivery_price: this.data.max_freight ? this.data.max_freight:0,
      pay_price: this.data.paymenttotal ? this.data.paymenttotal:0,
      hongbao_price: this.data.ticket ? this.data.ticket.price:0,
      refOpenid: wx.getStorageSync('refOpenid') ? wx.getStorageSync('refOpenid'):'',
      cart: JSON.stringify(cart),
      user_note:this.data.message,
      notify_flag:this.data.checked?"1":"0"
    };
    ktop.request({
      api:"/wxPlaceOrder",
      data,
      finish:function(res){
        if(res.code==0)
        {
           ktop.request({
             api:'/wxPrepay',
             data:{
                order_id:res.data,
                openid : wx.getStorageSync('openid')
             },finish:function(res){
               let timeStamp = String(res.data.timestamp); //时间戳
               let nonceStr = res.data.nonceStr; //随机字符串
               let packages = res.data.package; //返回的订单id
               let paySign = res.data.paySign;
               let signType = res.data.signType;
               wx.requestPayment({
                 'timeStamp': timeStamp,
                 'nonceStr': nonceStr,
                 'package': packages,
                 'signType': signType,
                 'paySign': paySign,
                 'success': function (res) {
                   if (res.errMsg == 'requestPayment:ok') {
                     wx.showToast({
                       title: '支付成功',
                       icon: 'success',
                       duration: 2000,
                       success:function(){
                         setTimeout(function(){
                           wx.navigateTo({
                             url: '/pages/orderList/orderList',
                           })
                         },1500)
                         
                       }
                     })
                   }
                 },
                 'fail': function (res) {
                   wx.showToast({
                     title: '支付失败',
                     icon: 'none',
                     duration: 2000,
                     success: function () {
                       setTimeout(function () {
                         wx.navigateTo({
                           url: '/pages/orderList/orderList',
                         })
                       }, 1500)
                     }
                   })
                 },
                 'complete': function (res) {
                   
                 }
               })
             }
           })
        }else{
          wx.showModal({
            title: '提示',
            content: res.msg,
          })
        }
      }

    })


  },
  // placeorder: function(e) {
  //   let errorMsg = ''
  //   if (!this.data.addressInfo) {
  //     errorMsg += "请填写收货地址\n"
  //   }
  //   if (this.data.product.need_identity == 1) {
  //     if (!this.data.relName) {
  //       errorMsg += "请填写姓名\n"
  //     }
  //     if (!this.data.id_card) {
  //       errorMsg += "请填写身份证号码\n"
  //     }
  //     if (!utils.isIdCard(this.data.id_card) && this.data.id_card) {
  //       errorMsg += "身份证号码格式不正确\n"
  //     }
  //   }
  //   if (errorMsg.length > 0) {
  //     wx.showModal({
  //       title: '提示',
  //       content: errorMsg,
  //       showCancel: false
  //     })
  //     return false;
  //   }
  //   //console.log(wx.getStorageSync('refOpenid') +'11111111111111111111111111')
  //   const openid = wx.getStorageSync('openid')
  //   const product_id = this.data.product.id
  //   /*console.log("quantity" + this.data.quantity, this.data.addressInfo.id, "openid" + wx.getStorageSync('openid'), "totalPrice" + this.data.totalPrice, "postFee" + this.data.postFee, "relName" + this.data.relName, "id_card" +this.data.id_card)*/
  //   const ticket = this.data.ticket || {};
  //   const orderInfo = {
  //     sku_id: this.data.product.skuId,
  //     quantity: this.data.quantity,
  //     address_id: this.data.addressInfo.id,
  //     openid: openid,
  //     /*openid*/
  //     hongbao_id: ticket.id || '',
  //     hongbao_price: ticket.price || '',
  //     pay_price: this.data.totalPrice,
  //     delivery_price: this.data.postFee,
  //     buyer_name: this.data.relName,
  //     buyer_identity: this.data.id_card,
  //     refOpenid: wx.getStorageSync('refOpenid')
  //   }
  //   var that = this
  //   wx.request({
  //     url: 'https://yiapi.qiqiangkeji.com/wxPlaceOrder',
  //     header: {
  //       'content-type': 'application/json'
  //     },
  //     data: orderInfo,
  //     method: 'POST',
  //     success: function(res) {
  //       if (res.data.code !== 0) {
  //         wx.showModal({
  //           title: '下单失败',
  //           content: res.data.msg,
  //         })
  //         return
  //       }
  //       const params = {
  //         order_id: res.data.data[0],
  //         openid: openid,
  //         service: 2
  //       }
  //       const orderId = res.data.data[0]
  //       wx.request({
  //         url: 'https://yiapi.qiqiangkeji.com/wxPrepay',
  //         header: {
  //           'content-type': 'application/json'
  //         },
  //         data: params,
  //         method: 'POST',
  //         success: function(res) {
  //           const timestamp = String(parseInt(new Date().getTime() / 1000))
  //           const APPID = 'wx6f2843b2a2db9952'
  //           const noncestr = md5.hex_md5(parseInt(Math.random * 10000, 10))
  //           const mpackage = 'prepay_id=' + res.data.data[0]
  //           let obj = {
  //             appId: APPID,
  //             nonceStr: noncestr,
  //             package: mpackage,
  //             signType: 'MD5',
  //             timeStamp: timestamp
  //           }
  //           let paySign = ''
  //           for (let key of Object.keys(obj)) {
  //             paySign += key + '=';
  //             paySign += obj[key] + '&'
  //           }
  //           paySign += 'key=afdjasofpjwelkgfnafjmdangwlnflks'
  //           paySign = md5.hex_md5(paySign)
  //           wx.requestPayment({
  //             'timeStamp': timestamp,
  //             'nonceStr': noncestr,
  //             'package': mpackage,
  //             'signType': 'MD5',
  //             'paySign': paySign,
  //             'success': function(res) {
  //               wx.redirectTo({
  //                 url: `/pages/fightGroups/fightGroups?orderId=${orderId}&id=${product_id}`
  //               })
  //             },
  //             'fail': function(res) {
  //               console.log(res)
  //             },
  //             'complete': function(res) {
  //               console.log(res)
  //             }
  //           })
  //           if (res.data.code === 0) {
  //             try {
  //               WeixinJSBridge.invoke('getBrandWCPayRequest', {
  //                 appId: APPID, //公众号名称，由商户传入
  //                 timeStamp: timestamp, //时间戳
  //                 nonceStr: noncestr, //随机串
  //                 package: mpackage, //扩展包
  //                 signType: 'MD5', //微信签名方式:1.sha1
  //                 paySign: paySign //微信签名
  //               }, (res) => {
  //                 if (res.err_msg === 'get_brand_wcpay_request:ok') {
  //                   console.log({
  //                     name: 'orderPay',
  //                     query: {
  //                       order_id: 1
  //                     }
  //                   })
  //                 } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
  //                   console.log('已取消微信支付!')
  //                 } else {
  //                   console.log('付款失败')
  //                 }
  //               })
  //             } catch (e) {
  //               console.log('不支持微信支付，请用手机微信进行操作！')
  //             }
  //           }
  //         }
  //       })
  //     }
  //   })
  // },
  chooseSender: function() {
    wx.navigateTo({
      url: '/pages/address_sender/address_sender?fromplaceorder=true'
    })
  },
  toDecimal: function(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
      return;
    }
    f = Math.round(x * 100) / 100;
    return f;
  },
  minus: function(e) {
    /*var dataset = e.target.dataset
    var sku = dataset.sku
    var style = dataset.style
    if (sku.quantity > 0) {
      sku.quantity -= 1;
      this.refreshSku(sku)
    }
    this.refreshStyle(style)*/

    let num = Number(this.data.quantity) - 1
    this.setData({
      quantity: num
    })
    this.updateFee()
  },
  plus: function(e) {
    /*console.log(e)
    var dataset = e.target.dataset
    var sku = dataset.sku
    var style = dataset.style
    sku += 1;
    this.refreshSku(sku)*/
    let num = Number(this.data.quantity) + 1
    this.setData({
      quantity: num
    })
    this.updateFee()
  },
  inputQuantity: function(e) {
    var dataset = e.target.dataset
    var sku = dataset.sku
    var style = dataset.style
    var num = e.detail.value
    if (num === '') {
      this.setData({
        quantity: ''
      })
    } else if (isNaN(num) || num <= 0) {
      this.setData({
        quantity: 1
      })
    } else {
      num = Number(num)
      this.setData({
        quantity: num
      })
    }
    this.updateFee()
    /*if (!num || num.length == 0) {
      sku.quantity = 0;
    } else {
      var q = parseInt(num)
      if (q < 0) {
        q = 0
      } else if (q > sku.available_inventory) {
        q = sku.available_inventory
      }
      sku.quantity = q
    }
    this.refreshStyle(style, 1)
    /*this.refreshSku(sku)*/
  },
  nameChange(e) {
    const val = e.detail.value
    this.setData({
      relName: val
    })
  },
  idCardChange(e) {
    const val = e.detail.value
    this.setData({
      id_card: val
    })
  },
  chooseCoupon() {
    // const app = getApp();
    // app.price = this.data.productPrice;
    let fromid = this.data.fromid;
    wx.navigateTo({
      url: '/pages/coupon/coupon?fromplaceorder=true',
    })
  },
  senderTicket(ticket) {
    console.log(ticket)
    //   ticket.price = Number(ticket.price).toFixed(2)
    //   this.setData({
    //     ticket
    //   })
    //   this.updateFee()
  }
})