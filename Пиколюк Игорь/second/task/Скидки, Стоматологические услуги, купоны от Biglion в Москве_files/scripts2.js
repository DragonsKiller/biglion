if(!Array.indexOf){
    Array.prototype.indexOf = function(obj){
        for(var i=0; i<this.length; i++){
            if(this[i]==obj){
                return i;
            }
        }
        return -1;
    }
}

var service_charge_enabled, service_charge;

// Получить GET-параметры в виде объекта {param: value, ...}
var getQueryParams = function() {
    var r = {};
    var q = location.search.substr(1);
    var qPairs = q.split('&');
    for (var i = 0, len = qPairs.length; i < len; i++) {
        var qParams = qPairs[i].split('=');
        r[decodeURIComponent(qParams[0])] = decodeURIComponent(qParams[1]);
    }
    return r;
};

var bulkypickup = 0;

// PLUGINS ----------------------------------------------------------------------------------------------------------------
(function($){

    // TOGGLE INPUT - заменяет описание в input
    // Для инициализации: $('input').toggleInput()
    // По дефолту цвет вписываемого цвета #000, если необходимо сменить цвет используйте $('input').toggleInput({color:'#цвет'})
    $.fn.toggleInput = function(options){
        var settings = $.extend({
                                    color: '#000',
                                    password: false,
                                    onFocus: null,
                                    onBlur: null,
                                    onInit: null,
                                    onChange: null
                                }, options);

        this.each(function(){
            var
                s = $(this),
                preVal = s.val(),
                color = s.css('color');

            if( typeof settings.onInit == 'function' ) settings.onInit(s);

            s.bind('focus', function(){
                if( typeof settings.onFocus == 'function' ) settings.onFocus(s);
                if(s.val() == preVal){
                    s.val('').css('color', settings.color ? settings.color : color);
                    if( settings.password ){
                        var passInput = s.clone(true);
                        passInput.attr('type','password');
                        s.replaceWith(passInput);
                        s = passInput;
                        s.focus();
                    }
                }
            });

            s.bind('blur', function(){
                if( typeof settings.onBlur == 'function' ) settings.onBlur(s);
                if(s.val() == ''){
                    s.css('color', color);
                    if( settings.password ){
                        var passInput = s.clone(true);
                        passInput.attr('type','text');
                        s.replaceWith(passInput);
                        s = passInput;
                    }
                }
                s.val( s.val() == '' ? preVal : s.val() );
            });

            if( typeof settings.onChange == 'function' )
                s.bind('change, keyup', function(){
                    settings.onChange(s);
                });

        });
    };


    // всплывающие подсказки
    $.fn.hint = function(options){
        var settings = $.extend({
                                    speed: 180,
                                    margin: 10
                                }, options);

        this.each(function(){
            var
                s = $(this),
                sH = $('div.sHint', s),
                sTop = parseInt(sH.css('top')),
                nTop = sTop + settings.margin;

            sH.css('top', nTop);
            s.bind({
                       mouseenter: function(){
                           sH.show().stop(true, true).animate({top: sTop, opacity: 1}, settings.speed);
                       },
                       mouseleave: function(){
                           sH.hide().stop(true, true).animate({top: nTop, opacity: 0}, settings.speed);
                       }
                   });

        });
    };



    $.fn.piuAnimate = function(options){
        var $piu = $('<div class="piu"></div>');
        var o = $.extend({
                             item: null,
                             speed: 600,
                             easing: 'backout'
                         }, options);

        if( o.item != null )
            this.each(function(){
                var
                    s = $(this),
                    piu = $piu.clone(),
                    el = $(o.item, s),
                    el0 = el.filter(function(){ return $(this).hasClass('active') });

                s.append(piu);

                if( el0.length != 0 )
                    piu.css({width: el0[0].offsetWidth, left: el0[0].offsetLeft});

                s.bind({
                           mouseleave: function(){
                               el0.length != 0 ? movePiu( el0[0] ) : movePiu( null );
                           }
                       });
                el.hover(function() {
                    movePiu(this);
                });
                function movePiu(el) {
                    piu.dequeue().animate({
                                              width: el != null ? el.offsetWidth : 0,
                                              left: el != null ? el.offsetLeft : 0
                                          }, o.speed, o.easing);
                };
            });

    }


})( jQuery );


//------------------------------------------------------------------------------------------------------------------------
var numeralMonths = {
    1 : 'января',
    2 : 'февраля',
    3 : 'марта',
    4 : 'апреля',
    5 : 'мая',
    6 : 'июня',
    7 : 'июля',
    8 : 'августа',
    9 : 'сентября',
    10 : 'октября',
    11 : 'ноября',
    12 : 'декабря'
};

var onlyNumbers = function(obj){
    if( $(obj).val() != '' ){
        if( (/^\s*\d+\s*$/).test( $(obj).val() ) )
            $(obj).attr('data-value', $(obj).val());
        else
            $(obj).val( $(obj).attr('data-value') );
    }else{
        $(obj).attr('data-value', '');
    }
};

function validateEmail(mail){
    if( (/^[+A-Za-z0-9_\.-]+@[+A-Za-z0-9_\.-]+\.[A-Za-z]{2,}$/).test( mail ) )
        return true;
    else
        return false;
}


Number.prototype.formatMoney = function(c, d, t){
    var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};



function get_param_add_to_totalcost(data) {
    if (data && data.allcount > 0) {
        for (var i in data.cart) {
            if (data.cart[i]['add_to_total_cost'] > 0) {
                return data.cart[i]['add_to_total_cost'];
            }
        }
    }
    return 0;
}


//LAST WORDS - NUMERAL

function numeral($number, $ending1, $ending2, $ending3) {
    //"продукт", "продукта", "продуктов"
    $num100 = $number % 100;
    $num10 = $number % 10;

    if ($num100 >= 5 && $num100 <= 20 || $num10 == 0 || ($num10 >= 5 && $num10 <= 9)) {
        return $ending3;
    }else if ($num10 == 1){
        return $ending1;
    }else{
        return $ending2;
    }
}


//PARSER ULR

function parse_url(url){
    if (url.indexOf('/?') == 0){
        url = url.replace('/?', '');
        url = url.split('&');
        var link = new Object;
        var pair;
        for (pair in url){
            pair=url[pair].split('=');
            link[pair[0]]=pair[1];
        }
        return link;
    } else {
        return false;
    }
};

var gup = function( name ){
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null )
        return "";
    else
        return results[1];
};


//MAIN PAGE -->  TOP BLOCK -->   CART

var goLightbox = function(obj){
    $(obj).lightBox({
                        imageLoading: '//st.biglion.ru/general/v3/img/lightbox/lightbox-ico-loading.gif',
                        imageBtnPrev: '//st.biglion.ru/general/v3/img/lightbox/lightbox-btn-prev.gif',
                        imageBtnNext: '//st.biglion.ru/general/v3/img/lightbox/lightbox-btn-next.gif',
                        imageBtnClose: '//st.biglion.ru/general/v3/img/lightbox/lightbox-btn-close.gif',
                        imageBlank: '//st.biglion.ru/general/v3/img/lightbox/lightbox-blank.gif',
                        txtImage: 'фото',
                        txtOf: 'из'
                    });
}





if (!Object.keys) {
    Object.keys = (function () {
        'use strict';
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
            dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            dontEnumsLength = dontEnums.length;

        return function (obj) {
            if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                throw new TypeError('Object.keys called on non-object');
            }

            var result = [], prop, i;

            for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    result.push(prop);
                }
            }

            if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    }());
}

var makeSelectable = function(item) {
    if ( $('.value_wrp', item).length > 0 ) {
        item.html( $('.value_wrp', item).html() );
    }
};

var makeUnselectable = function(item) {
    if ( $('.value_wrp', item).length == 0 ) {
        var wl, wr, ht, hb;
        wl = Math.floor(item.innerWidth() / 2);
        ht = Math.floor(item.innerHeight() / 2);
        if (item.outerWidth() % 2) { wr = wl + 1 } else { wr = wl }
        if (item.outerHeight() % 2) { hb = ht - 1 } else { hb = ht - 2 }

        item
            .wrapInner('<div class="value_wrp"></div>')
            .prepend('<div class="corner-top"></div><div class="corner-right"></div><div class="corner-bottom"></div><div class="corner-left"></div>');
        $('.corner-top', item).css({ 'border-top' : ht + 'px solid #fff', 'border-right-width' : wr, 'border-left-width' : wl });
        $('.corner-bottom', item).css({ 'border-bottom' : hb + 'px solid #fff', 'border-right-width' : wr, 'border-left-width' : wl });
        $('.corner-right', item).css({ 'border-right' : wr + 'px solid #fff', 'border-top-width' : ht, 'border-bottom-width' : hb });
        $('.corner-left', item).css({ 'border-left' : wl + 'px solid #fff', 'border-top-width' : ht, 'border-bottom-width' : hb });
    }
};


