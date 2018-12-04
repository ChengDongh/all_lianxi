var ktop = require('../../utils/ktop.js')
var utils = require('../../utils/util.js')
Page({
  data: {
    productId: 0,
    summary:"",
    styles: []
  },
  onLoad: function (options) {
    var productId = options.id
    var summary = options.summary
    this.setData({
      productId: productId,
      summary:summary
    })
    this.loadData()
  },
  loadData: function () {
    var that = this
    ktop.request({
      api: "kml.p.productimages",
      data: {
        productId: that.data.productId
      },
      loading: true,
      finish: function (res, code) {
        for (var i = 0; i < res.length; i++) {
          var style = res[i]
          for (var j = 0; j < style.images.length; j++) {
            style.images[j] = utils.removewebp(style.images[j])
          }
        }
        that.setData({ styles: res })
      }
    })
  },
  showImage: function (e) {
    var currentUrl = e.currentTarget.dataset.url
    var urls = []
    var styles = this.data.styles
    for (var i = 0; i < styles.length; i++) {
      var style = styles[i]
      urls = urls.concat(style.images)
    }
    wx.previewImage({
      current: currentUrl,
      urls: urls
    })
  }
})
