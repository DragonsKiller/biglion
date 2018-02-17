var bDialogAnim = {
    vAlignMiddle: function() {
        'use strict';
        var $dialogBlock = $('.b-dialog'),
            $dialogContainer = $dialogBlock.find('.b-dialog-container'),
            screenHeight = window.innerHeight;

        if($dialogContainer.outerHeight() < 400){
            $dialogContainer.css({
                'margin-top': ( (screenHeight-520) / 2 )
            });
        }else{
            $dialogContainer.css({
                'margin-top': ( (screenHeight-$dialogContainer.outerHeight()) / 2 )
            });
        }


    },
    show: function () {
        'use strict';
        var $dialogBlock = $('.b-dialog');
        $dialogBlock.fadeIn(500);
        $dialogBlock.find('.b-dialog-overlay').removeClass('closed').addClass('opened');
    },
    showContent: function() {
        /*'use strict';
        var $dialogBlock = $('.b-dialog'),
            $dialogContainer = $dialogBlock.find('.b-dialog-container');
        $dialogContainer.find('.anim-block').css({'opacity': 0});
        $dialogContainer.find('.anim-block').animate({opacity: "show"},300);
        $dialogContainer.find('.anim-block').fadeIn(300);

        $dialogContainer.find('.anim-block').addClass('elem-anim-open');*/
        bDialogAnim.vAlignMiddle();
    },
    clear: function() {
        'use strict';
        var $dialogBlock = $('.b-dialog'), //$authBlock
            $dialogBody = $dialogBlock.find('.b-dialog-body');
        $dialogBody.html('');
    },
    hide: function() {
        'use strict';
        var $dialogBlock = $('.b-dialog'), //$authBlock
            $dialogBody = $dialogBlock.find('.b-dialog-body');
        $dialogBlock.find('.b-dialog-overlay').removeClass('opened').addClass('closed');
        $dialogBlock.fadeOut(500,function(){
            $dialogBody.html('');
            $('.auth_notice').remove();
        });
    },
    preloader: function(block){
        'use strict';
        
        var cont = typeof block != 'undefined' ? block : '.b-dialog-body',
            $dialogBlock = $('.b-dialog'),
            $dialogBody = $dialogBlock.find(cont);
        $dialogBody.html('\
        <div class="loader">\
            <svg class="circular" viewBox="25 25 50 50">\
                <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="1" stroke-miterlimit="10"/>\
            </svg>\
        </div>');
    }
};
$(document).on('click', '.b-dialog-close', bDialogAnim.hide);
$(window).on('resize',bDialogAnim.vAlignMiddle);