function compare(a,b) {
    return (a.weight - b.weight)
}




//MAIN PAGE --> function to open hidden blocks

function clickToggleBtn(btn, list, arr, bgPosOpened, bgPosClosed, fn, isActive, callback){
    $(btn).on('click', function(){
        if( fn && typeof fn == 'function' ) fn();
        if( !isActive ){
            isActive = 'active';
        }

        if( $(this).hasClass(isActive) ){
            $(this).removeClass(isActive);
            $(arr).css({backgroundPosition: bgPosClosed});
            $(list).stop(true, true).animate({'height': 'toggle'}, 300);
        }else{
            $(this).addClass(isActive);
            $(arr).css({backgroundPosition: bgPosOpened});
            $(list).stop(true, true).animate({'height': 'toggle'}, 300);
        }
        if(callback && typeof callback == 'function') callback();
    });
};

function toggleBtn(btn, list, arr, bgPosOpened, bgPosClosed, fn, isActive, callback, types){
    if( !types ) return false;
    if( types.hover && !('ontouchstart' in document.documentElement) ) {
        $(btn).bind('mouseenter mouseleave', function(e){
            if( fn && typeof fn == 'function' ) fn();
            if( !isActive ){
                isActive = 'active';
            }
            switch(e.type){
                case 'mouseenter':
                    $(this).addClass(isActive);
                    $(arr).css({backgroundPosition: bgPosOpened});
                    $(list).stop(true, true).show();
                    break;
                case 'mouseleave':
                    $(this).removeClass(isActive);
                    $(arr).css({backgroundPosition: bgPosClosed});
                    $(list).stop(true, true).hide();
                    break;
            }
            if(callback && typeof callback == 'function') callback();
        });
    }
    if( types.click || types.touch ) {
        _e = ('ontouchstart' in document.documentElement) ? 'touchstart' : (types.click ? 'click' : null);
        if( !_e ) return false;
        $(btn).bind(_e, function(e){
            if( e.type == 'touchstart' ){
                var touch = e.originalEvent.touches[0] || e.originalEvent.targetTouches[0];
                var _tag = touch.target.tagName.toLowerCase();
                if(
                    _tag == 'a'
                        || _tag == 'input'
                        || _tag == 'li'
                    ) return true;
                else e.preventDefault();
            }
            if( fn && typeof fn == 'function' ) fn();
            if( !isActive ){
                isActive = 'active';
            }

            if( $(this).hasClass(isActive) ){
                $(list).stop(true, true).animate({'height': 'hide'}, 300);
                $(arr).css({backgroundPosition: bgPosClosed});
                $(this).removeClass(isActive);
            }else{
                $(arr).css({backgroundPosition: bgPosOpened});
                $(this).addClass(isActive);
                $(list).stop(true, true).animate({'height': 'show'}, 300);
            }
            if(callback && typeof callback == 'function') callback();
        });
    }
};

function swapChoosed(swapField, btn, list){
    var thisName = $(btn).html();
    $(btn).remove();
    $(list).prepend('<li>'+ $(swapField).html() +'</li>');
    $(swapField).html('').html(thisName);
    $('li', list).sort();
};

function swapChoosednoRemove(swapField, btn, list){
    if ( swapField.parent().is('#hotel-min') || swapField.parent().is('#hotel-max')) {
        var thisName = $(btn).html();
    } else {
        var thisName = $(btn).text();
    }

    if ( $(btn).parent().parent().is('#filter-color') ) {
        $(swapField).addClass('color').attr('style', $(btn).attr('style')).html('');
    } else if ( $(btn).is('.color-all') ) {
        $(swapField).removeClass('color').attr('style', '').html('Выберите цвет');
    } else {
        $(swapField).html('').html(thisName);
        $('li', list).sort();
    }
};


//MEGA SORT!

function Sort(obj, context, field, type, direction){
    if( $(obj).length > 0 ){
        var type = type || 'string';
        for(var i in arguments){
            sortArguments[i] = arguments[i];
        }
        sortArguments[3] = type;
        var direction = direction || sortArguments[4] || 1;


        var parent = $(obj).parent();
        var _obj = $(obj).detach();
        if( $(context, _obj).length > 0 ){
            for(var i=0; i< ($(context, _obj).length - 1); i++ ){
                for(var j=i+1; j< $(context, _obj).length; j++ ){
                    var _i = $(context, _obj).get(i);
                    var _j = $(context, _obj).get(j);
                    var flag = false;
                    if(type == 'string') flag = ( $(_j).attr(field).toLowerCase() < $(_i).attr(field).toLowerCase() && $(_j).attr(field).toLowerCase() !== $(_i).attr(field).toLowerCase() );
                    if(type == 'int') flag = ( Number($(_j).attr(field)) < Number($(_i).attr(field)) && Number($(_j).attr(field)) !== Number($(_i).attr(field)));

                    if( (flag && direction === 1) || ( !flag && direction === -1 )){
                        $(_i).before( $(_j) );
                    }
                }
            }
            $(parent).append(_obj);
        }
    }
};


//POPUP WINDOW

$('div#popup_select_btn').on('click', function(){
    if( $(this).hasClass('active') ){
        $(this).removeClass('active');
        $('ul#popup_select').animate({'height': 'hide'}, 200);
    }else{
        $(this).addClass('active');
        $('ul#popup_select').animate({'height': 'show'}, 200);
    }
});

$('ul#popup_select li').on('click', function(){
    var
        thisId = $(this).attr('data-id'),
        thisName = $(this).html();

    $('input#outsideCityId').val(thisId);
    $('div#popup_select_btn div.count_num').html('').html(thisName);
});


//LOAD IMAGES

    var
        DealImage = {
            preloadTimer : null,
            imgLoaderLock : false
        };

    function goCheckPosition() {
        DealImage.imgLoaderLock = true;
        clearTimeout(DealImage.preloadTimer);

        var
            winHeight = parseInt($(window).height()),
            offsetTop = $(window).scrollTop();

        $('div.NEW_CLASS').each(function(){
            var offsetTopCurrent = parseInt( $(this).offset().top);
            if( offsetTopCurrent - offsetTop < winHeight && offsetTopCurrent + 400 > offsetTop ){
                $(this).attr('src', $(this).attr('data-src')).attr('data-src','');
                $(this).removeClass('loaded');
            };
        });
        DealImage.imgLoaderLock = false;
    };

    function startDealImageLoad() {
        clearTimeout(DealImage.preloadTimer);
        if( !DealImage.imgLoaderLock )
            DealImage.preloadTimer = setTimeout(function(){ goCheckPosition() }, 300);
    };




// GET MORE IMAGES IF DISPLAY:NONE;
/*
 function getMoreDeals() {
 if( $('#preFooter').length == 0 ) return false;
 var top = parseInt($('#preFooter').offset().top)
 , offsettop = $(window).scrollTop()
 , winHeight = parseInt($(window).height());
 if( top - offsettop < winHeight)
 $('.currentActionsItem.invisible:lt(6)').removeClass('invisible');
 };
 */

// SORTING SCRIPT

function sortUl(obj){
    var
        menu = $(obj).children('li').get();

    menu.sort(function(a, b) {
        var
            val1 = $(a).text().toUpperCase(),
            val2 = $(b).text().toUpperCase();

        return (val1 < val2) ? -1 : (val1 > val2) ? 1 : 0;
    });

    $.each(menu, function(index, row) {
        $(obj).append(row);
    });
};

/*

 // CHECKBOX ON ALL SITE

 // create block <div send-input="" class="checkboxBlock"></div> and script create new visual checkbox
 function clickCheckBox(obj){
 var
 thisInput = $(obj).attr('send-input');

 if( $(obj).hasClass('active') ){
 $(obj).removeClass('active');
 $('input#'+thisInput).removeAttr('checked');
 console.log($('input#'+thisInput).attr('checked'));
 }else{
 $(obj).addClass('active');
 $('input#'+thisInput).attr('checked', 'checked');
 console.log($('input#'+thisInput).attr('checked'));
 }
 };

 */


// SLIDE SHOW BLOCK

// слайдит блок с position:absolute, bottom:0 - спрятанный за overflow:hidden
function slideShowBlock(obj, slideBlock, bottom){
    $(obj).bind({
                    mouseenter: function(){
                        $(slideBlock, this).stop(true, true).animate({'bottom': 0}, 300);
                    },
                    mouseleave: function(){
                        $(slideBlock, this).stop(true, true).css('bottom', bottom);
                    }
                });
};


