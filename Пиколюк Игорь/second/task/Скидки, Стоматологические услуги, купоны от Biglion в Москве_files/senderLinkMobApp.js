function senderLinkMobApp(){
    $('.mobile_store_link').fadeOut(300);
    $('.form_inner_wrap').fadeIn(300).animate({
        'margin-left':0,
        'margin-right':18
    },300);
    //$('.phone_number_inp').focus();
    //$('.show_form').off('click');
    //$('#get_app_btn').addClass('inactive send_form').removeClass('show_form');

    $('.send_form').on({
        click: function(e) {

            if(!$(this).hasClass('inactive') && !$(this).hasClass('success-finish') && !$(this).hasClass('in-progress')){
                var self = this;
                var substr = $('.phone_number_inp').val().slice(0,2) + $('.phone_number_inp').val().slice(4,7) + $('.phone_number_inp').val().slice(9,12) + $('.phone_number_inp').val().slice(13,15) + $('.phone_number_inp').val().slice(16);
                var branchData = (typeof branchSdkData !== 'undefined') ? branchSdkData : {};

                $.ajax({
                    url: $('#send_link_mob_app_form').attr('action'),
                    type: 'POST',
                    data: {
                        'phoneNumber': substr,
                        'branchSdkData' : branchData
                    },
                    beforeSend: function() {
                        $(self).find('.btn_content').hide();
                        $(self).find('.loader').show();
                        $(self).addClass('in-progress');
                    },
                    success: function(data) {
                        if(data.status == 'success'){
                            $(self).find('.loader').fadeOut();
                            $(self).removeClass('in-progress');
                            $(self).addClass('success success-finish');

                            $('.subheader_text').fadeOut(150,function(){
                                $(this).html(data.message).addClass(data.status).fadeIn(150);
                            });

                            setTimeout(function(){
                                $(self).removeClass('success success-finish').addClass('inactive');
                                $(self).find('.btn_content').show();
                                $('.phone_number_inp').val('').removeClass('completed');

                                $('.subheader_text').fadeOut(150,function(){
                                    $(this).html($(this).data('standardText')).removeClass(data.status).fadeIn(150);
                                });
                            },10000);
                        }else if(data.status == 'error'){
                            $(self).find('.loader').fadeOut();
                            $(self).find('.btn_content').show();

                            $('.subheader_text').fadeOut(150,function(){
                                $(this).html(data.message).addClass(data.status).fadeIn(150);
                            });

                            setTimeout(function(){
                                $('.subheader_text').fadeOut(150,function(){
                                    $(this).html($(this).data('standardText')).removeClass(data.status).fadeIn(150);
                                });
                            },5000);

                            $('.btns_wrap').addClass('err');
                            setTimeout(function(){
                                $('.btns_wrap').removeClass('err');
                            },400);
                        }
                    }
                });
            }else{
                return false;
            }
        }
    });
}

function InputColorComplete(){
    $('.phone_number_inp').addClass('completed');
    $('#get_app_btn').removeClass('inactive');
}

function InputColorIncomplete(){
    $('.phone_number_inp').removeClass('completed');
    $('#get_app_btn').addClass('inactive');
}

$(document).ready(function() {
    $('.form_inner_wrap').find('form').on('submit',function(e) {
        e.preventDefault();
        $('.send_form').click();
    });
    senderLinkMobApp();
});

$('.show_form').on({
    click:senderLinkMobApp
});


