function $myajax(urls, type, data, isasync) {
    let tip = "http://qcapp.mangneng.com" //公共的url的服务端和端口号
    tip = tip + urls;
    if(type == 'POST') {
        return $.ajax({
            url: tip,
            type: 'POST',
            data: data,
            async: isasync ? isasync : true,
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
        })
    }
    if(type == 'GET') {
        return $.ajax({
            url: tip,
            type: 'GET',
            async: isasync ? isasync : true,
            xhrFields: {
                withCredentials: true // 携带跨域cookie
            },
        })
    }
}