// FOR FRIENDS
if (typeof String.prototype.trimLeft !== "function") {
    String.prototype.trimLeft = function() {
        return this.replace(/^\s+/, "");
    };
}
if (typeof String.prototype.trimRight !== "function") {
    String.prototype.trimRight = function() {
        return this.replace(/\s+$/, "");
    };
}
if (typeof Array.prototype.map !== "function") {
    Array.prototype.map = function(callback, thisArg) {
        for (var i=0, n=this.length, a=[]; i<n; i++) {
            if (i in this) a[i] = callback.call(thisArg, this[i]);
        }
        return a;
    };
}
function getCookies() {
    var c = document.cookie, v = 0, cookies = {};
    if (document.cookie.match(/^\s*\$Version=(?:"1"|1);\s*(.*)/)) {
        c = RegExp.$1;
        v = 1;
    }
    if (v === 0) {
        c.split(/[,;]/).map(function(cookie) {
            var parts = cookie.split(/=/, 2),
                name = decodeURIComponent(parts[0].trimLeft()),
                value = parts.length > 1 ? decodeURIComponent(parts[1].trimRight()) : null;
            cookies[name] = value;
        });
    } else {
        c.match(/(?:^|\s+)([!#$%&'*+\-.0-9A-Z^`a-z|~]+)=([!#$%&'*+\-.0-9A-Z^`a-z|~]*|"(?:[\x20-\x7E\x80\xFF]|\\[\x00-\x7F])*")(?=\s*[,;]|$)/g).map(function($0, $1) {
            var name = $0,
                value = $1.charAt(0) === '"'
                    ? $1.substr(1, -1).replace(/\\(.)/g, "$1")
                    : $1;
            cookies[name] = value;
        });
    }
    return cookies;
}
function getCookie(name) {
    return getCookies()[name];
}



$(function(){

    // IF BROWSER IE < 9
    if( $.browser.msie && $.browser.version < 7 ){
        var ieBrowsersBlock = $('\
		<div id="browsers_block_for_ie">\
	        <div class="browsers_block_in">\
	            <p>Для корректного отображения сайта установите новую версию браузера</p>\
	            <a class="first" href="https://www.google.com/chrome?hl=ru">Chrome</a>\
	            <a href="http://www.mozilla.org/ru/firefox/new/">FireFox</a>\
	            <a href="http://ru.opera.com/">Opera</a>\
	            <a href="http://www.apple.com/ru/safari/download/">Safari</a>\
	            <a href="http://windows.microsoft.com/ru-RU/internet-explorer/products/ie/home">InternetExplorer</a>\
	            <div class="clear"></div>\
	            <div id="close_btn">скрыть</div>\
	        </div>\
	    </div>\
	');

        $('body').prepend( ieBrowsersBlock );

        var
            closeBtn = $('div#browsers_block_for_ie div#close_btn'),
            thisBlock = $('div.browsers_block_in');

        $(closeBtn).click(function(){
            if( thisBlock.hasClass('closed') ){
                thisBlock.removeClass('closed');
                closeBtn.html('скрыть');
                $('a', thisBlock).show();
            }else{
                thisBlock.addClass('closed');
                closeBtn.html('показать');
                $('a', thisBlock).hide();
            }
        });
    }

    // SLIDE SHOW BLOCK

    //parallel-main-new.tpl
    slideShowBlock( $('div.main_catalog_block .travel_and_recreation'), 'div.more_info_h', '-221px');

    //parallel-main.tpl



    // CHECKBOX ON ALL SITE

    // создать блок <div send-input="" class="checkboxBlock"></div> и hidden input
    // по дефолту является чекбоксом
    // указать send-input="" для передачи в инпут данных с ID, указанным в send-input
    // указать класс .radio для радио
    // указать data-value="" для передачи данных в инпут (только для радио)

    $('.checkboxBlock').on('click', function(){
        if($(this).hasClass('city')) return false;
        var
            thisInput = $(this).attr('send-input');

        if( $(this).hasClass('radio') ){
            var
                thisFamily = $(this).attr('data-family'),
                thisValue = $(this).attr('data-value');

            if( !$(this).hasClass('active') ){
                $('.checkboxBlock[data-family='+ thisFamily +'].active').removeClass('active');
                $(this).addClass('active');
                $('input#'+thisInput).val(thisValue).change();
            }
        }else{
            if( $(this).hasClass('active') ){
                $(this).removeClass('active');
                $('input#'+thisInput).removeAttr('checked');
                $('input#'+thisInput).val(0).change();
            }else{
                $(this).addClass('active');
                $('input#'+thisInput).attr('checked', 'checked');
                $('input#'+thisInput).val(1).change();
            }
        }
    });


    // DROP LIST ON ALL SITE

    // if <li> has class DISABLED drop list wont close after click
    $('div.drop_list_block').click(function(e){
        if( !$(e.target).hasClass('disabled') ){
            if( $(this).hasClass('active') ){
                $(this).removeClass('active');
                $('.arr_black_bot', this).css({backgroundPosition: '0 -16px'});
                $('ul', this).stop(true, true).animate({'height': 'toggle'}, 300);
            }else{
                $('.arr_black_bot', $('div.drop_list_block.active')).css({backgroundPosition: '0 -16px'});
                $('div.drop_list_block.active ul').hide();
                $('div.drop_list_block.active').removeClass('active');


                // use data-height to add height to UL block for overflow:scroll
                if( $(this).attr('data-height') ){
                    $('ul', this).show();
                    listHeight = $(this).attr('data-height');
                    $('ul', this).height( listHeight );

                    if( $('ul li', this).length * $('ul li', this).outerHeight(true) > listHeight ){
                        $('ul', this).height( listHeight ).css('overflow-y', 'scroll');
                    }
                    $('ul', this).hide();

                }else{
                    if( $('li', this).length > 20 ){
                        $('ul', this).show();
                        listHeight = 20 * parseInt($('li', this).outerHeight(true));
                        $('ul', this).height( listHeight ).css('overflow-y', 'scroll').hide();
                    }
                }

                $(this).addClass('active');
                $('.arr_black_bot', this).css({backgroundPosition: '0 1px'});
                $('ul', this).stop(true, true).animate({'height': 'toggle'}, 300);
            }
        }
    });

    // IF <li> has class DISABLED drop list wont close after click
    $('div.drop_list_block li:not(.disabled)').on('click' ,function(){
        var sendInputId = $(this).parents('div.drop_list_block').eq(0).attr('send-input');
        if( $(this).attr('data-value') !== undefined )
            newVal = $(this).attr('data-value');
        else
            newVal = $(this).html();

        swapChoosednoRemove( $('div.visible_value', $(this).parent().parent()), $(this), $(this).parent() );
        if( sendInputId !== undefined && sendInputId != '' )
            $('input#'+ sendInputId).val( newVal ).change();
    });


    //LOADER IMAGES ON MAIN PAGE

        $(window).bind('mousewheel scroll', function(){
            //getMoreDeals();
            startDealImageLoad();
        });
        //getMoreDeals();
        startDealImageLoad();






    //MAIN PAGE -->  TOP BLOCK -->   BUY BY CATEGORIES BTN

    /*
     toggleBtn(
     'div#buy_by_cats',
     'div.buy_by_cats',
     'div.arr_white_bot',
     '-18px 0px',
     '-18px -19px',
     null,
     null,
     null,
     {touch:true, hover:true}
     );
     */

    if( $('div#top_main_category_visible').length != 0 ){
        $('div#buy_by_cats').unbind();
        $('div#buy_by_cats').addClass('active');
        $('div#buy_by_cats div.arr_white_bot').css({backgroundPosition: '-18px 0px'});
        $('div#buy_by_cats div.buy_by_cats').show();
    }


    //OPEN SUBMENU

    $('div.buy_by_cats ').bind({
                                   mouseleave:function(){
                                       $('ul.buy_by_cats_ul:visible').hide();
                                       $('div.buy_by_cats_left li#active div.arr_orange_right').remove();
                                       $('div.buy_by_cats_left li#active').removeAttr('id');
                                   }
                               });

    $('div.buy_by_cats_left li').bind({
                                          mouseenter:function(){
                                              var thisCatId = $(this).attr('data-cat');

                                              if( $('ul.buy_by_cats_ul[data-cat="'+ thisCatId +'"] li').length == 0 ) {
                                                  $('ul.buy_by_cats_ul[data-cat]').hide();
                                                  $('div.buy_by_cats_left li#active div.arr_orange_right').remove();
                                                  $('div.buy_by_cats_left li#active').removeAttr('id');
                                                  return false;
                                              }

                                              if( $('ul.buy_by_cats_ul:visible').length == 0 ){
                                                  $('div.buy_by_cats_left li#active').removeAttr('id');
                                                  $('div.buy_by_cats_right').height( $('div.buy_by_cats_left').height() );
                                                  if( $(this).attr('data-cat') ){
                                                      $(this).attr('id', 'active');
                                                      $(this).append('<div class="arr_orange_right"></div>');
                                                  };
                                                  $('ul.buy_by_cats_ul[data-cat="'+ thisCatId +'"]').stop(true, true).animate({'width': 'show'}, 300);
                                              }else{
                                                  if( $(this).attr('id') != 'active' && $(this).attr('data-cat') ){

                                                      $('div.buy_by_cats_left li#active div.arr_orange_right').remove();
                                                      $('div.buy_by_cats_left li#active').removeAttr('id');

                                                      $(this).attr('id', 'active');
                                                      if( $(this).attr('data-cat') ){
                                                          $(this).append('<div class="arr_orange_right"></div>');
                                                      }
                                                      $('ul.buy_by_cats_ul:visible').addClass('hide');
                                                      $('ul.buy_by_cats_ul[data-cat="'+ thisCatId +'"]').show();
                                                      $('ul.buy_by_cats_ul.hide').hide().removeClass('hide');

                                                  }else{

                                                      $('div.buy_by_cats_left li#active div.arr_orange_right').remove();
                                                      $('div.buy_by_cats_left li#active').removeAttr('id');

                                                      $('ul.buy_by_cats_ul').hide().removeClass('hide');
                                                      if( $(this).attr('data-cat') ){
                                                          $(this).attr('id', 'active');
                                                      }
                                                  }
                                              };
                                          }
                                      });


    //MAIN PAGE -->  TOP BLOCK -->   OPEN ALL SEARCH CATEGORIES

    $('div#main_search_cats li').on('click', function(e){
        var
            selfBtn = $('div#choose_cats span'),
            thisName = $(e.target).html(),
            prevTxt = $(selfBtn).attr('data-text'),
            thisId = $(this).attr('data-id');

        $('#search_category_id').val(thisId);
        $(e.target).remove();

        if( prevTxt ){
            $('div#main_search_cats ul').prepend('<li data-text="vse">Везде</li>');
            $(selfBtn).removeAttr('data-text');
        }else{
            $('div#main_search_cats li:last').before('<li>'+ $(selfBtn).html() +'</li>');
        }

        if( $(e.target).attr('data-text') )
            $(selfBtn).attr('data-text', 'vse');

        $(selfBtn).html('').html(thisName);
        var thisWidth = $(selfBtn).outerWidth();
        $('div#choose_cats').next().width(304 - thisWidth);	             // Input.width - ( Btn_New.width - Btn_Old.width )
        $('div#choose_cats').click();

        $('div#main_search_cats').hide();
        $('div#choose_cats.active div.arr_black_bot').css({backgroundPosition: '0px -16px'});
        $('div#choose_cats.active').removeClass('active');
    });

    toggleBtn(
        'div#choose_cats',
        'div#main_search_cats',
        'div#choose_cats div.arr_black_bot',
        '-18px 0px',
        '0px -16px',
        null,
        null,
        null,
        {touch:true, hover:true}
    );

    //SEARCH FORM SUBMIT

    $('div.search_btn').on('click', function(){
        //	    if( $('form#search_form input[type="text"]').val() == 'biglion пираты' ){
        //	        $('div#header a.main_logo_top').before('<a href="/" class="main_logo_top_pirate"></a>');
        //		    $('div#header a.main_logo_top').animate({top: -50},400, function(){ $(this).remove() });
        //	    }else{
        if($('form#search_form input[type="text"]').val()!='Что Вы ищете?' && $('form#search_form input[type="text"]').val()!='')
            $('form#search_form').submit();
        //	    }
    });



    //MAIN PAGE -->  TOP BLOCK -->   OPEN CART

    toggleBtn(
        'div#cart_btn',
        'div#cart_menu',
        'div#cart_btn>div.arr_black_bot',
        '-18px 0px',
        '0px -16px',
        null,
        'grey_black_mat',
        null,
        {touch:true, hover:true}
    );


    //MAIN PAGE -->   MAIN BANNER

    var ecForBanners = function() {
        var currentBanner = $('.top_banner_item.active_banner:not(.shown)');
        if(currentBanner.length > 0){
            dataLayer.push({
                'event': 'promotionShow',
                'ecommerce': {
                    'promoView': {
                        'promotions': [
                            {
                                'id': currentBanner.data('promo'),
                                'name': currentBanner.data('promo'),
                                'creative': currentBanner.width() + 'x' + currentBanner.height(),
                                'position': currentBanner.data('slot')

                            }]
                    }
                }
            });
            currentBanner.addClass('shown');
        }

    };



    var intervalId,
        $banBlock = $('div.main_banner_block'),
        $banPagi = $('#banner_pagi'),
        $banPagiItem = $('div', $banPagi);

    if( $banBlock.length > 0 ){

        $('.top_banner_item').eq(0).addClass('active_banner');
        ecForBanners();
        $('>a', $banBlock).css({'position': 'absolute', 'z-index': 10, 'opacity': 0});
        $('>a:eq(0)', $banBlock).css({'position': 'absolute', 'z-index': 15, 'opacity': 1});

        function goInterval(){
            intervalId = setTimeout( function() { goSlideBanner(); } , 4500);
        }

        var goSlideBanner = function(){
            if ($('div#active', $banPagi).next().length == 0) {
                $('div:eq(0)', $banPagi).click();
            }else{
                $('div#active', $banPagi).next().click();
            };
        };

        var
            bannerCountPagi = $banPagiItem.length,
            pagiWidth = (+bannerCountPagi * parseInt($banPagiItem.outerWidth(true))) / 2;

        $banPagi.css('margin-left', -pagiWidth);

       $('.top_banner_item').on('click', function(e) {
           var $self = $(this);
           e.preventDefault();
           dataLayer.push({
               'event': 'promotionClick',
               'ecommerce': {
                   'promoClick': {
                       'promotions': [
                           {
                               'id': $self.data('promo'),
                               'name': $self.data('promo'),
                               'creative': $self.width() + 'x' + $(this).height(),
                               'position': $self.data('slot')
                           }]
                   }
               },
               'eventCallback': function() {
                   document.location = $self.attr('href');
               }
           });
       });

        $banPagiItem.unbind('click').bind('click', function(){
            clearTimeout(intervalId);
            var
                preIndex = $('div#active', $banPagi).index(),
                thisIndex = $(this).index(),
                maskPos = ( bannerCountPagi - 1 - thisIndex ) * 30;

            if( $(this).attr('id') != 'active' ){
                $('div#active', $banPagi).removeAttr('id');
                $(this).attr('id', 'active');
                $('div.main_banner_mask_arr').css({backgroundPosition: '-'+ maskPos +'px 0'});

                $('>a:eq('+ preIndex +')', $banBlock).css({'position': 'absolute', 'z-index': 10}).animate({opacity: 0}, 450).removeClass('active_banner');
                $('>a:eq('+ thisIndex +')', $banBlock).css({'position': 'absolute', 'z-index': 15}).stop(true, true).animate({opacity: 1}, 450, function(){
                    clearTimeout(intervalId);
                    goInterval();
                    ecForBanners();
                }).addClass('active_banner');
            };
        });

        $('>a', $banBlock).bind({
                                    mouseenter: function(){
                                        clearTimeout(intervalId);
                                    },
                                    mouseleave: function(){
                                        goInterval();
                                    }
                                });

        goInterval();
    };

    //MAIN PAGE -->   MAIN CATALOG -->   CHOOSE METRO BTN

    $('div.more_info_top').each(function(){
        $(this).css('bottom', -1 * +$(this).outerHeight()).attr('data-margin', $(this).outerHeight());
    });

    $('div.catalog_container .action_item').bind({
                                                     mouseenter: function(){
                                                         $('div.more_info', this).stop(true, true).animate({'bottom': 0}, 300);
                                                         $('div.more_info_top', this).stop(true, true).animate({'bottom': 0}, 300);
                                                     },
                                                     mouseleave: function(){
                                                         $('div.more_info', this).stop(true, true).css('bottom', '-105px');
                                                         $('div.more_info_top', this).stop(true, true).css('bottom', -1 * +$('div.more_info_top', this).attr('data-margin'));
                                                         $(this).removeClass('active');
                                                         $('span.arr_white_top', this).css({backgroundPosition: '-18px 0px'});
                                                         $('div.more_metro').hide();
                                                     }
                                                 });

    $('div.choosed_metro').on('click', function(){
        if( $(this).hasClass('active') ){
            $(this).removeClass('active');
            $('span.arr_white_top', this).css({backgroundPosition: '-18px 0px'});
            $(this).parent().parent().find('div.more_metro').stop(true, true).animate({'height': 'toggle'}, 300);
        }else{
            $(this).addClass('active');
            $('span.arr_white_top', this).css({backgroundPosition: '-18px -19px'});
            $(this).parent().parent().find('div.more_metro').stop(true, true).animate({'height': 'toggle'}, 300);
        };
        if( $(this).parent().parent().find('div.more_metro ul li').length != 0 )
            return false;
    });

    //INSIDE PAGE -->   TOP FILTER

    $('#catalog_filter_block .filter_list').on('click', function(){
        if( $(this).hasClass('active') ){
            $(this).removeClass('active');
            $('div.arr_black_bot', this).css({backgroundPosition: '0 1px'});
            $('ul' ,this).stop(true, true).animate({'height': 'toggle'}, 300);
        }else{
            $('#catalog_filter_block .filter_list.active ul').css('display', 'none');
            $('#catalog_filter_block .filter_list.active').removeClass('active');
            $(this).addClass('active');
            $('div.arr_black_bot', this).css({backgroundPosition: '0 -16px'});
            $('ul' ,this).stop(true, true).animate({'height': 'toggle'}, 300);
        };
    });

    $('#catalog_filter_block .filter_list li').on('click', function(){
        swapChoosed(  );
    });


    //ITEM INSIDE -->   COUNT BLOCK

    clickToggleBtn(
        'div#count_item_btn',
        'div#count_item_btn ul',
        'div#count_item_btn div.arr_black_bot',
        '0 1px',
        '0 -16px',
        null,
        null,
        null,
        {touch:true, hover:true}
    );

    $('div#count_item_btn li').on('click', function(){
        swapChoosed( $('div#count_item_btn div.count_num'), $(this), $('div#count_item_btn ul') );
        sortUl('div#count_item_btn ul');
    });



    //USER BLOCk --> SUBSCRIPTION

    $('div#city_item_btn').on('click', function(){
        if( $(this).hasClass('active') ){
            $(this).removeClass('active');
            $('div#city_item_btn div.arr_black_bot').css({backgroundPosition: '0 -16px'});
            $('div#city_item_btn ul').stop(true, true).animate({'height': 'toggle'}, 300);
        }else{
            $(this).addClass('active');
            $('div#city_item_btn div.arr_black_bot').css({backgroundPosition: '0 1px'});
            $('div#city_item_btn ul').stop(true, true).animate({'height': 'toggle'}, 300);
        }
    });

    $('div#city_item_btn li').on('click', function(){
        var
            thisName = $(this).html(),
            thisId = $(this).attr('data-city-id');

        $(this).remove();
        if( $('#city_item_btn .city_choosed').attr('data-choose') != 0 ){
            $('div#city_item_btn ul').prepend('<li>'+ $('div#city_item_btn div.city_choosed').html() +'</li>');
        }else{
            $('#city_item_btn .city_choosed').attr('data-choose', 1);
        }
        $('div#city_item_btn div.city_choosed').html('').html(thisName);
        $('div#city_item_btn #town_container').attr('data-city-id', thisId);
        sortUl('div#city_item_btn ul');
    });

    //PAYMENT_FORM ---> PAYMENT INSTRUCTION

    /* PAYMENT FORM EXAMPLES  ----- START */
    $('#exm_list li').on('click', function(){
        $('div.number_field').remove();
        $('div.price_field').remove();

        var
            payment_code = $('div.exm_title b span').html(),
            payment_price = ($('td#full_price').html()).replace(' руб.','');

        if( $(this).attr('id') != 'active') {
            $('#active').removeAttr('id');
            $(this).attr('id', 'active');
            getId = $(this).attr('data-id');
            $('.exm_img_block img').attr('src', "//st.biglion.ru/v3/img/your_purchase/example"+getId+".jpg");
        };


        //$('div.exm_img_block').prepend( $(this).attr('data-id') == 16 ? ('<div class="price_field price_field16">'+ payment_price +'</div>') : ('<div class="number_field number_field'+ ($(this).attr('data-id') == 5 || $(this).attr('data-id') == 8) ? 5 : (($(this).attr('data-id') == 15 || $(this).attr('data-id') == 17) ? 15 : $(this).attr('data-id'))+'">'+ payment_code +'</div>'+ ($(this).attr('data-id') == 5 || $(this).attr('data-id') == 8) ? '<div class="price_field price_field15">'+ payment_price +'</div>' : ''));


        if( $(this).attr('data-id') == 4 || $(this).attr('data-id') == 5 || $(this).attr('data-id') == 7 || $(this).attr('data-id') == 14 || $(this).attr('data-id') == 15 ){
            $('div.exm_img_block').prepend("<div class='number_field number_field"+ $(this).attr('data-id') +"'>"+ payment_code +"</div>");
        };

        if( $(this).attr('data-id') == 6 ){
            $('div.exm_img_block').prepend('<div class="number_field number_field6">'+ payment_price +'</div>');
        };

        if( $(this).attr('data-id') == 17 ){
            $('div.exm_img_block').prepend('<div class="number_field number_field15">'+ payment_code +'</div><div class="price_field price_field15">'+ payment_price +'</div>');
        };

        if( $(this).attr('data-id') == 16 ){
            $('div.exm_img_block').prepend('<div class="price_field price_field16">'+ payment_price +'</div><div class="price_field price_field17"><span>'+ payment_price +'</span></div>');
        };

    });

    /* ODNOKLASSNIKI MODAL WINDOWS */

    $('.modal_link_contacts, .modal_link_support, .modal_link_prices, .modal_link_invite').on('click', function(){
        $('body').append('<div id="modal_overlay" class="modal_overlay"></div>');
        if ($('.modal').is('modal_visible')) {
            $('.modal').removeClass('modal_visible');
            $('#modal_overlay').css('display', 'none');
            $('#modal_overlay').remove();
        } else {
            if ($(this).hasClass('modal_link_contacts')) {
                $('body').append($('#modal_contacts'));
                $('#modal_contacts').addClass('modal_visible');
            } else if ($(this).hasClass('modal_link_support')) {
                $('body').append($('#modal_support'));
                $('#modal_support').addClass('modal_visible');
            } else if ($(this).hasClass('modal_link_prices')) {
                $('body').append($('#modal_prices'));
                $('#modal_prices').addClass('modal_visible');
            } else if ($(this).hasClass('modal_link_invite')) {
                $('body').append($('#modal_invite'));
                $('#modal_invite').addClass('modal_visible');
            }
            $('#modal_overlay').css('display', 'block');
            $('#modal_overlay').css('z-index', '1002');
        }
    });

    $('.modal_close').on('click', function(){
        $('.modal').removeClass('modal_visible');
        $('.modal_overlay').remove();
    });

    $(document).click(function(e){
        if ($(e.target).filter('#modal_overlay').length == 1 && $(e.target).filter('.modal:visible').length != 1) {
            $('.modal').removeClass('modal_visible');
            $('.modal_overlay').remove();
        }
    });


    //MY ORDERS

    $('div.unit_print_coupons div.print_button').on('click', function(e){
        if( $('ul', this).is(':hidden') ){
            $('div.print_button ul').hide();
            $('ul', this).show();
        }else{
            $('ul', this).hide();
        };
    });


    //ALL PAGES --> TOP SUBCANT MENU --> HOVER BTN (CLEAR BORDER)

    $('div.subcat_menu a').bind({
                                    mouseenter: function(){
                                        $(this).parent().next().find('a').css({'border': 0, 'padding-left': '1px'});
                                    },
                                    mouseleave: function(){
                                        $(this).parent().next().find('a').css({'padding-left': 0, 'border-left': '1px solid #b4b4b4'});
                                    }
                                });

});



//TIMER ON PAGE
Timers = {
    timers: [],
    numerals: ['день', 'дня', 'дней'],
    tickTimers: function() {
        if(Timers.timers.length == 0) return;
        for (var i in Timers.timers) if(Timers.timers[i].time > 0) {
            Timers.timers[i].time--;

            var time = Timers.timers[i].time,
                timeS, timeM, timeH, timeD,
                str = '';

            timeS = time % 60;
            timeM = ((time - timeS) / 60) % 60;
            timeH = ((time - timeS - timeM * 60) / 3600) % 24;
            timeD = (time - timeS - timeM * 60 - timeH * 3600) / 86400;

            if(timeD) str += timeD + ' ' + numeral(timeD, Timers.numerals[0], Timers.numerals[1], Timers.numerals[2]) + ' ';
            str += (timeH < 10 ? '0'+timeH.toString() : timeH.toString()) + ':' + (timeM < 10 ? '0'+timeM.toString() : timeM.toString());
            if(!timeD) str +=  ':' + (timeS < 10 ? '0'+timeS.toString() : timeS.toString());

            Timers.timers[i].$node.html(str);
        }
        setTimeout(Timers.tickTimers, 1000);
    },
    init: function() {
        $('.countdown-timer').each(function(){
            var timer = {
                time: parseInt($(this).attr('data-ts')),
                $node: $(this)
            };
            if(isNaN(timer.time)) return;

            Timers.timers.push(timer);
        });
        Timers.tickTimers();
    }
};
$(document).ready(Timers.init);

/**
 *
 * Класс карусели, универсальна при совпадении структуры html.
 * Работает и с UL и с DIV.
 * Анимация - изменение marginLeft блока обертки карусельных элементов options.carouselWrapper
 * Инициализируется один раз для блока карусели и записывается в data элемента options.carouselBlock
 *
 */
function Carousel(){
    var self = this;
    var options = arguments[0] ? arguments[0] : {};
    this.options = {
        carouselBlock: null,        // класс или ID элемента блока карусели
        carouselWrapper: null,      // класс или ID обертки карусельных элементов
        carouselLeftBtn: null,      // класс или ID кнопки "влево"
        carouselRightBtn: null,     // класс или ID кнопки "вправо"
        carouselItem: null,         // класс или ID элемента карусели
        carouselStartItem: 0,       // индекс элемента, с которого начать отображение карусели
        carouselSpeed: 800,         // скорость анимации карусели
        carouselEasing: 'swing',     // эффект анимации карусел
        carouselBeforeScrollEvent: null,
        carouselAfterScrollEvent: null,
        vertical: false
    };
    $.extend(this.options, options);
    if(
        !this.options.carouselBlock
            || !this.options.carouselWrapper
            || !this.options.carouselLeftBtn
            || !this.options.carouselRightBtn
            || !this.options.carouselItem
        ) return false;

    var elements = {};
    elements.block = $(this.options.carouselBlock);
    elements.wrapper = $(this.options.carouselWrapper, elements.block);
    elements.leftBtn = $(this.options.carouselLeftBtn, elements.block);
    elements.rightBtn = $(this.options.carouselRightBtn, elements.block);

    if( $(elements.block).data('Carousel') ) return false;

    var properties = {
        itemIndex: this.options.carouselStartItem
    };

    properties.itemWidth = options.vertical ? $( this.options.carouselItem, elements.wrapper).eq(0).outerHeight( true ) : $( this.options.carouselItem, elements.wrapper).eq(0).outerWidth( true );
    properties.itemsCount = $( this.options.carouselItem, elements.wrapper).length;
    properties.blockWidth = properties.itemWidth * properties.itemsCount;
    properties.itemCountRotate = options.vertical ? Math.floor( $(elements.block).height() / properties.itemWidth ) : Math.floor( $(elements.block).width() / properties.itemWidth );
    properties.wrapperMargin = (-1)*(this.options.carouselStartItem * properties.itemWidth);

    this.rotate = function(inc){
        rotation = false;
        var margin = properties.wrapperMargin - inc * properties.itemCountRotate * properties.itemWidth;
        margin = (-1 * margin < 0 ) ? 0 : ((margin < -1 * properties.blockWidth) ? -1 * properties.blockWidth : margin);

        if( options.carouselBeforeScrollEvent && typeof options.carouselBeforeScrollEvent == 'function' ){
            options.carouselBeforeScrollEvent(properties);
        }

        var props = options.vertical ? {'marginTop': margin} : {'marginLeft': margin};
        $(elements.wrapper).animate(
            props,
            {
                duration: this.options.carouselSpeed
                , easing: this.options.carouselEasing
                , complete: function(){
                properties.itemIndex = properties.itemIndex + inc * properties.itemCountRotate;
                properties.wrapperMargin = margin;
                self.offBtns();
                rotation = true;

                if( options.carouselAfterScrollEvent && typeof options.carouselAfterScrollEvent == 'function' ){
                    options.carouselAfterScrollEvent(properties);
                }
            }
            }
        );
    };

    this.offBtns = function(){
        $(elements.leftBtn ).show();
        $(elements.rightBtn ).show();
        if( properties.itemIndex <= 0 ) $(elements.leftBtn ).hide();
        if( properties.itemIndex + properties.itemCountRotate >= properties.itemsCount ) $(elements.rightBtn ).hide();
    };

    var rotation = true;
    $(elements.leftBtn).click(function(e){
        if( rotation )
            self.rotate(-1);
    });
    $(elements.rightBtn).click(function(e){
        if( rotation )
            self.rotate(1);
    });
    self.offBtns();
    $(elements.wrapper).css({marginLeft: properties.wrapperMargin});

    $(elements.block).data('Carousel', this);
};


// 			Добавлено из common.js нужно переработать

// возвращает cookie если есть или undefined
function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    var str = '';
    if (matches && matches[1]) {
        try {
            str = decodeURIComponent(matches[1]);
        } catch(e) {
            str = unescape(matches[1]);
        }
    }
    return matches ? str : undefined;
};

