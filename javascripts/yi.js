/**
 * @license 
 * yi.js @VERSION - base client library.
 * 
 * NO COPYRIGHTS OR LICENSES. DO WHAT YOU LIKE.
 * 
 * 始于: 2010 年 七 月
 * Date: @DATE 
 */

(function($){          
    $.yiApp = $.yiApp || { 
        version: "@VERSION",        

        primaryNav: function (m, t) {
            var ul = $('<ul class="yiNavList"></ul>')
            for (var i=0; i<m.length; i+=2)
                ul.append('<li rel="#' + m[i+1] + '">' + m[i] + '</li>');
            $(".yiNav").append(ul);
            
            $('.yiNavList li').click(function(e){
                var sel = $('.yiNavList li.selected');
                if (sel.attr('rel') == $(this).attr('rel')) return;

                sel.removeClass('selected');
                $(sel.attr('rel')).fadeOut('slow');
                $(this).addClass('selected')
                $($(this).attr('rel')).fadeIn('slow');
                if (typeof(t) != undefined)
                    $(document).attr("title", t + ' - ' + $(this).text());
                e.preventDefault()
            })
        },

        secondNav: function (m) {
            for (var i=1; i < m.length; i++) {
                var id = "businessTab" + (i-1)
                var div = $('<div id="' + id + '" class="yiBoard"><ul></ul></div>')        
                var ul = $('ul', div)
                for (j in m[i]) {                   
                    tid = id + '-' + j
                    ul.append('<li><a href="#' + tid + '">' + m[i][j] + '</a></li>')
                    div.append('<div id=' + tid + '></div>')
                }
                ul.append('<li style="float: right;" class="yiTabTitle">' + m[0][i-1] + '</i>')
                $('#yiContent').append(div)
            }
        }, 

        panelNav: function(m) {
            if (m == undefined || ! $.isArray(m) || m.length == 0) return;

            var nav = $('#yiPanelNav').append('<ul></ul>');
            for (i in m) {
                var id = "yiPanel" + i;
                var div = $('<div><h3></h3><ul></ul></div>').attr('id', id);
                var ul = $('ul', div);
                $('h3', div).text(m[i]['title']);
                for (j in m[i]['list']) {
                    ul.append('<li class="panel">' + m[i]['list'][j] + '</li>');
                    var desc = $('<div></div>').attr({
                        'class': 'yiDesc description',
                        'rel': m[i]['desc'].length > j ? m[i]['desc'][j] : ""
                    });
                    div.append(desc);
                }
                $('#yiPanel').append(div);
                ul.tabs('#'+id+' > div.description', {
                    effect: 'fade',
                    fadeOutSpeed: 400,
                    onBeforeClick: function(e, i){             
                        var desc = this.getPanes()[i];
                        var rel = desc.getAttribute('rel');
                        if (rel && !desc.innerHTML)
                            $.yiApp.loadPage(rel, desc);
                    },
                    event: 'mouseover'
                });

                $('ul', nav).append('<li><img src="' + m[i]['img'] + '"/><strong>' + m[i]['title'] + '</strong></li>');
            }

            $('ul', nav).tabs("#yiPanel > div", {
                effect: 'fade',
                fadeOutSpeed: 400
            });
        },
        
        jingyan: null,
        jingyanCur: 0,
        jingyanShow: function(cur) {
            var jingyan = $("#yiJingYan div.ui-widget-content");
            
            if (cur >= this.jingyan.length) cur = 0;
            this.jingyanCur = cur;

            if (this.jingyan.length == 0 || this.jingyan[cur] == "") return;

            $('#yiJingYan strong').text("");
	    jingyan.animate({
	        backgroundColor: "#aa0000",
	        color: "#fff"
	    }, 1000);
	    jingyan.animate({
	        backgroundColor: "#fff",
	        color: "#000"
	    }, 1000);

            var jy = this.jingyan[cur].split("--");
            $('#yiJingYan strong').text(jy[0]);
            $('#yiQianMing').text("--    " + jy[1]);
        },

        demos: null,
        news: null,
        newsCur: -1,
        newsOffset: 0,

        isDemo: function () {
            return $('#yiNewsCtrl:visible').length == 0 && $('.yiOverlay :visible').length == 0;
        },

        newsShow: function (cur) {
            if (this.news.length == 0 || this.newsCur == cur) return;

            if (cur > 4 || cur < 0) cur = 0;

            this.newsCur = cur;

            cur = parseInt(cur) + this.newsOffset;

            if (this.news[cur] == "") return;
            
            var news = this.news[cur].split('\t');
            if (this.isDemo())
                $('.yiNewsTitle').show('blind', {}, 600);

            $('.yiNewsTitle').text(news[1]);

            $('.yiNews img').attr('src', 'image/news/' + news[0]);

            $($('.yiNewsCtrl li').removeClass("current")[this.newsCur])
                .addClass("current");
        },

        newsCtrl: function () {
            $('.yiNews')
                .mouseenter(function(){
                    $('.yiNewsCtrl').fadeIn('slow');
                })
                .mouseleave(function(){             
                    $('.yiNewsCtrl').fadeOut('slow');
                });

            $('.yiNews img').attr("rel", ".yiNewsPanel").overlay({
                effect: 'apple',
                mask: 'darkred',
                onBeforeLoad: function(){
                    this.getOverlay().find("> div").load(
                        "news/" + ($.yiApp.newsOffset+$.yiApp.newsCur)
                            + ".html");
                }
            });

            $('.yiNewsCtrl li').mouseenter(function(){
                $.yiApp.newsShow($(this).text()-1);
            });

	    $(".yiNewsBeginning").button({
	        text: false,
	        icons: {
		    primary: "ui-icon-seek-start"
	        }
	    }).click(function(){
                $.yiApp.newsOffset = 0;
                $.yiApp.newsShow(-1);
            });
	    $(".yiNewsRewind").button({
	        text: false,
	        icons: {
		    primary: "ui-icon-seek-prev"
	        }
	    }).click(function(){
                $.yiApp.newsOffset -= 5;
                if ($.yiApp.newsOffset == -5) 
                    $.yiApp.newsOffset = $.yiApp.news.length - 1 - 5;
                else if ($.yiApp.newsOffset < 0)
                    $.yiApp.newsOffset = 0;
                $.yiApp.newsShow(-1);
            });
	    $(".yiNewsForward").button({
	        text: false,
	        icons: {
		    primary: "ui-icon-seek-next"
	        }
	    }).click(function(){
                $.yiApp.newsOffset += 5;
                var step = $.yiApp.news.length - 1 - $.yiApp.newsOffset;
                if ( step < 5 && step > 0)
                    $.yiApp.newsOffset = ($.yiApp.news.length - 1) - 5;
                else if ($.yiApp.newsOffset + 1 >= $.yiApp.news.length)
                    $.yiApp.newsOffset = 0;
                $.yiApp.newsShow(-1);
            });
	    $(".yiNewsEnd").button({
	        text: false,
	        icons: {
		    primary: "ui-icon-seek-end"
	        }
	    }).click(function(){
                $.yiApp.newsOffset = $.yiApp.news.length - 1 - 5;
                $.yiApp.newsShow(-1);
            });
        },

        scrollable: function (img) {
            var div = $('<div class="yiScrollable"></div>')
                .append('<div class="items"></div>')

            for (i in img) {
                if (i % 5 == 0) {
                    var imgDiv = $('<div/>')
                    $('.items', div).append(imgDiv)
                }
                imgDiv.append('<img src="image/scroll/' + img[i] + '"/>')
            }
            $('#guangGao')
                .append('<a class="prev browse left"></a>')
                .append('<a class="next browse right"></a>')
                .append(div)

        },

        accordion: function (tid, a) {
            var div = $('<div id="' + tid.match('[^#].*') + 'Accordion"></div>')
            for (i in a) {
                div.append(
                    $('<div/>')
                        .append($('<h3><a href="#">' + a[i].title + '</a></h3>'))
                        .append($('<div>' + a[i].text + '</div>')))
            }
            $(tid).append(div)

            div.accordion({header: "h3", event: 'mouseover'})
        },

        createTabMenu: function (id, hA, bA) {
            var ul = $(id), panel = $('<div</div>')

            panel.addClass("yiPanel")
                .append('<div class="yiPanelTop"></div>')
                .append('<div class="yiPanelBody"></div>')
                .append('<div class="yiPanelBottom"></div>')
                .attr("id", id.match('[^#].*') + "Panel")

            for (i in hA) {
                var div = $('<div><ul></ul></div>'), ulDiv = $('ul', div)
                for (j in bA[i])
                    ulDiv.append('<li>' + bA[i][j] + '</li>')
                $('.yiPanelBody', panel).append(div)

                var li = $('<li/>')
                if (typeof(hA[i]) == 'string') {
                    ul.addClass("yiTabMenu");
                    // li.append('<span>' + hA[i] + '</span>')
                    li.append(hA[i])
                } else if ( typeof(hA[i]) == 'object' 
                            && ((typeof(hA[i].title) != undefined)
                                || (typeof(hA[i].icon) != undefined))) {
                    ul.addClass("yiTabIcon")
                    li.addClass(hA[i].icon)
                }
                ul.append(li)
            }

            $('body').append(panel)
        },

        tabMenu: function (id) {
            var tabs = $(id + ' > li')
            var panel = $(id + 'Panel')
            var body = $('> .yiPanelBody', panel)
            var bottom = $('> .yiPanelBottom', panel)

            $('div', body).slideUp('1500')
            panel.mouseout(function(e){
                top = $(this).offset().top - $(document).scrollTop()
                left = $(this).offset().left - $(document).scrollLeft()
                if (e.clientX < left || e.clientY < top
                    || e.clientX > left + $(this).innerWidth() - 4
                    || e.clientY > bottom.offset().top) {

                    $('div', body).slideUp('1500')
                    $(this).css("visibility", "hidden")
                    tabs.removeClass('selected')
                }
            })

            tabs.click(function(){
                top = tabs.offset().top
                left = tabs.offset().left
                panel.css("top", top + tabs.innerHeight())
                panel.css("left", Math.abs(left - (panel.outerWidth() - $(id).width())/2))
                panel.css("visibility", "visible")
                $(this).addClass('selected')        
                $('div:eq(' + tabs.index(this) + ')', body).slideDown('1500')
            }).mouseover(function(){
                $(this).removeClass('mouseout')
                $(this).addClass('mouseover')
            }).mouseout(function(e){
                tabs.removeClass('mouseover')
                $(this).addClass('mouseout')
                top = $(this).offset().top - $(document).scrollTop()
                left = $(this).offset().left - $(document).scrollLeft()
                if (e.clientX < left || e.clientY < top 
                    || e.clientX > left + $(this).innerWidth() - 10) {
                    $('div:eq(' + tabs.index(this) + ')', body).slideUp('1500')
                    panel.css("visibility", "hidden")
                    $(this).removeClass('selected')
                }
                // alert(e.clientX + ', ' + e.clientY + ' | ' + left + ', ' + top + ' | ' + $(document).scrollTop())
            })

            $('.category li', body).mouseover(function() {
                $(this).children().animate({paddingLeft:"20px"}, {queue:false, duration:300})
            }).mouseout(function() {                
                $(this).children().animate({paddingLeft:"0"}, {queue:false, duration:300})
            })

            $('li', body).click(function(){
                window.location = $(this).find("a").attr("href")
            }).mouseover(function() {
                // $(this).css('backgroundColor','#d8bfd8')
                $(this).addClass("mouseover")
            }).mouseout(function() {
                // $(this).css('backgroundColor','')
                $(this).removeClass("mouseover")
            })
        },

        userBtn: function (menu) {
            $('.yiUserBtn').hide()
            $('.yiQuitBtn').show()
            $('.yiUserMenu').show()
            yi.createTabMenu(".yiUserMenu", ['【' + menu.shift() + '】'], [menu])
            yi.tabMenu(".yiUserMenu")
        },

        userDlg: function () {
            $('.yiUser').show()
            $('.yiUser > div').accordion({header: "h3"})
            $('.yiUser').hide()
            $('.yiUser button').button().click(function (e) {
                // var event = $.event.fix(e)
                // event.type = 'submit'                
                // $('#yiUser form div:visible').parent().trigger(event)
                $('.yiUser form div:visible').parent().submit()
                e.preventDefault()
            })

            $('.yiQuitBtn').button().click(function(e){
                $.getJSON("/app/logout")
                $(this).hide()
                $('.yiUserMenu').html("").hide()
                $('.yiUserMenuPanel').remove()
                $('.yiUserBtn').show()
            })

            $.tools.validator.fn("[minlength]", function(input, value) {
	        var min = input.attr("minlength")
	        
	        return value.length >= min ? true : {
		    en: "Please provide at least " +min+ " character" + (min > 1 ? "s" : ""),
		    fi: "Kentän minimipituus on " +min+ " merkkiä" 
	        }
            })
            $.tools.validator.fn("[data-equals]", "Value not equal with the $1 field", function(input) {
	        var name = input.attr("data-equals"),
	        field = this.getInputs().filter("[name=" + name + "]")
	        return input.val() == field.val() ? true : [name]
            })

            $('#yiUser form').validator().bind("onBeforeValidate", function (e, els) {
                // els.filter('[name="username"], [name="email"]').each(function(i, e){
                //     form.data("validator").reset($(e))
		//     $.getJSON("/app/query?" + form.serialize(), function(r) {
		// 	if (! r.email || ! r.username) {
                //             var err = {}
                //             if (e.name == "username") {err.username = "用户名已被注册"}
                //             if (e.name == "email") {err.email = "邮件地址已被注册"}
                //             form.data("validator").invalidate(err)
                //         }
		//     })
                // })             
                if (els.parent().attr("id") == 'yiRegister') { 
                    var form = $(this)
                    els.filter('[name="username"], [name="email"]').each( function(i, each) {
                        form.data("validator").reset($(each))
		        $.getJSON("/app/query?" + form.serialize(), function(r) {
			    if (! r.email || ! r.username) {
                                var err = {}
                                var valid = form.data("validator")
                                if (!r.username && each.name == "username") {err.username = "用户名已被注册"}
                                if (!r.email && each.name == "email") {err.email = "邮件地址已被注册"}
                                valid.invalidate(err)
                                $(each).bind("keyup", function(e) {valid.checkValidity($(each), e)})
                            }
		        })
                    })
                }
            }).bind("onFail", function(e, errors) {
                if (e.originalEvent == undefined || e.originalEvent.type == 'submit')
	            $.each(errors, function() {
		        var input = this.input
		        input.css({borderColor: 'red'}).focus(function() {
		            input.css({borderColor: '#444'})
		        })
                    })
            }).bind("onSuccess", function (e, els) {
                if (e.originalEvent == undefined || e.originalEvent.type == 'submit') {
                    var div = $('#yiUser form div:visible')
                    var form = $(this)
                    
                    if (div.attr('id') == "yiRegister") {                        
		        $.getJSON("/app/query?" + form.serialize(), function(r) {
			    if (r.email && r.username) {
                                $.post("/app/register"
                                       , form.serialize()
                                       , function(data) {
                                           data.length && $.yiApp.userBtn(data)
                                       }
                                       , "json")
                                $('#yiUserBtn').overlay().close()                                
			    } else { // server-side validation failed. use invalidate() to show errors
                                var err = {}
                                if (! r.username) {err.username = "用户名已被注册"}
                                if (! r.email) {err.email = "邮件地址已被注册"}
                                form.data("validator").invalidate(err)
                            }
		        })
                    } else {
                        $.post("/app/login"
                               , form.serialize()
                               , function(data) {
                                   data.length && $.yiApp.userBtn(data)
                               }
                               , "json")
                        $('#yiUserBtn').overlay().close()
                    }
                } 

                e.preventDefault()
            })

            $('[name="username"], [name="email"]', $('#yiRegister')).change(function(e) {
                var f = $('#yiRegister').parent()
                var my = $(this)
                f.data("validator").reset(my)                
	        $.getJSON("/app/query?" + f.serialize(), function(r) {
                    if (! r.username || ! r.email ) {
                        var err = {}                        
                        if (! r.username) {err.username = "用户名已被注册"}
                        if (! r.email) {err.email = "邮件地址已被注册"}
                        f.data("validator").invalidate(err)
                    }
	        })
            })

            $('#yiUser a').not('.close').click(function() {
                $('#yiUser form').trigger('reset')
                $('#yiUser form input').css('borderColor', '')
            })
            $('#yiUserBtn').attr("rel", "#yiUser").button().overlay({
	        effect: 'apple',
	        mask: '#555',
                onBeforeClose: function () {
                    $('#yiUser form').trigger('reset')
                    $('#yiUser form input').css('borderColor', '')
                }
	    })
        },

        loadPage: function (path, dest) {
	    var directory = path.match(/([^\/]+)\/[^\/\.]+\.html$/)[1];
	    $.get(path, function(data) {
		data = data.replace(/<script.*>.*<\/script>/ig,"");
		data = data.replace(/<\/?link.*>/ig,"");
		data = data.replace(/<\/?html.*>/ig,""); 
		data = data.replace(/<\/?body.*>/ig,""); 
		data = data.replace(/<\/?head.*>/ig,""); 
		data = data.replace(/.*<\/?!doctype.*>/ig,"");
		data = data.replace(/<title.*>.*<\/title>/ig,"");
		data = data.replace(/((href|src)=["'])(?!(http|#))/ig, "$1" + directory + "/");
                $(dest).html(data);
	    });
	},
        
        bgCSS: function(elem, img) {
            $(elem).css({
                'background': 'url(' + img + ') no-repeat #1a1a1a',
                'background-size': '100% 100%',
                'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + img + "',sizingMethod='scale')",
                '-ms-filter': '"progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + img + '\',sizingMethod=\'scale\')"'
            });
        }
    }

    $(function(){
        var yi = $.yiApp;
        var title = '云易网络科技';
        $(document).attr('title', title);
        $('.yiTitle').text(title);
        yi.primaryNav(['公司简介', 'yiAbout',
                        '产品服务', 'yiBusiness',
                        '企业展示', 'yiHuoli',
                        '天下英才', 'yiPin'], title);
        $('.yiNavList li:first').click();

        yi.userBtn(["a", "b"]);

        var yiPanelNav = [
            {title: '一、买卖单赎楼服务',
             img: 'image/business/gustavohouse.jpg',
             list: ["卖方担保赎楼", "买方担保赎楼", "现金赎楼"],
             desc: ["business/b1-1.html", "business/b1-2.html", "business/b1-3.html"]},
            {title: '二、同名转加按赎楼服务',
             img: 'image/business/alexanderplatz-station.jpg',
             list: ["同名转加按担保赎楼服务", "同名转加按现金赎楼服务", "现金赎楼消费贷款"],
             desc: ["business/b2-1.html","business/b2-2.html","business/b2-3.html"]},
            {title: '三、拍卖房赎楼服务',
             img: 'image/business/1.jpg',
             list: ["拍卖房担保赎楼服务", "拍卖房现金赎楼服务"],
             desc: ["business/b3-1.html", "business/b3-2.html"]},
            {title: '四、按揭贷款服务',
             img: 'image/business/2.jpg',
             list: ["红本房抵押快速放款 ", "按揭服务代理 ", "起诉房、逾期房减损协助 ",
                    "自助成交咨询代办服务 ", "多人共有产权转移过户服务 ", "财产分割服务代理 ",
                    "短期过渡资金咨询办理服务 "],
             desc: ["business/b4-1.html","business/b4-2.html","","business/b4-4.html",
                    "business/b4-5.html"]}
        ];

        yi.panelNav(yiPanelNav);

        $('#yiService').accordion({heightStyle: "content"});

        $.get("jingyan.txt", function(data){
            yi.jingyan = data.split('\n');
            yi.jingyanShow(0);
        });

        yi.newsCtrl();
        $.get('news.txt', function(data){
            yi.news = data.split('\n');
	    // yi.news = [ "xyqy-01.jpg	首笔对公业务合同签约仪式"
	    // 		 , "dgqy-01.jpg	建行对公合作签约仪式"
	    // 		 , "xyqy-09.jpg	首笔对公业务合同签约仪式 - 花絮"
	    // 		 , "dgqy-03.jpg	建行对公合作签约仪式 - 花絮"
	    // 		 , "xyqy-05.jpg	首笔对公业务合同签约仪式 - 花絮"
	    // 		 , "dgqy-05.jpg	建行对公合作签约仪式 - 花絮"
	    // 	       ];
            yi.newsShow(0);
            $('.yiNewsCtrl').effect('shake', {}, 500, function(){
                $(this).fadeOut('slow');
            });
        });

        $('#yiPin > div:not(:last)').addClass("yiDesc description");
        $('#yiPin div.right > ul').tabs(
            "#yiPin .yiDesc", 
            {effect: 'fade', event: 'mouseover'});

        yi.bgCSS('.yiDesc', 'image/overlay/gray.jpg');

        $.get('demos.txt', function(data){
            var demos = data.split('\n');
            for (var i=0; i<$('#yiHuoli ul.yiVNav li').length; i++) {
                var p = $('<div class="yiVPanel">' +
                          '<div class="navi"></div>' +
                          '<div class="scrollable"><div class="items"></div></div>' +
                          '</div>');
                var items = demos[i].split('\t');
                for (var j=0; j<3; j++) {
                    // $('.navi', p).append('<a href="#">' + j + '</a>');
                    $('.items', p).append(
                        '<div class="item">' +
                            '<img src="image/' +  
                            (items[j] != undefined ? items[j] : '') + '" />' +
                            '</div>');
                }
                $('#yiHuoliPages > div').append(p);
            }

            $('#yiHuoliPages').scrollable({
                item: '.yiVPanel',
	        vertical: true,
                keyboard: 'static',
	        onSeek: function(event, i) {
	            horizontal.eq(i).data("scrollable").focus();
	        }
            }).navigator('#yiHuoli ul.yiVNav');

            var horizontal = $('.scrollable').scrollable({circular: true, item: '.item'}).navigator(".navi");
            horizontal.eq(0).data("scrollable").focus();
        });

	if ($('#yiNews')) {
            window.setInterval(function() {
		if (yi.isDemo() && $('#yiNews :visible').length > 0)
                    yi.newsShow(yi.newsCur + 1);
            }, 3000);
	    
            window.setInterval(function() {
		if (yi.isDemo()) yi.jingyanShow(yi.jingyanCur + 1);
            }, 10000);
	}
    })
        
})(jQuery)
