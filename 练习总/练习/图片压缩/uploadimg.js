//https://yiapi.qiqiangkeji.com/upload

var url = "http://yiapi.qiqiangkeji.com/upload";

//https://yiapi.qiqiangkeji.com/upload
var myCanvas = document.getElementById("myCanvas");
var ctx = myCanvas.getContext("2d");

function uploadimg(file, suc, err) {
	for(let i = 0; i < file.length; i += 1) {
		var reader = new FileReader();
		var type = file[i].type;
		reader.readAsDataURL(file[i]);
		reader.onload = function(pic) {
			if(file[i].size < 1000000) {
				var formData = new FormData();
				formData.append("img", file[i])
				up(formData, suc, err);
			} else {
				compress(pic.target.result, file[i].type, suc, err);
			}

		}
		//		up(formData, suc, err);
	}
}

function compress(img, type, suc, err) {
	var myImg = new Image();
	myImg.src = img;
	myImg.onload = function() {
		var widthImg = myImg.width;
		var heightImg = myImg.height;
		myCanvas.width = widthImg;
		myCanvas.height = heightImg;
		ctx.drawImage(myImg, 0, 0, widthImg, heightImg);
		var ndata = myCanvas.toDataURL('image/jpeg', 0.1);
		toBlob(ndata, type, suc, err);
	}

}

function toBlob(base64, type, suc, err) {
	var text = window.atob(base64.split(",")[1]);
	var buffer = new ArrayBuffer(text.length);
	var ubuffer = new Uint8Array(buffer);
	var pecent = 0;

		for(var i = 0; i < text.length; i++) {
			ubuffer[i] = text.charCodeAt(i);
		}

	var Builder = window.WebKitBlobBuilder || window.MozBlobBuilder;
	var blob;

	if(Builder) {
		var builder = new Builder();
		builder.append(buffer);
		blob = builder.getBlob(type);
	} else {
		blob = new window.Blob([buffer], {
			type: type
		});
	}
	var formData = new FormData();
	formData.append("img", blob);
	up(formData, suc, err);
}

function up(file, suc, err) {
	$.ajax({
		type: "POST",
		url: url,
		async: true,
		data: file,
		dataType: "json",
		processData: false,
		contentType: false,
		xhrFields: {
			withCredentials: true
		},
		success: function(res) {
			suc(res)
		},
		error: function(res) {
			err(res)
		}
	})
}
export {
	uploadimg
}