// уcтанавливает cookie
/*
 props
 Объект с дополнительными свойствами для установки cookie:
 expires
 Время истечения cookie. Интерпретируется по-разному, в зависимости от типа:
 * Если число - количество секунд до истечения.
 * Если объект типа Date - точная дата истечения.
 * Если expires в прошлом, то cookie будет удалено.
 * Если expires отсутствует или равно 0, то cookie будет установлено как сессионное и исчезнет при закрытии браузера.
 path
 Путь для cookie.
 domain
 Домен для cookie.
 secure
 Пересылать cookie только по защищенному соединению.
 */
function setCookie(name, value, props) {
    props = props || {};
    var exp = props.expires;
    if (typeof exp == "number" && exp) {
        var d = new Date();
        d.setTime(d.getTime() + exp*1000);
        exp = props.expires = d;
    };
    if(exp && exp.toUTCString) {
        props.expires = exp.toUTCString()
    };

    value = encodeURIComponent(value);
    var updatedCookie = name + "=" + value;
    for(var propName in props) {
        updatedCookie += "; " + propName;
        var propValue = props[propName];
        if(propValue !== true) {
            updatedCookie += "=" + propValue;
        };
    };
    document.cookie = updatedCookie;
};

// удаляет cookie
function deleteCookie(name) {
    setCookie(name, null, { expires: -1 });
};

