require('framework7/dist/js/framework7');
var $$ = Dom7;
var myApp;
var framework = {
  init: function(e) {
    if (myApp) {
      return myApp;
    } else {
      return new Framework7(e);
    }
  }
};

var set = {
  init: function() {
    myApp = framework.init({
      pushState: true
    });
    // Add view
    var mainView = myApp.addView('.view-main', {
      // Because we use fixed-through navbar we can enable dynamic navbar
      dynamicNavbar: true,
      animatePages:true,
      swipeBackPageAnimateOpacity:false
    });
    $$(document).on('pageInit', function (e) {
      var page = e.detail.page;
      if(page.name==='forget'){
        mainView.hideToolbar();
      }
    });
    //主页
    myApp.onPageInit('index', function(page) {
    });
	//我要咨询
	myApp.onPageInit('my-consulation', function(page) {
	  var close = $$('.warning').find('.iconfont');
	  close.on('click',function (){
		$$ ('.warning').css({display:'none'});
	  });
	  var proText = $$('.problem-brief').find('textarea');
	  $$('.problem-brief').on('click',function (){
		proText.focus();
	  });
	  proText.on('keyup',function (){
		var len = $$(this).val().length;
		$$('.now-number').text(len);
	  });
	});
	//手机确认
	myApp.onPageInit('mobile-cerif', function(page) {
	  $$('.mobile-number').on('click',function (){
		$$(this).find('input').focus();
	  });
	  $$('.cerif-number').on('click',function (){
		$$(this).find('input').focus();
	  });
	  var codNumber = 59;
	  var t;
	  var open = true;
	  var move = function (){
		  codNumber--;
		  $$('.code-number').text(codNumber+'s 重新获取');
		  if(codNumber < 0) {
			open = true;
			$$('.code-number').text('获取验证码');
			codNumber = 59;
			clearInterval(t);
		  }
	  };
	  $$('.code-number').on('click',function (){
		if(open) {
		  open = false;
		   t = setInterval(move,1000);
		}else {
		  return
		}
	  });
	});
	//热门资讯列表
	myApp.onPageInit('hot-consultation-list', function(page) {
	  $$('.true-tab').on('click',function (){
			$$('.the-tab').addClass('active');
	  });
	  $$('.title-icon').on('click',function (){
		$$('.the-tab').addClass('active');
	  });
	  $$('.the-tab').find('.tab').on('click',function (){
		var text = $$(this).text();
		$$('.true-tab').text(text);
		$$(this).parent().removeClass('active');
	  })
	});
	//热门资讯详细
	myApp.onPageInit('hot-consultation-detail', function(page) {
		$$('.thumbs-up').on('click',function (){
		  $$(this).toggleClass('active');
		  $$(this).find('i').toggleClass('icon-like-full');
		});
	  $$('.collection').on('click',function (){
		$$(this).toggleClass('active');
		$$(this).find('i').toggleClass('icon-favorite-full');
	  });
	});
  }
};

exports.set = set;
exports.framework = framework;
// exports.chart = chart;