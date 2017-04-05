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
      pushState: true,
      fastClicks:false
    });
    // Add view
    var mainView = myApp.addView('.view-main', {
      // Because we use fixed-through navbar we can enable dynamic navbar
      dynamicNavbar: true,
    });
    var e = $$('.toolbar .toolbar-item');
    var iconFull = ['icon-comment-i', 'icon-openness-i', 'icon-ioslist', 'icon-user-i'],
      iconEmpty = [ 'icon-comment', 'icon-openness', 'icon-list', 'icon-user'];
    e.each(function(i) {
      e.eq(i).touchstart(function() {
        var els = e.parent().find('i');
        for (var j = 0; j < els.length; j++) {
          $$(els[j]).removeClass(iconFull[j]).addClass(iconEmpty[j]);
        }
        e.removeClass('active');
        $$(this).addClass('active').find('i').removeClass(iconEmpty[i]).addClass(iconFull[i]);
      })
    });
    // Callbacks to run specific code for specific pages, for example for About page:
    myApp.onPageInit('index', function(page) {
      chart.init();
    });
    myApp.onPageInit('bbs', function(page) {
      $$('.question-more').on('click', function () {
        var t = $$(this).parents('.question-card').find('.title').text();
        var buttons1 = [
            {
                text: t,
                label: true
            },
            {
                text: '收藏问题',
                color: 'red'
            },
            {
                text: '分享',
            }
        ];
        var buttons2 = [
            {
                text: '取消'
            }
        ];
        var groups = [buttons1, buttons2];
        myApp.actions(groups);
      });

      $$('.open-more').on('click', function () {
        var t = $$('.question-title h1').text();
        var buttons1 = [
            {
                text: t,
                label: true
            },
            {
                text: '收藏问题',
            },
            {
                text: '分享',
            },
            {
                text: '我要提问',
                color: 'red'

            }
        ];
        var buttons2 = [
            {
                text: '取消'
            }
        ];
        var groups = [buttons1, buttons2];
        myApp.actions(groups);
      });
    });
    myApp.onPageInit('service', function(page) {});
    myApp.onPageInit('guide', function(page) {
      require(['iscroll/build/iscroll'], function(IScroll) {
        var t = new IScroll(".tab-view", {
          scrollX: true,
          scrollY: false,
          snap: true
        });
        var tabsWidth = [];
        for (var i = 0; i < $$(".tab-view a").length; i++) {
          tabsWidth.push($$(".tab-view a")[i].clientWidth);
        }
        var prev = 0;
        $$(document).on("touchstart", ".tab-view a", function() {
          var offset = $$(this).offset();
          var within = $$(".tab-view ul").offset();
          offset.width = $$(this)[0].clientWidth;
          within.width = window.innerWidth;
          var index = $$(this).attr("data-index");
          dir = prev > index ? 0 : 1; //方向向右为1
          var nextWidth = (index >= tabsWidth.length) ? 0 : tabsWidth[index];
          if (dir) {
            var w = offset.left + offset.width + nextWidth;
            var d = w >= within.width ? within.left + within.width - w : within.left;
            t.scrollTo(d, 0, 400);
          } else {
            var d = Number(index) - 2 >= 0 && offset.left < tabsWidth[Number(index) - 2] ? within.left - offset.left + tabsWidth[Number(index) - 2] : within.left;
            t.scrollTo(d, 0, 400);
          }
          prev = index;
        });
      });
    });
    myApp.onPageInit('counsel', function(page) {
      var conversationStarted = false;
      var answers = ['Yes!', 'No', 'Hm...', 'I am not sure', 'And what about you?', 'May be ;)', 'Lorem ipsum dolor sit amet, consectetur', 'What?', 'Are you sure?', 'Of course', 'Need to think about it', 'Amazing!!!', ];
      var people = [{
        name: 'AI',
        avatar: 'http://127.0.0.1:8080/static/images/timg.jpg'
      }, {
        name: 'Blue Ninja',
        avatar: 'http://127.0.0.1:8080/static/images/timg.jpg'
      }, ];
      var answerTimeout, isFocused;
      // Initialize Messages
      var myMessages = myApp.messages('.messages');
      // Initialize Messagebar
      var myMessagebar = myApp.messagebar('.messagebar');
      $$('.messagebar a.send-message').on('touchstart mousedown', function() {
        isFocused = document.activeElement && document.activeElement === myMessagebar.input[0];
      });
      $$('.messagebar a.send-message').on('click', function(e) {
        // Keep focused messagebar's input if it was in focus before
        if (isFocused) {
          e.preventDefault();
          myMessagebar.input[0].focus();
        }
        var messageText = myMessagebar.value();
        if (messageText.length === 0) {
          return;
        }
        // Clear messagebar
        myMessagebar.clear();
        // Add Message
        myMessages.addMessage({
          text: messageText,
          type: 'sent',
          day: !conversationStarted ? 'Today' : false,
          time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
        });
        conversationStarted = true;
        // Add answer after timeout
        if (answerTimeout) clearTimeout(answerTimeout);
        answerTimeout = setTimeout(function() {
          var answerText = answers[Math.floor(Math.random() * answers.length)];
          var person = people[Math.floor(Math.random() * people.length)];
          myMessages.addMessage({
            text: answers[Math.floor(Math.random() * answers.length)],
            type: 'received',
            name: person.name,
            avatar: person.avatar
          });
        }, 2000);
      });
      var autocompleteDropdownAjax = myApp.autocomplete({
        input: '#autocomplete-dropdown-ajax',
        openIn: 'dropdown',
        preloader: true, //enable preloader
        valueProperty: 'id', //object's "value" property name
        textProperty: 'name', //object's "text" property name
        limit: 20, //limit to 20 results
        dropdownPlaceholderText: 'Try "JavaScript"',
        expandInput: true, // expand input
        source: function(autocomplete, query, render) {
          var results = [];
          if (query.length === 0) {
            render(results);
            return;
          }
          // Show Preloader
          autocomplete.showPreloader();
          // Do Ajax request to Autocomplete data
          $$.ajax({
            url: 'http://127.0.0.1:8080/static/js/autocomplete-languages.json',
            method: 'GET',
            dataType: 'json',
            //send "query" to server. Useful in case you generate response dynamically
            data: {
              query: query
            },
            success: function(data) {
              // Find matched items
              for (var i = 0; i < data.length; i++) {
                if (data[i].name.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(data[i]);
              }
              // Hide Preoloader
              autocomplete.hidePreloader();
              // Render items by passing array with result items
              render(results);
            }
          });
        }
      });
    });
    myApp.onPageInit('counsel-lawyer', function(page) {
      require(['iscroll/build/iscroll'], function(IScroll) {
        var t = new IScroll("#area-wrapper",{
          scrollX: false,
          scrollY: true,
          scrollbars: true,
          mouseWheel: true,
          interactiveScrollbars: true,
          shrinkScrollbars: 'scale',
          fadeScrollbars: true
        });

        var d = new IScroll(".lawyer-inner",{
          scrollX: false,
          scrollY: true,
          scrollbars: true,
          mouseWheel: true,
          interactiveScrollbars: true,
          shrinkScrollbars: 'scale',
          fadeScrollbars: true
        });
      })
    });
	myApp.onPageInit('user-repo-info', function(page) {
	  if($$('.the-type').find('.iconfont').hasClass('yellow')) {
		$$('.the-type').find('.iconfont').removeClass('icon-success');
		$$('.the-type').find('.iconfont').addClass('icon-mores');
	  }
	});
	myApp.onPageInit('personal', function(page) {
	  var libut = $$('.state-ul');
	  libut.on('click',function (){
		$$('.state-ul').removeClass('active');
		$$(this).addClass('active');
		var name = $$(this).find('i').attr('data-page');
		var sta = $$('.state').find('.iconfont');
		sta.removeClass('icon-status-busy').removeClass('icon-status-online').removeClass('icon-status-offline');
		sta.addClass(name);
		var colord = $$(this).find('i').css('color');
		sta.css({color:colord})
	  })
	});
  },
};

exports.set = set;
exports.framework = framework;
// exports.chart = chart;