//Status bar
function init_status() {
    if (document.body.className != 'coupon-page') {
        /*
         $('#status div.status:not(.status-extend) div.close a').click(function(){
         $('#status, div.status').slideUp(500);
         if($.browser.msie && $.browser.version < 8) {
         $('#header').animate({height: '200px'}, 500);
         }
         if(location.hostname) setCookie('status', 'hide', {expires: 315360000, domain: '.' + location.hostname, path: '/'});
         else setCookie('status', 'hide', {expires: 315360000, path: '/'});
         return(false);
         });
         */

        /*
         $('#status div.status.status-extend div.close a').click(function(){
         $('#status, div.status').slideUp(500);
         if($.browser.msie && $.browser.version < 8) {
         $('#header').animate({height: '200px'}, 500);
         }
         if(location.hostname) setCookie('status_extend', 'hide', {expires: 315360000, domain: '.' + location.hostname, path: '/'});
         else setCookie('status_extend', 'hide', {expires: 315360000, path: '/'});
         return(false);
         });
         */
        if(getCookie('status_extend') != undefined && getCookie('status_extend') != 'hide') {
        }
        else if(getCookie('status') != 'hide') {
            show_status();
        }
    }
};

function show_status(c) {
    /*
     if(c) $('div.status:not(.status-extend) div.status-content').html(c);
     $('#status').slideDown(500);
     $('#status div.status:not(.status-extend)').appendTo('#header').slideDown(500);
     if($.browser.msie && $.browser.version < 8) {
     $('#header').animate({height: '277px'}, 500);
     }
     */
};

