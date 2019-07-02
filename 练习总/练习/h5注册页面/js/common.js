function GetQueryString(name) { //获取location的匹配search
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return(r[2]);
	return null;
}


var msgTip=(function(){
	var msgBox=$("<div id='msgBox'><p></p></div>");
	var timmer;
	$("body").append(msgBox);
	return {
		err:function(msg,callback,time){
			if(timmer)
				{
				clearTimeout(timmer);
				}
			time=time || 2000;
			msgBox.html(msg);
			msgBox.addClass("show");
			timmer=setTimeout(function(){
				clearTimeout(timmer);
				msgBox.removeClass("show");
				if(callback)
				{
				callback()
				}
			},time)
		},ok:function(msg,callback,time){
			if(timmer)
			{
			clearTimeout(timmer);
			}
			time=time || 2000;
			msgBox.html(msg);
			msgBox.addClass("show");
			timmer=setTimeout(function(){
				clearTimeout(timmer);
				msgBox.removeClass("show");
				if(callback)
					{
					callback()
					}
			},time)
		}
	}
})()