<div class='slider hero' id='hero'>

  <div class='content valign-mid'>
    <div class='container'>
      <div class='row'>
        <div class='col-sm-8 col-md-6'>
          <div class='inner'>
            <p class='title-h1'>BEAUTIFULLY CRAFTED HOMES</p>
            <h1>Heywood Homes provide a range of high-quality and fashionable homes in the Kirklees area</h1>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class='arrow-down halign-mid scroll-to' data-target='#content'>
    <?=svg("chevron-down.svg", array(
      'class'		=> 'chevron-down',
    )); ?>
  </div>



  <div class='frame'>
    <div class='layer0 slider-img'>
      <div class='resp-bgr-cover' data-bgr='1' data-resp-img='true' data-base='/assets/images/home/' data-xs='hero-slide-1-xs.jpg' data-sm='hero-slide-1-sm.jpg' data-md='hero-slide-1-md.jpg' data-lg='hero-slide-1-lg.jpg'></div>
    </div>
    <?php /*<div class='layer1 image-overlay overlay-box overlay-bgr'>
      <div class='container'>
        <div class='overlay-text'>
          <h1>Image Heading</h1>
          <h4>Image strap line</h4>
        </div>
      </div>
    </div>*/ ?>
  </div>
  <div class='frame'>
    <div class='layer0 slider-img'>
      <div class='resp-bgr-cover' data-bgr='1' data-resp-img='true' data-base='/assets/images/home/' data-xs='hero-slide-2-xs.jpg' data-sm='hero-slide-2-sm.jpg' data-md='hero-slide-2-md.jpg' data-lg='hero-slide-2-lg.jpg'></div>
    </div>
    <?php /*<div class='layer1 image-overlay overlay-box overlay-bgr'>
      <div class='container'>
        <div class='overlay-text'>
          <h1>Image Heading</h1>
          <h4>Image strap line</h4>
        </div>
      </div>
    </div>*/ ?>
  </div>
  <div class='frame'>
    <div class='layer0 slider-img'>
      <div class='resp-bgr-cover' data-bgr='1' data-resp-img='true' data-base='/assets/images/home/' data-xs='hero-slide-3-xs.jpg' data-sm='hero-slide-3-sm.jpg' data-md='hero-slide-3-md.jpg' data-lg='hero-slide-3-lg.jpg'></div>
    </div>
  </div>
  <?php /*<div class='frame'>
    <div class='layer0 slider-img'>
      <div class='resp-bgr-cover' data-bgr='1' data-resp-img='true' data-base='/assets/images/home/' data-xs='hero-slide-4-xs.jpg' data-sm='hero-slide-4-sm.jpg' data-md='hero-slide-4-md.jpg' data-lg='hero-slide-4-lg.jpg'></div>
    </div>
  </div>
  <div class='frame'>
    <div class='layer0 slider-img'>
      <div class='resp-bgr-cover' data-bgr='1' data-resp-img='true' data-base='/assets/images/home/' data-xs='hero-slide-5-xs.jpg' data-sm='hero-slide-5-sm.jpg' data-md='hero-slide-5-md.jpg' data-lg='hero-slide-5-lg.jpg'></div>
    </div>
  </div>*/ ?>
  <?php /*<i class='material-icons icon-xl icon-box valign-mid next' data-toggle='slider.next'>chevron_right</i>
  <i class='material-icons icon-xl icon-box valign-mid prev ' data-toggle='slider.prev'>chevron_left</i>*/ ?>

</div>

<script>
$Ldr(function(){
  $('#hero').Slider({
    //height:{lg:$(window).height()-50, md:$(window).height()-50, sm:$(window).height()-50, xs:$(window).height()-50},
    height:function(){ return $(window).height() },
    autoplay: true,
    autoplay_delay: 8000,
    autoplay_break_on_click: true,
    layers:[{
      presetCSS:'fade',
      baseCSS: {opacity:0.7},
      inCSS: {opacity: 1},
      outDelay:300,
      outDuration:300,
      inDelay:300,
      inDuration:300,
    },{
      presetCSS:'fade',
      inDelay:600,
      inDuration:300,
      inEasing:'linear',
      outDelay:0,
      outDuration:300,
      outEasing:'linear'
    }]
  });
});
</script>