function show_status_extend(c) {
    /*
     if(c) $('div.status-extend div.status-content').html(c);
     $('#status').slideDown(500);
     $('#status div.status.status-extend').appendTo('#header').slideDown(500);
     if($.browser.msie && $.browser.version < 9) {
     $('#header').animate({height: '277px'}, 500);
     }
     */
};

//Check domain in blacklist
function check_domain(email) {
    result = $.ajax({
                        type: "POST",
                        url: "/",
                        dataType: "json",
                        async: false,
                        data:"action=check_domain&email="+email
                    }).responseText;
    data = JSON.parse(result);
    return data.success;
}

$(document).ready(function() {
    $('.top_submenu').prev().addClass('top_submenu_link').append('<div></div>');

    $('#hiddenCnt0').on('keyup change', function(e) {
        var val = $(this).val();
        var key = e.which ? e.which : e.keyCode;

        if ( !(key in [ 8, 16, 17, 18, 20, 35, 36, 37, 38, 39, 40, 45, 46 ]) ) {
            if ( isNaN(val) || val == 0) {
                $(this).val(1);
            } else {
                if (val < 0) { $(this).val( -val ) }
            }
        }
    });

    /*$('iframe').each(function(){
        var url = $(this).attr("src");
        var wmode = url.indexOf('?') == -1 ? '?wmode=transparent' : '&wmode=transparent';
        $(this).attr("src",url+wmode);
    });*/

    var item = {
        gallery: {},
        rotateHndl: 0,
        defImg: '',
        current: 0,
        image: {},
        fade: {},
        pics: [],
        init: function(el) {
            var img = new Image;
            var pics = $('.mini-gallery img', el).get();
            this.gallery = $('.mini-gallery', el).get();
            this.image = $('.main', el).get()[0];
            this.fade = $('.fade', el).get()[0];
            this.defImg = this.image.getAttribute('src');

            for (var i = 0, len = pics.length; i < len; i++) {
                if ( $(pics[i]).attr('data-orig') ) {
                    $(pics[i]).attr('src', $(pics[i]).attr('data-orig')).removeAttr('data-orig');
                }
                this.pics.push(pics[i].getAttribute('data-big'));
            }
            for ( var i = 0, len = this.pics.length; i < len; i++) {
                img.src = this.pics[i];
            }
        },
        reset: function() {
            $(item.fade).stop();
            this.image.setAttribute('src', this.defImg);
            item.fade.style.display = 'none';
            this.fade.setAttribute('src', '');
            $('div', this.gallery).removeClass('active').first().addClass('active');
            this.defImg = '';
            this.current = 0;
            this.image = {};
            this.fade = {};
            this.pics = [];
        },
        switchImg: function(fade, id) {
            fade = fade == undefined ? true : fade;
            if(item.fade.tagName != 'IMG' && item.image.tagName != 'IMG') return false;

            if (fade) {
                if (item.current == item.pics.length - 1) { item.current = -1; }
                item.fade.setAttribute('src', item.pics[++item.current]);
                $('div', item.gallery).removeClass('active').eq(item.current).addClass('active');
                $(item.fade).fadeTo(1000, 1, function() {
                    item.image.setAttribute('src', item.pics[item.current]);
                    item.fade.style.display = 'none';
                });
            } else {
                this.current = id;
                $(item.fade).stop();
                this.image.setAttribute('src', this.pics[id]);
                item.fade.style.display = 'none';
                this.fade.setAttribute('src', this.pics[id]);
            }
        },
        rotateStart: function() { setTimeout(function() {item.switchImg(true)}, 200); this.rotateHndl = setInterval(item.switchImg, 1500); },
        rotateStop: function() { clearInterval(this.rotateHndl); }
    };

    if (!$('body').hasClass('mobile')) {

      $('#content').on({
        'mouseenter': function (e) {
          if (!$(this).hasClass('zoomThumbActive')) {

            $('div.thumb_zoom_icon0', $(this)).css('display', 'block')
          }
        }, 'mouseleave': function (e) {
          $('div.thumb_zoom_icon0', $(this)).css('display', 'none')
        }
      }, '.multi_left_side .multi_thumbs li a');

        $('#content').on({
            mouseenter: function (e) {
                item.init(this);
            },
            mouseleave: function () {
                item.reset();
            }
        }, '.action_item_v4.expand');


        $('#content').on({
            mouseenter: function (e) {
                $(this).addClass('border-block_hover');
            },
            mouseleave: function () {
                $(this).removeClass('border-block_hover');
            }
        }, '.action_item_v4.narrow.expand .border-block.prod');


        $('#content').on({
            mouseenter: function () {
                item.rotateStart();
            },
            mouseleave: function () {
                item.rotateStop();
            }
        }, '.prod .ai_img');

        $('#content').on({
            hover: function () {
                $(this).parent().find('div').removeClass('active');
                $(this).addClass('active');
                item.switchImg(false, this.getAttribute('data-id'));
            }
        }, '.mini-gallery div');
    }

    $('.ai_img .main').lazyload({
                                    effect   : 'fadeIn',
                                    threshold: 50,
                                    event    : 'scroll'
                                });
    $('body').on('click', '.ui-widget-overlay', function() {
        $('.ui-dialog .ui-dialog-content').dialog('close');
    });

    // изменение и восстановление цен на время акции "Черный понедельник"
    var showPromoPrices = $.cookie("show_promo_prices");
    if (showPromoPrices && false) {
        $('#wrapper, .menu_container').addClass('dark'); // затемнение фона

        var regexTech = /goods\/tech/;
        var regexFurn = /goods\/home\/furniture/;
        if (!regexTech.test(document.location.href) && !regexFurn.test(document.location.href)) {

            $('div.info-block').each(function(){
                var priceOriginal = $(this).find('div.ai_promo_original_price').text();
                var priceFinal = $(this).find('div.ai_promo_final_price').text();
                var pricePromo = $(this).find('div.ai_promo_price').text();
                if (priceOriginal && priceFinal && pricePromo && parseInt(pricePromo) < parseInt(priceFinal) && parseInt(pricePromo) > 1) {
                    var discountPromo = Math.round((priceOriginal - pricePromo) * 100 / priceOriginal);
                    $(this).find('div.ai_discount').html('-' + discountPromo + '<span>%</span>');
                    $(this).find('div.ai_discounted').html('<div class="ai_separator"></div>' + pricePromo + '<b style=" font-size: 26px; line-height: 10px; ">.</b>-');
                }
            });
        }
    }

});
//------------------------------------------------------счетчик для кнопки "Оплатить"

