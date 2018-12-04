var md5 = require("md5.js");
var ktop = require('ktop.js')

var appId = "wxdf186d3994d81b72"
var appKey = "GH89ns2X5sknsSMNSXIOWX2I9B12HSKg"

var wxpay = {
    request: function (option) {
        var that = this
        var user = getApp().user
        ktop.request({
            api: 'kml.o.chargeInfo',
            data: {
                orderId: option.orderId,
                service: 7,
                openId: user.openid_sp
            },
            loading: true,
            finish: function (res, code) {
                if (code == 0) {
                    that.pay({
                        mch_id: res.mch_id,
                        prepay_id: res.wx_prepay_id,
                        complete: option.complete
                    })
                }
            }
        })
    },
    upgrade: function (option) {
        var that = this
        var user = getApp().user
         ktop.request({
            api: 'kml.level.upgrade',
            data: {
                price: option.price,
                levelSettingId:option.levelSettingId,
                service: 7,
                openId: user.openid_sp
            },
            loading: true,
            finish: function (res, code) {
                if (code == 0) {
                    that.pay({
                        mch_id: res.mch_id,
                        prepay_id: res.wx_prepay_id,
                        complete: option.complete
                    })
                }
            }
        })
    },
    pay: function (option) {
        var timestamp = new Date().getTime() + ''
        var noncestr = md5.hex_md5(parseInt(Math.random() * 10000, 10))
        var mpackage = "prepay_id=" + option.prepay_id
        var mch_id = option.mch_id
        var paySign = this.genSign({
            appId: appId,
            nonceStr: noncestr,
            "package": mpackage,
            signType: "MD5",
            timeStamp: timestamp
        })

        wx.requestPayment({
            'appId': appId,
            'timeStamp': timestamp,
            'nonceStr': noncestr,
            'package': mpackage,
            'signType': 'MD5',
            'paySign': paySign,
            'success': function (res) {
                wx.showToast({
                    title: '支付成功'
                })
                option.complete(res, 0)
            },
            'fail': function (res) {
                option.complete(res, 1)
                if (res.errMsg == 'requestPayment:fail cancel') {
                    wx.showToast({
                        title: '取消支付'
                    })
                } else {
                    wx.showToast({
                        title: '支付失败'
                    })
                }
            }
        });
    },
    genSign: function (params) {
        console.log(params)
        var keys = Object.keys(params);
        keys.sort()
        var str = "";
        for (var k = 0, len = keys.length; k < len; k++) {
            str += keys[k];
            str += "=";
            str += params[keys[k]];
            str += "&";
        }
        str += "key=";
        str += appKey;
        var sign = md5.hex_md5(str).toUpperCase()
        return sign
    }
}
module.exports = wxpay;