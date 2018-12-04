function formatTime(date, style) {
  date = new Date(date*1000)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  if (style == 1) {
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
  return [year, month, day].map(formatNumber).join('-')
}
function countDown(times, times2) {
  var timer = null;
  timer = setInterval(function () {
    var day = 0,
      hour = 0,
      minute = 0,
      second = 0;//时间默认值
    if (times > 0) {
      let times3 = times - times2;
      day = Math.floor(times3 / (60 * 60 * 24)) > 0 ? Math.floor(times3 / (60 * 60 * 24)) : 0;
      hour = Math.floor(times3 / (60 * 60)) > 1 ? Math.floor(times3 / (60 * 60)) : 0;
      minute = Math.floor(times3 / 60) - (day * 24 * 60) - (hour * 60);
      second = Math.floor(times3) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
    }
    let time = day + "天:" + hour + "小时：" + minute + "分钟：" + second + "秒";
    times--;
  }, 1000);
  if (times <= 0) {
    clearInterval(timer);
  }
}
function formatDay(seconds, style) {
  var date = new Date(seconds * 1000)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  if (style == 1) {
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
  return [year, month, day].map(formatNumber).join('-')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function removewebp(imgUrl) {
  return imgUrl.replace("?imageMogr2/format/webp", "")
}

function removewebps(array, key) {
  for (var i = 0; i < array.length; i++) {
    var item = array[i]
    item[key] = removewebp(item[key])
  }
}

function parseUrl(banners) {
  var url = banners.url
  var indexQuestion = url.indexOf("?")
  var scheme = url.substr(10, indexQuestion - 10)
  var query = url.substr(indexQuestion, url.length - indexQuestion)
  query = decodeURI(query)
  var indexTitle = url.indexOf("&title=")
  if ("products" == scheme) {
    if (indexTitle == -1) {
      query += "&title=" + banners.title
    }
    return "/pages/category_products/category_products" + query
  } else if ("product" == scheme) {
    return "/pages/product/product" + query
  } else if ("product_list" == scheme) {
    return "/pages/productList/productList" + query
  } else if (url.indexOf("http") == 0) {
    if (url.indexOf('quality_guarantee.html') > 0) {
      return "/pages/zhengpin/zhengpin";
    } else if (url.indexOf('activityId=') > 0) {
      return "/pages/activity/activity" + query
    }
    console.log(url)
  }
  return url
}

function parseBanner(banners) {
  for (var i = 0; i < banners.length; i++) {
    var banner = banners[i]
    banner.url = parseUrl(banner)
    banner.pic = removewebp(banner.pic)
  }
}

function isphone(mobile) {
  return /^1(3|4|5|7|8)\d{9}$/.test(mobile)
}
function isIdCard(idCard) {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard)
}

function imageUtil(e, w) {
  var originalWidth = e.detail.width;//图片原始宽  
  var originalHeight = e.detail.height;//图片原始高  
  var originalScale = originalHeight / originalWidth;//图片高宽比  
  if (!w) {
    w = 750
  }
  var imageHeight = (w * originalHeight) / originalWidth;
  return imageHeight;
}

module.exports = {
  formatTime: formatTime,
  removewebp: removewebp,
  removewebps: removewebps,
  parseBanner: parseBanner,
  formatDay: formatDay,
  isphone: isphone,
  isIdCard: isIdCard,
  imageUtil: imageUtil,
  countDown:countDown
}