$(function(){

    $('.pay_order input.blue-button').click(function() {
        //_gaq.push(['_trackEvent', 'pay', 'pay_button', 'pay_button_click']);
        dataLayer.push({
            'GAEventCategory': 'offer_pay',
            'GAEventAction': 'confirm_pay_button',
            'GAEventLabel': 'offer_pay_click',
            'event': 'GAEvent'
        });
    })

});


//------------------------------------------------------счетчик для кнопки "Оплатить"

$(document).on('ready', function(){
    var browserVer = navigator.appVersion;
    if(browserVer.indexOf('Version/5.1.7 Safari') != -1 && $('.brand_out_block').length){
        $('.brand_out_block').css({'width':188});
    }
});


$(document).ready(function(){
    if(!$('.mobileApp__block').length){
        $('#wrapper').css({
            'padding-bottom':'316px'
        });
        $('#footer0').css({
            'margin-top':'-316px'
        });
    }

    if($('.promo_item').length > 0){
        $('.promo_item').each(function(){
            var $DO_container = $(this).closest('.catalog_container');
            var ai_height = $DO_container.find('.action_item_v4:not(.promo_clap)').height();
            $(this).css({'height':ai_height});
            $(window).on('resize', function(){
                $DO_container.find('.action_item_v4').css({'height':ai_height});
            });
        });


    }
});

