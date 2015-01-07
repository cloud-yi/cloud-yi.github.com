/**
 * @license 
 * yinet @VERSION - base client library.
 * 
 * NO COPYRIGHTS OR LICENSES. DO WHAT YOU LIKE.
 * 
 * 始于: 2010 年 七 月
 * Date: @DATE 
 */

(function($){          
    $.yiApp = $.yiApp || { 
        version: "@VERSION",

        topNav: function (m, t) {
	    if (!this.istype(m, Array)) return;

            var ul = $('<ul class="yiTopNav"></ul>')
            for (var i=0; i < m.length; i++)
		ul.append($('<li>').append($('<a>').text(m[i]).click(function(){
		    window.open('http://yanshi.cloud-yi.com:8069/login?user=admin&passwd=admin', '_blank')
		})));
                // ul.append('<li><a target="_blank" href="' + t[i] + '">' + m[i] + '</a>')
	    
            $(".yiTopNav").append(ul)            
        },

        secondNav: function (m) {
	    if (!this.istype(m, Array)) return;

            for (var i=1; i < m.length; i++) {
                var id = "businessTab" + (i-1)
                var div = $('<div id="' + id + '" class="yiBoard"><ul></ul></div>')        
                var ul = $('ul', div)
                for (j=0; j < m[i].length; j++) {                   
                    tid = id + '-' + j
                    ul.append('<li><a href="#' + tid + '">' + m[i][j] + '</a></li>')
                    div.append('<div id=' + tid + '></div>')
                }
                ul.append('<li style="float: right;" class="yiTabTitle">' + m[0][i-1] + '</i>')
                $('#yiContent').append(div)
            }
        }, 

        panelNav: function(pid, m) {
	    if ($(pid).length == 0 || !this.istype(m, Array)) return;	    

	    $(pid).append(
		$('<div></div>').attr('id', 'yiPanelDesc').attr('class', 'yiPanelDesc'),
		'<br clear="all"/>',
		$('<div><ul></ul></div>').attr('id', 'yiPanelNav').attr('class', 'yiPanelNav'), 
		'<br clear="all"/>');

            var nav = $('#yiPanelNav');
	    var desc = $('#yiPanelDesc');

            for (i=0; i<m.length; i++) {
                var id = "yiPanelDesc" + i;
                var div = $('<div><h3></h3><ul></ul></div>').attr('id', id);
                var ul = $('ul', div);

                $('h3', div).text(m[i]['title']);

                for (j=0; j<m[i]['list'].length; j++) {
                    ul.append('<li class="yiPanelDescLi">' + m[i]['list'][j] + '</li>');
                    div.append($('<div></div>').attr({
                        'class': 'yiDesc description',
                        'rel': m[i]['desc'].length > j ? m[i]['desc'][j] : ""
                    }));
                }
                
		desc.append(div);

                ul.tabs('#'+id+' > div.description', {
                    effect: 'fade',
                    fadeOutSpeed: 400,
                    onBeforeClick: function(e, i){             
                        var p = this.getPanes()[i];
                        var rel = p.getAttribute('rel');
                        if (rel && !p.innerHTML)
                            $.yiApp.loadPage(rel, p);
                    },
                    event: 'mouseover'
                });

                $('ul', nav).append('<li><img src="' + m[i]['img'] + '"/><strong>' 
				    + m[i]['title'] + '</strong></li>');
            }

	    // $(id).append(desc).append('<br clear="all"/>')
	    // 	.append(nav).append('<br clear="all"/>');	    
            $('ul', nav).tabs("#yiPanelDesc > div", {
                effect: 'fade',
                fadeOutSpeed: 400
            });
        },

        maxim: null,
        maximCur: 0,
	maximCtrl: function(data) {
	    if (!this.istype(data, Array)) reutrn;

	    this.maxim = data

	    $(".yiMaxim")
		.append('<div><strong></strong></div>')
		.append('<div class="yiMaximSign"></div>')
		.show()
	    this.maximShow(this.maximCur);

	    window.setInterval(function() {
		if ($.yiApp.isDemo()) $.yiApp.maximShow($.yiApp.maximCur + 1);
	    }, 10000);
	},
        maximShow: function(cur) {
            var maxim = $(".yiMaxim div.ui-widget-content");
            
            if (cur >= this.maxim.length) cur = 0;
            this.maximCur = cur;

            if (this.maxim.length == 0 || this.maxim[cur] == "") return;

            $('.yiMaxim strong').text("");
	    maxim.animate({
	        backgroundColor: "#aa0000",
	        color: "#fff"
	    }, 1000);
	    maxim.animate({
	        backgroundColor: "#fff",
	        color: "#000"
	    }, 1000);

            var jy = this.maxim[cur].split("--");
            $('.yiMaxim strong').text(jy[0]);
            $('.yiMaximSign').text("--    " + jy[1]);
        },

        demos: null,
        news: [],
        newsCur: -1,
        newsOffset: 0,

        isDemo: function () {
            return $('.yiNewsCtrl:visible').length == 0 && $('.yiNewsPanel :visible').length == 0;
        },

        newsShow: function (cur) {
            if (this.news.length == 0 || this.newsCur == cur) return;

            if (cur > 4 || cur < 0) cur = 0;

            this.newsCur = cur;

            cur = parseInt(cur) + this.newsOffset;

            if (this.news[cur] == "") return;
            
            var news = this.news[cur].split(' ');
	    var img = $('.yiNews img');

            if (this.isDemo())
                $('.yiNewsTitle').show('blind', {}, 600);

            img.attr('src', 'images/' + news[0]);

            $('.yiNewsTitle').text(news[1]);

            $($('.yiNewsCtrl li').removeClass("current")[this.newsCur])
                .addClass("current");
        },

        newsCtrl: function (data) {
	    // var t = typeof(data);

	    // if (t == undefined || ! (data instanceof Array) || data.length == 0) return;

	    if (!this.istype(data, Array) || data.length == 0) return;

	    this.news = data;

            $('.yiNews')
                .mouseenter(function(){
                    $('.yiNewsCtrl').fadeIn('slow');
                })
                .mouseleave(function(){             
                    $('.yiNewsCtrl').fadeOut('slow');
                });

            $('.yiNews img').attr("rel", "#yiNewsPanel").overlay({
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

	    this.newsShow(0)
	    $('.yiNewsCtrl').effect('shake', {}, 500, function(){
		$(this).fadeOut('slow');
	    })

	    window.setInterval(function() {
		if ($.yiApp.isDemo() && $('.yiNews :visible').length > 0)
		    $.yiApp.newsShow($.yiApp.newsCur + 1);
	    }, 3000);
        },

        scrollable: function (img) {
	    if (!this.istype(img, Array)) return;

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
            for (i=0; i<a.length; a++) {
                div.append(
                    $('<div/>')
                        .append($('<h3><a href="#">' + a[i].title + '</a></h3>'))
                        .append($('<div>' + a[i].text + '</div>')))
            }
            $(tid).append(div)

            div.accordion({header: "h3", event: 'mouseover'})
        },

        createTabMenu: function (id, hA, bA) {

	    if ($(id).length == 0 || !this.istype(hA, Array) || !this.istype(bA, Array)) return;

            var ul = $(id), panel = $('<div></div>')

	    ul.addClass("yiUserMenu");

            panel.addClass("yiPanel")
                .append('<div class="yiPanelTop"></div>')
                .append('<div class="yiPanelBody"></div>')
                .append('<div class="yiPanelBottom"></div>')
                .attr("id", id.match('[^#.].*') + "Panel")

            for (i=0; i<hA.length; i++) {
                var div = $('<div><ul></ul></div>'), ulDiv = $('ul', div)
                for (j=0; j<bA[i].length; j++)
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
                var top = $(this).offset().top
                var left = $(this).offset().left

                panel.css({"top": top + $(this).innerHeight(),
			   "left": Math.abs(left - (panel.outerWidth() - $(id).width())/2),
			   "visibility": "visible"})
                $(this).addClass('selected')        
                $('div:eq(' + $(this).index(this) + ')', body).slideDown('1500')
            }).mouseover(function(){
                $(this).removeClass('mouseout')
                $(this).addClass('mouseover')
            }).mouseout(function(e){
                $(this).removeClass('mouseover')
                $(this).addClass('mouseout')
                var top = $(this).offset().top - $(document).scrollTop()
                var left = $(this).offset().left - $(document).scrollLeft()
                if (e.clientX < left || e.clientY < top 
                    || e.clientX > left + $(this).innerWidth() - 10) {
                    $('div:eq(' + tabs.index(this) + ')', body).slideUp('1500')
                    panel.css("visibility", "hidden")
                    $(this).removeClass('selected')
                }
                // alert(e.clientX + ', ' + e.clientY + ' | ' + left + ', ' + top + ' | ' + $(document).scrollTop())
            })

            $('#category li', body).mouseover(function() {
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
	    if (!this.istype(menu, Array)) return;

            $('.yiUserBtn').show()
            $('.yiQuitBtn').hide()

            this.createTabMenu("#yiUserMenu", ['【' + menu.shift() + '】'], [menu])
            this.tabMenu("#yiUserMenu")
	    $("#yiUserMenu").show()
        },

        userDlg: function () {
            $('.yiOverlay').show()
            $('.yiOverlay > div > div').accordion({header: "h3"})
            $('.yiOverlay').hide()

            $('.yiOverlay button').button().click(function (e) {
                // var event = $.event.fix(e)
                // event.type = 'submit'                
                // $('.yiOverlay form div:visible').parent().trigger(event)
                $('.yiOverlay form div:visible').parent().submit()
                e.preventDefault()
            })

            $('.yiQuitBtn').button().click(function(e){
                $.getJSON("/app?mod=logout")
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

            $('.yiOverlay form').validator().bind("onBeforeValidate", function (e, els) {
                // els.filter('[name="username"], [name="email"]').each(function(i, e){
                //     form.data("validator").reset($(e))
		//     $.getJSON("/app?mod=query&" + form.serialize(), function(r) {
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
		        $.getJSON("/app?mod=query&" + form.serialize(), function(r) {
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
				var div = $('.yiOverlay form div:visible')
				var form = $(this)
				
				if (div.attr('id') == "yiRegister") {                        
				    $.getJSON("/app?mod=query&" + form.serialize(), function(r) {
					if (r.email && r.username) {
					    $.post("/app?mod=register"
						   , form.serialize()
						   , function(data) {
						       data.length && $.yiApp.userBtn(data)
						   }
						   , "json")
					    $('.yiUserBtn').overlay().close()                                
					} else { // server-side validation failed. use invalidate() to show errors
					    var err = {}
					    if (! r.username) {err.username = "用户名已被注册"}
					    if (! r.email) {err.email = "邮件地址已被注册"}
					    form.data("validator").invalidate(err)
					}
				    })
				} else {
				    $.post("http://localhost:8069/"
					   , form.serialize()
					   , function(data) {
					       data.length && $.yiApp.userBtn(data)
					   }
					   , "json")
				    $('.yiUserBtn').overlay().close()
				}
			    } 

			    e.preventDefault()
			})

            $('[name="username"], [name="email"]', $('#yiRegister')).change(function(e) {
                var f = $('#yiRegister').parent()
                var my = $(this)
                f.data("validator").reset(my)                
	        $.getJSON("/app?mod=query&" + f.serialize(), function(r) {
                    if (! r.username || ! r.email ) {
                        var err = {}                        
                        if (! r.username) {err.username = "用户名已被注册"}
                        if (! r.email) {err.email = "邮件地址已被注册"}
                        f.data("validator").invalidate(err)
                    }
	        })
            })

            $('.yiOverlay a').not('.close').click(function() {
                $('.yiOverlay form').trigger('reset')
                $('.yiOverlay form input').css('borderColor', '')
            })
            $('.yiUserBtn').attr("rel", "#yiUser").button().overlay({
	        effect: 'apple',
	        mask: '#555',
                onBeforeClose: function () {
                    $('.yiOverlay form').trigger('reset')
                    $('.yiOverlay form input').css('borderColor', '')
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
        },

	partnerLinks: function(desc) {	    
	    if (!this.istype(desc, Array)) return;
	    var partner = $(".yiPartnerLinks");
	    var ul = $("<ul></ul>");
	    
	    for (i=0; i<desc.length; i++)
		ul.append('<li><a target="_blank" href="' + desc[i][0] 
			  + '" title="' + desc[i][1]
			  + '"><img src="/images/partner/' + desc[i][2]
			  + '"/></a></li>');

	    partner.append(ul);
	},

	footer: function(company, links) {
	    if (typeof(company) == undefined) company = ""

	    var f = $(".yiFooter");
	    var c = $('<div class="yiCredits"><p><strong></strong></p></div>');
	    var l = $('<div class="yiFooterLinks"><ul></ul></div>');

	    $("strong", c).append("版权所有 © 2012").after(company);
	    f.append(c);
	    
	    if (!this.istype(links, Array)) return;

	    for (i=0; i<links.length; i++)
		$("ul", l).append('<li><a target="_blank" href="'
				  + links[i][0]  + '">'
				  + links[i][1]  + '</a></li>');

	    f.append(l);
	},

	istype: function(v, t) {
	    var _t = typeof(v);
	    return _t == t || (_t == 'object' && typeof(t) == 'function' && v instanceof t);
	},

	debug: function() {
	    $.ajax({
		url: document.baseURI + "?debug=1",
		data: null,
		type: 'GET',
		crossDomain: true,
		dataType: 'html',
		success: function() { alert("Success"); },
		error: function() { alert('Failed!'); },
		beforeSend: function() {},
	    });
	}
    }

    $.getJSON("/params.json", function(o){

        if (typeof(o) != 'object') return;
	
	var yi = $.yiApp
	
	if (typeof(o.title) == 'string')
            $(document).attr("title", o.title)

        // yi.scrollable(o.scroll);

        yi.topNav(o.topnav[0], o.topnav[1])
        // yi.secondNav(o.nav)

        // yi.userBtn(o.usermenu)
        // {user: o.usermenu.shift(), // document.cookie.match('.*=([^;]*)')[1]
        //  menu: o.usermenu})

	yi.newsCtrl(o.news) 

	yi.maximCtrl(o.maxim)		

	yi.partnerLinks(o.partner)

	yi.footer(o.company, o.footlinks)
	
	// yi.userDlg()
	
	yi.panelNav("#yiBusiness", o.business);

	// yi.accordion('#businessTab0-0', 
        //              [{title: "一：", text: "云易科技"}
        //               ,{title: "二：", text: "云易科技"}
        //               ,{title: "三：", text: "云易科技"}])
	// yi.accordion('#businessTab0-1', 
        //              [{title: "一：", text: "云易科技"}
        //               ,{title: "二：", text: "云易科技"}
        //               ,{title: "三：", text: "云易科技"}])

	// $('.yiScrollable').scrollable()

	// $('.yiBoard').hide()
	
	// $.getJSON("/app?mod=debug", function(o){$("#yiDebug").show().html(o)})   	
    })   

})(jQuery)
