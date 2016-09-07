define(['jquery'],function($){
	function Dialog(){
		//this.name = "dialog";
		this.config = {
			width: 500,
			height: 300,
			y : 50,
			content : '',
			skinClassName : null,
			closeBtn : true,
			handerClose : null,
			confirmText : '确定',
			handerConfirm : null,
			mask : true,
			drag : false
		};
		this.handler = {};
	}

	Dialog.prototype = {
		constructor : 'Dialog',
		alert : function(cfg){
			var _this = this;
			var config = $.extend(this.config,cfg);
			
			
			var $dialogBox = $('<div class="win_dialogBox">\
									<div class="win_dialogHead">'+config.title+'</div>\
									<div class="win_dialogBody">'+config.content+'</div>\
								</div>');
				$dialogBox.appendTo('body');
			var $dialog_btn = $('<div class="win_dialogConfirm">'+config.confirmText+'</div>');
			
				$dialog_btn.appendTo($dialogBox);
				

			if(config.closeBtn){
				var $dialog_close = $('<div class="win_dialogClosed">×</div>');
				$dialog_close.appendTo($dialogBox);
				//关闭按钮
				$dialog_close.click(function() {
					//config.handerClose && config.handerClose();
					$dialogBox.remove();
					config.mask && $mask.remove();
					_this.fire('close');
				});
				//关闭按钮 回调
				if(config.handerClose){
					this.on('close',config.handerClose);
				}
			}
				
			//确认按钮
			$dialog_btn.click(function() {
				//config.handerConfirm && config.handerConfirm();
				$dialogBox.remove();
				config.mask && $mask.remove();
				_this.fire('confirm');
			});
			//确认按钮 回调
			if(config.handerConfirm){
				this.on('confirm',config.handerConfirm);
			}

			$dialogBox.css({
				width : config.width,
				height : config.height,
				left: config.x || ($(window).innerWidth() - config.width)/2+'px',
				top : config.y || ($(window).innerHeight() - config.height)/2+'px'
			});

			//遮罩层
			if(config.mask){
				var $mask = $('<div class="win_mask"></div>');
				$('body').append($mask);
			}

			//拖动
			if(config.drag){
				this.drag($dialogBox);
			}
			//换肤
			if(config.skinClassName){
				$dialogBox.addClass(config.skinClassName);
			}

			return this;
		},

		confirm : function(){
			console.log('dialog confirm');
		},

		prompt : function(){
			console.log('dialog prompt');
		},

		//自定义事件 绑定
		on : function(type,fn){
			if(typeof this.handler[type] == "undefined"){
				this.handler[type] = [];
			}

			this.handler[type].push(fn);

			return this;
		},
		//自定义事件 触发
		fire : function(type,data){
			if(this.handler[type] instanceof Array){
				var handlerArr = this.handler[type];
				for(var i=0; i<handlerArr.length; i++){
					handlerArr[i](data);
				}
			}
		},

		//拖动公用函数
		drag : function(obj){
			$('.win_dialogHead').css('cursor','all-scroll');
			$('.win_dialogHead').on('mousedown',function(ev){
				var disX = ev.pageX - $(this).offset().left;
				var disY = ev.pageY - $(this).offset().top;

				$(document).on('mousemove',function(ev){
					obj.css({
						left : ev.pageX - disX,
						top : ev.pageY - disY
					});
				});
				$(document).on('mouseup',function(){
					$(document).off('mousemove');
					$(document).off('mouseup');
				});

				return false;
			});
		}
	};

	
	return {
		Dialog: Dialog
	};
});