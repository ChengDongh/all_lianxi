const app = getApp()
Page({
  data: {
    inputText: '4FEEEEEE',
    receiveText: '',
    name: '',
    connectedDeviceId: '',
    services: {},
    characteristics: {},
    connected: true
  },
  bindInput: function(e) {
    this.setData({
      inputText: e.detail.value
    })
    // console.log(e.detail.value)
  },
  Send: function() {
    var that = this;
    if(that.data.connected){
      wx.getBLEDeviceServices({
        // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
        deviceId: that.data.connectedDeviceId,
        success: function (res) {
          // that.setData({
          //   services: res.services,
          //   msg: JSON.stringify(res.services),
          // })
          // wx.showModal({
          //   title: '提示',
          //   content: JSON.stringify(res.services),
          // })
          that.getBLEDeviceCharacteristics(1);
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '蓝牙未连接',
        confirmText: '连接蓝牙',
        success: function(res) {
          if(res.confirm){
            wx.navigateTo({
              url: '../search/search',
            })
          }
        }
      })
    }
  },
  getBLEDeviceCharacteristics(value) {
    var value = value;
    var that = this;
    wx.showModal({
      title: 'tt',
      content: that.data.connectedDeviceId,
    }),
    wx.getBLEDeviceCharacteristics({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
      deviceId: that.data.connectedDeviceId,
      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
      serviceId: "0000FFF0-0000-1000-8000-00805F9B34FB",
      success: function(res) {
        if (that.data.connected) {
          if (value == 1){
            var arr = [-86, 85, 8, 119, -118, -42, -118, 59, 125, 56, 100]
          }else{
            var arr = [-86, 85, 8, 6, -88, -85, -88, 70, 75, 69, 70]
          }
          
          var buf = new ArrayBuffer(arr.length)
          var dataView = new DataView(buf)
          for (var i = 0; i < arr.length; i++) {
            dataView.setInt8(i, arr[i]);
          }
          wx.writeBLECharacteristicValue({
            deviceId: that.data.connectedDeviceId,
            serviceId: "0000FFF0-0000-1000-8000-00805F9B34FB",
            characteristicId: "0000FFF3-0000-1000-8000-00805F9B34FB",
            value: buf,
            success: function(res) {
              wx.showModal({
                title: '提示',
                content: JSON.stringify(res),
              })
              // wx.showModal({
              //   title: '提示',
              //   content: buffer,
              // })
            },
            fail: function(res) {
              wx.showModal({
                title: '提示',
                content: JSON.stringify(res),
              })
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '蓝牙已断开',
            showCancel: false,
            success: function(res) {
              that.setData({
                searching: false
              })
            }
          })
        }
      },
      fail: function(res) {
        wx.showModal({
          title: '提示',
          content: JSON.stringify(res)
        })
        // console.log("fail");
      },
      complete: function() {
        // console.log("complete");
      }
    })
  },
  Close: function () {
    var that = this;
    wx.getBLEDeviceServices({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
      deviceId: that.data.connectedDeviceId,
      success: function (res) {
        that.getBLEDeviceCharacteristics(2);
      }
    })
  },
  onLoad: function(options) {
    var that = this
    // console.log(options)
    that.setData({
      name: options.name,
      connectedDeviceId: options.connectedDeviceId
    })
    wx.getBLEDeviceServices({
      deviceId: options.connectedDeviceId,
      success: function(res) {
        // console.log(res.services)
        that.setData({
          services: res.services
        })
        wx.getBLEDeviceCharacteristics({
          deviceId: options.connectedDeviceId,
          serviceId: "0000FFF0-0000-1000-8000-00805F9B34FB",
          success: function(res) {
            // console.log(res.characteristics)
            that.setData({
              characteristics: res.characteristics
            })
            wx.notifyBLECharacteristicValueChange({
              state: true,
              deviceId: options.connectedDeviceId,
              serviceId: "0000FFF0-0000-1000-8000-00805F9B34FB",
              characteristicId: "0000FFF4-0000-1000-8000-00805F9B34FB",
              success: function(res) {
                wx.onBLECharacteristicValueChange(function (res) {
                  wx.showModal({
                    title: '提示',
                    content: JSON.stringify(res),
                  })
                  var receiveText = app.buf2string(res.value)
                  // console.log('接收到数据：' + receiveText)
                  that.setData({
                    receiveText: receiveText
                  })
                })
              }
            })
          }
        })
      }
    })
    wx.onBLEConnectionStateChange(function(res) {
      console.log(res.connected)
      that.setData({
        connected: res.connected
      })
    })
    
  },
  onReady: function() {

  },
  onShow: function() {

  },
  onHide: function() {

  }
})