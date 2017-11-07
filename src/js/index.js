

$(function(){

    var loader = new PxLoader(),
        slideOne = loader.addImage('./images/home/slider-1.jpg'),
        slideTwo = loader.addImage('./images/home/slider-2.jpg');

    $(window).on('resize',function () {
        window.location.reload();
    })

    function updateLayout() {
        console.log('update')
        let containerElement = document.getElementsByClassName('slogan-container')[0];
        //判断事件类型：是方向变换还是窗口变化
        let event = 'orientationchange' in window ? 'orientationchange' : 'resize';
        //更新home-container元素的font-size的值
        let updateFontSize = function () {
            //获取根元素home-container的宽度
            let clientWidth = containerElement.clientWidth;
            if (!clientWidth) {
                return;
            }
            containerElement.style.fontSize = 16 * (clientWidth / 1200) + 'px';
            //TODO: test TODO
        };
        if (!document.addEventListener) {
            return;
        }
        updateFontSize();
        window.addEventListener(event, updateFontSize, false);
    }

    // updateLayout();

    if(document.documentElement.clientWidth>992){
        $('.suspension').show();
        $('.suspension').css('overflow-y','hidden')
        $('.suspension').css('overflow-y','scroll')
        // $('.suspension').animate({height:'85%'},100)
        // $('.suspension').animate({height:'85%',bottom:'-45px'},100)
        $('.suspension').mouseenter(function () {
            $(".LCheader_Header ").hide();
            $('.suspension').css({'overflow-y':'scroll','backgroundColor':'#16394f'})
            $(this).animate({height:'85%'},100)
            // if($(this).height()<$('.main').height()){
            //     $(this).css({'bottom:0})
            // }
        }).mouseleave(function () {
            $(".LCheader_Header ").show();
            $('.suspension').css({'overflow-y':'hidden','backgroundColor':''})
            $(this).animate({height:'45px'},100)
            $(this).scrollTop(0)
        });
    }

    loader.addCompletionListener(function() {
        $('.loading_1').hide();
        $('.slide-one').attr('src','./images/home/slider-1.jpg')
        $('.slide-two').attr('src','./images/home/slider-2.jpg')
        var h =0,
            maskWidth;
        if(document.documentElement.clientWidth>991){
            h = $('.main').height();
            maskWidth = 423;
        }else {
            h = $('.slide-bg img').height();
            maskWidth = Math.floor((423/742)*h);
        }



        console.log(maskWidth)
        var mySwiper = new Swiper('.swiper-container',{
            autoplay:5000,
            loop:true,
            grabCursor: true,
            paginationClickable: true,
            onFirstInit:function () {
                $('.swiper-container,.swiper-container .mask').css('height',h);
                $('.slide-one').addClass('active');
                $('.swiper-container .mask').css({'width':maskWidth+'px','left':'-'+maskWidth+'px'});
                if(document.documentElement.clientWidth<600){
                    $('.swiper-container .mask.one .slogan-container').hide();
                    $('.swiper-container .mask.one').animate({'left':0},{
                        duration:1000,
                        complete:function () {
                            $('.swiper-container .mask .slogan-container').show();
                            $('.swiper-container .mask.one .slogan-container').animate({top:'30px'},{
                                duration:1000,
                                complete:function () {

                                }
                            })
                        }
                    });
                }else {
                    $('.swiper-container .mask.one .slogan-container').hide();
                    $('.swiper-container .mask.one').animate({'left':0},{
                        duration:1000,
                        complete:function () {
                            $('.swiper-container .mask.one .slogan-container').show();
                            $('.swiper-container .mask.one .slogan-container').animate({top:'193px'},{
                                duration:1000,
                                complete:function () {

                                }
                            })
                        }
                    });
                }

            },
            onSlideChangeStart:function () {
                $('.slide-one').removeClass('active');
                $('.swiper-container .slide-bg img').removeClass('active');
                $('.swiper-container .mask').css({'left':'-'+maskWidth+'px'});
                // $('.swiper-container .mask').css('width','0');
                $('.swiper-container .mask .slogan-container').hide();
                $('.swiper-container .mask .slogan-container').css('top','-375px');
            },
            onSlideChangeEnd:function () {
                $('.swiper-container .swiper-slide-active .slide-bg img').addClass('active');
                if(document.documentElement.clientWidth<600){
                    $('.swiper-container .swiper-slide-active .mask').animate({'left':0},{
                        duration:1000,
                        complete:function () {
                            $('.swiper-container .mask .slogan-container').show();
                            $('.swiper-container .swiper-slide-active .mask .slogan-container').animate({top:'30px'},{
                                duration:1000,
                                complete:function () {

                                }
                            })
                        }
                    });
                }else {
                    $('.swiper-container .swiper-slide-active .mask').animate({'left':0},{
                        duration:1000,
                        complete:function () {
                            $('.swiper-container .mask .slogan-container').show();
                            $('.swiper-container .swiper-slide-active .mask .slogan-container').animate({top:'193px'},{
                                duration:1000,
                                complete:function () {

                                }
                            })
                        }
                    });
                }
            }
        })
    });

// begin downloading images
    loader.start();

})
