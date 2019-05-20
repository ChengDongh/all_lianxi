//@param method(必选)    请求类型  get 和 post
//@param url(必选)       请求的url地址   相同域名下的页面（此函数不支持跨域请求）
//@param data(必选)      请求协带的数据  以js对象的形式定义，如：{name:'张三'}
//@param callback(必选)  回调函数,可接收一个参数，这个参数就是服务器响应的数据
//@param type(可选)      指定服务器响应的数据类型（可选值：json,xml,text），如果是json模式，则使用json解析数据，默认为text普通字符串

var Url = "http://wuyeapi.qiqiangkeji.com"

function myAjax(method, url, data, callback, type) {
	var xhr;
	var url = Url + url
	if(window.XMLHttpRequest) { //IE7+, Firefox, Chrome, Opera, Safari
		xhr = new XMLHttpRequest();
	} else { // code for IE6, IE5
		xhr = new ActiveXObject("Microsoft.XMLHTTP")
	}

	xhr.onreadystatechange = function() {
		if(xhr.status == 200 && xhr.readyState == 4) {
			if(type == 'json') {
				var res = JSON.parse(xhr.responseText)
			} else if(type == "xml") {
				var res = xhr.responseXML
			} else {
				var res = xhr.responseText
			}
			callback(res)
		}
	}
	var param = "";
	if(JSON.stringify(data) != "{}") {
		for(var i in data) {
			param += i + '=' + data[i] + '&';
		}
		param = param.slice(0, param.length - 1);
	}
	if(method == 'get') {
		url = url + '?' + param;
	}

	xhr.open(method, url, true);
	if(method == 'post') {
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send(param);
	} else {
		xhr.send(null);
	}

}

function formatData(time) {
	var t = new Date(time * 1000);
	var year = t.getFullYear();
	var month = t.getMonth() + 1;
	month < 10 ? '0' + month : month;
	var data = t.getDate();
	data < 10 ? '0' + data : data;
	var hour = t.getHours();
	hour < 10 ? '0' + hour : hour;
	var minute = t.getMinutes();
	minute < 10 ? '0' + minute : minute;
	var second = t.getSeconds();
	second < 10 ? '0' + second : second;
	return year + '-' + month + '-' + data + ' ' + hour + ':' + minute + ':' + second;
}

function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}