//导出
function exportMonth(year,month,aApi) {
  return "http://superviserapi.qiqiangkeji.com/"+aApi+"Export?year="+year+"&month="+month
}
function exportDay(day,aApi) {
  return "http://superviserapi.qiqiangkeji.com/"+aApi+"Export?day="+day
}
//时间转化
function formatDate(nS) {
  return new Date(parseInt(nS) * 1000).Format("yyyy-MM-dd hh:mm:ss");
}
Date.prototype.Format = function(fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
export {exportMonth,exportDay,formatDate}