// события гугл-аналитики
$(document).ready(function () {
    attachGAEvents({
        'append': '/virtual',
        'gaTrackingId': 'UA-13238616-1',
        'pages': {
            '/auth/': [
                {
                    'selector': '#openid_form input[name*="email_"]',
                    'jqEvent': 'focusout',
                    'func': function (params, callback) {
                        if (params['value']) {
                            var val = params['value'];
                            val = val.replace(/[ -\(\)]/g, '');
                            var regex = new RegExp(/^\+?[0-9]{10,11}$/);
                            if (regex.test(val)) {
                                callback('auth/insertPhone');
                            } else {
                                if (val.indexOf('@') !== -1) {
                                    callback('auth/insertEmail');
                                }
                            }
                        }
                    }
                },
                {
                    'selector': '#openid_form input[name*="password_"]',
                    'jqEvent': 'focusout',
                    'func': function (params, callback) {
                        if (params['value'] && params['value'].length >= 6) {
                            callback('auth/insertPass');
                        }
                    }
                },
                {
                    'selector': '#openid_form input[name*="captcha_value_"]',
                    'jqEvent': 'focusout',
                    'func': function (params, callback) {
                        if (params['value'] && params['value'].length >= 6) {
                            callback('auth/insertCaptcha');
                        }
                    }
                },
                {
                    'selector': '#openid_form a.reload_captcha',
                    'jqEvent': 'click',
                    'page': 'auth/reloadCaptcha'
                },
                {
                    'selector': '#openid_form',
                    'jqEvent': 'submit',
                    'page': 'auth/submitData'
                }
            ],
            '/registration/': [
                {
                    'selector': '#regForm #name_vis',
                    'jqEvent': 'focusout',
                    'func': function (params, callback) {
                        if (params['value'] && params['value'].length > 0 && params['value'] !== 'Имя') {
                            callback('registration/insertName');
                        }
                    }
                },
                {
                    'selector': '#regForm #surname_vis',
                    'jqEvent': 'focusout',
                    'func': function (params, callback) {
                        if (params['value'] && params['value'].length > 0 && params['value'] !== 'Фамилия') {
                            callback('registration/insertSurname');
                        }
                    }
                },
                {
                    'selector': '#regForm input[name*="EMAIL"]',
                    'jqEvent': 'focusout',
                    'func': function (params, callback) {
                        if (params['value']) {
                            var regex = /^[+A-Za-z0-9_\.-]+@[+A-Za-z0-9_\.-]+\.[A-Za-z]{2,}$/;
                            if (regex.test(params['value'])) {
                                callback('registration/insertEmail');
                            } else {
                                callback('registration/wrongEmailFormat');
                            }
                        }
                    }
                },
                {
                    'selector': '#regForm input[name*="PASSWORD_"]',
                    'jqEvent': 'focusout',
                    'func': function (params, callback) {
                        if (params['value'] && params['value'] !== 'Пароль') {
                            if (params['value'].length >= 6) {
                                callback('registration/insertPass');
                            } else {
                                callback('registration/tooShortPass');
                            }
                        }
                    }
                },
                {
                    'selector': '#regForm input[name*="PASSWORD2_"]',
                    'jqEvent': 'focusout',
                    'func': function (params, callback) {
                        if (params['value'] && params['value'].length >= 6 && params['value'] !== 'Подтверждение пароля') {
                            callback('registration/confirmPass');
                        }
                    }
                },
                {
                    'selector': '#regForm input[name*="PROMOCODE_"]',
                    'jqEvent': 'focusout',
                    'func': function (params, callback) {
                        if (params['value'] && params['value'].length >= 6 && params['value'] !== 'Промокод') {
                            callback('registration/promo');
                        }
                    }
                },
                {
                    'selector': '#regForm input[name*="CITY_ID_"]',
                    'jqEvent': 'change',
                    'func': function (params, callback) {
                        // 134 - региональный город
                        if (params['value'] && params['value'] != 134) {
                            setTimeout(function () {
                                var cityName = $.trim($('#select_city_input').text());
                                callback('registration/selectCity/' + cityName);
                            }, 100);
                        }
                    }
                },
                {
                    'selector': '#regForm input[name*="CITY_EXT_ID_"]',
                    'jqEvent': 'change',
                    'func': function (params, callback) {
                        if (params['value'] && params['value'] != 0) {
                            setTimeout(function () {
                                var cityName = $.trim($('#select_city_input').text());
                                callback('registration/selectCity/' + cityName);
                            }, 100);
                        }
                    }
                },
                {
                    'selector': '#regForm #captcha_vis',
                    'jqEvent': 'change',
                    'func': function (params, callback) {
                        if (params['value'] && params['value'].length >= 6 && params['value'] !== 'Введите код на изображении') {
                            callback('registration/insertCaptcha');
                        }
                    }
                },
                {
                    'selector': '#regForm a.reload_captcha',
                    'jqEvent': 'click',
                    'page': 'registration/reloadCaptcha'
                },
                {
                    'selector': '#regForm',
                    'jqEvent': 'submit',
                    'func': function (params, callback) {
                        var name = $('#regForm #name_vis').val();
                        var surname = $('#regForm #surname_vis').val();
                        if (!name || !surname || name == 'Имя' || surname == 'Фамилия') {
                            callback(['registration/wrongName', 'registration/submitData']);
                        } else {
                            callback('registration/submitData')
                        }
                    }
                },
                {
                    'selector': '#change_client_city_extended_form .citylist-tabs li',
                    'jqEvent': 'click',
                    'func': function (params, callback) {
                        if (params['text']) {
                            callback('registration/selectCountry/' . params['text']);
                        }
                    }
                },
                {
                    'selector': '#change_client_city_extended_form #p_city-input',
                    'jqEvent': 'focusin',
                    'page': 'registration/citySearch'
                },
                {
                    'selector': '#change_client_city_extended_form .citylist-alphabet span',
                    'jqEvent': 'click',
                    'func': function (params, callback) {
                        if (!params['className'] || params['className'] !== 'capital') {
                            callback('registration/selectLetter');
                        }
                    }
                }
            ]
        }
    });

    function attachGAEvents(obj) {
        var append = obj['append'] ? obj['append'] : '';
        var trackId = obj['gaTrackingId'];
        for (var pathname in obj['pages']) {
            if (obj['pages'].hasOwnProperty(pathname)) {
                if (pathname === window.location.pathname) {
                    for (var k in obj['pages'][pathname]) {
                        (function () {
                            var eventObj = jQuery.extend(true, {}, obj['pages'][pathname][k]);
                            var selector = eventObj['selector'];
                            var func = eventObj['func'];
                            var page = eventObj['page'];
                            if (!selector) {
                                throw new Error('Некорректный селектор ' + selector);
                            }
                            $('body').on(eventObj['jqEvent'] + '.ga', selector, function (e) {
                                if ((typeof ga.getByName === 'function') && (ga.getByName('t0') === undefined))
                                    ga('create', trackId);

                                if (typeof func === 'function') {
                                    func({
                                        event: e,
                                        value: $(this).val(),
                                        className: $(this).attr('class')
                                    }, function (pages) {
                                        if (!Array.isArray(pages)) {
                                            pages = [pages];
                                        }
                                        for (var i in pages) {
                                            if (pages.hasOwnProperty(i)) {
                                                ga('send', 'pageview', pages[i] + append);
                                            }
                                        }
                                    });
                                } else {
                                    ga('send', 'pageview', page + append);
                                }
                            });
                        }) ();
                    }
                }
            }
        }
    }
});

/* Регистрация действий пользователя */
/* Если кроме попап popup_reg3001 нигде не задействован, то удалить  */
function rt_send_by_type(type, rt_popup_group){
    (function (d, w) {
        if(type==1 || type==2){
            var action_title=type==1 ? "close_cross" : "close_background";
            dataLayer.push({
                'GAEventCategory': 'Site Track',
                'GAEventAction': 'pop300_' + action_title + '_' + rt_popup_group,
                'GAEventLabel': '',
                'event': 'GAEvent'
            });
        }
        rt_data_ac={adv_id: "1", event: "action", type: type, rt_popup_group: rt_popup_group};
        var ts = d.createElement("script"); ts.type = "text/javascript"; ts.async = true;
        ts.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//rt.biglion.ru/rt_ac.js";
        var f = function () {var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ts, s);};
        if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); }
    })(document, window);
}

$(document).ready(function() {
    //TODO: Временно выключено для разгрузки RT-серверов
    //rt_send_by_type(6);
});

// код системы ActionPay
(function (w, d) {
    try {
        var el = 'getElementsByTagName', rs = 'readyState';
        if (d[rs] !== 'interactive' && d[rs] !== 'complete') {
            var c = arguments.callee;
            return setTimeout(function () { c(w, d) }, 100);
        }
        var s = d.createElement('script');
        s.type = 'text/javascript';
        s.async = s.defer = true;
        s.src = '//aprtx.com/code/teamber/';
        var p = d[el]('body')[0] || d[el]('head')[0];
        if (p) p.appendChild(s);
    } catch (x) { if (w.console) w.console.log(x); }
})(window, document);
window.APRT_DATA = { pageType: 0 };

$(document).ready(function() {
    // "-60%" для раздела "Отели" в меню
    $('li.cat-deals a[href*="/hotels/"]:first span.text').after(
        $('<span>-60%</span>')
            .css({
                width: '40px',
                height: '15px',
                background: '#f6753e',
                'border-radius': '4px',
                padding: '5px 7px',
                'font-weight': 'bold',
                'display': 'inline',
                'margin-left': '10px',
                'vertical-align': 'middle'
            })
    );
});
