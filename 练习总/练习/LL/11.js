(function(w) {

	function defi(data, key, val) {
		observer(val);
		var deop = new watcherlist();
		Object.defineProperty(data, key, {
			enumerable: true,
			configurable: true,
			get: function() {
				if(watcherlist.target) {
					deop.watchers.push(watcherlist.target);
				}
				return val;
			},
			set: function(newval) {
				if(newval == val) {
					return false;
				}
				val = newval;
				deop.notify(); //通知更新
			}
		})
	}

	function observer(data) { //监听者
		if(typeof data != 'object') {
			return false;
		}
		Object.keys(data).forEach(function(item) {
			defi(data, item, data[item]);
		})
	}

	function watcherlist() //订阅者集合
	{
		this.watchers = [];
	}
	watcherlist.prototype = {
		notify: function() { //通知所有的订阅者更新数据
			this.watchers.forEach(function(item) {
				item.update();
			})
		}
	}

	function watcher(tar, el, key) { //订阅者
		this.vm = tar; //
		this.el = el; //节点
		this.key = key; //绑定的数据名
		watcherlist.target = this;
		this.value = this.vm[key];
		watcherlist.target = null;
	}
	watcher.prototype = {
		update: function() {
			var newval = this.vm[this.key];
			if(newval == this.value) {
				return false;
			}
			var noname = this.el.nodeName.toLocaleLowerCase();
			if(noname == "input") {
				this.el.value = newval;
			} else {
				this.el.innerHTML = newval;
			}

		}
	}

	function wlb(option) {
		if(/^#/.test(option.el)) //通过id寻找
		{
			this.el = document.getElementById(option.el.split("#")[1]);
		} else if(/^./.test(option.el)) {
			this.el = document.getElementsByClassName(option.el.split(".")[1])[0];
		}
		this.data = option.data; //data数据
		this.methods = option.methods; //methods方法集
		Object.keys(option.data).forEach(function(key) {
			this.prox(key, "data");
		}.bind(this))
		Object.keys(option.methods).forEach(function(key) {
			this.prox(key, "methods");
		}.bind(this))
		//				nodeToFragment(this.el);
		observer(this.data); //遍历data数据，
		this.compileElement(this.el); //
		return this;
	}
	wlb.prototype = {
		prox: function(key, type) {
			var that = this;
			Object.defineProperty(this, key, {
				enumerable: true,
				configurable: true,
				get: function() {
					return that[type][key];
				},
				set: function(newval) {
					that[type][key] = newval;
				}
			})
		},
		nodeToFragment: function(ele) {
			var fragment = document.createDocumentFragment(); //创建虚拟dom对象
		},
		compileElement: function(el) { //对根节点下的所有的节点进行遍历
			var that = this;
			var childnodelist = Array.from(el.children);
			childnodelist.forEach(function(item) {
				var reg = /\{\{(.*)\}\}/;
				var reg2 = /^v-/;
				var attributes = Array.from(item.attributes);
				attributes.forEach(function(attr) {
					if(reg2.test(attr.name)) {
						that.bindevent(item, attr.name, attr.value)
					}
				})
				var text = item.textContent;
				if(reg.test(text)) { //证明有双括号
					that.compileText(item, reg.exec(text)[1]);
				}
			})
		},
		bindevent: function(node, type, event) { //注册节点的事件
			var that = this;
			switch(type) {
				case "v-click":
					node.addEventListener("click", function() {
						that[event]();
					})
					break;
				case "v-model":
					var noname = node.nodeName.toLocaleLowerCase();
					if(noname == "input") {
						node.value = that[event];
						document.addEventListener("input", function(ev) {
							var val = ev.target.value;
							that[event] = val;
						})
						new watcher(that, node, event);
					}
					break;
					//						case "v-":
					//							break;	
				default:
					console.log("没有该指令!");
					break;
			}
		},
		compileText: function(node, text) {
			var that = this;
			node.innerHTML = that[text];
			new watcher(that, node, text);
		}
	}
	window.wlb = wlb;
})(window)