<div class='slider jumbotron' id='jumbotron'>

  <div class='content valign-mid'>
    <div class='container'>
      <div class='row'>
        <div class='col-md-6 col-lg-5'>


          <?php if ($_PageID == 'TheOakes' || $_PageID == 'MoorlandView' || $_PageID == 'LeakHall'):?>
            <a class='back' href="/projects.php">BACK TO PROJECTS</a>
          <?php else:?>
          <?php endif; ?>

          <?php if ($_PageID == 'Projects'):?>
            <h1>PROJECTS</h1>
          <?php else:?>
          <?php endif; ?>

          <?php if ($_PageID == 'TheOakes'):?>
            <h1>THE OAKES, BROCKHOLES</h1>
          <?php else:?>
          <?php endif; ?>

          <?php if ($_PageID == 'MoorlandView'):?>
            <h1>MOORLAND VIEW, MELTHAM</h1>
          <?php else:?>
          <?php endif; ?>

          <?php if ($_PageID == 'LeakHall'):?>
            <h1>LEAK HALL, DENBY DALE</h1>
          <?php else:?>
          <?php endif; ?>

          <?php if ($_PageID == 'About'):?>
            <p class='title-h1'>ABOUT</p>
          <?php else:?>
          <?php endif; ?>

          <?php if ($_PageID == 'News' || $_PageID == 'WP_Head'):?>
            <p class='title-h1'>NEWS</p>
          <?php else:?>
          <?php endif; ?>

          <?php if ($_PageID == 'Contact'):?>
            <p class='title-h1'>CONTACT</p>
          <?php else:?>
          <?php endif; ?>

        </div>
      </div>
    </div>
  </div>

  <div class='frame'>
    <div class='layer0 slider-img'>

      <?php if ($_PageID == 'Projects'):?>
        <div class='resp-bgr-cover' data-bgr='1' data-resp-img='true' data-base='/assets/images/projects/' data-xs='projects-hero-xs.jpg' data-sm='projects-hero-sm.jpg' data-md='projects-hero-md.jpg' data-lg='projects-hero-lg.jpg'></div>
      <?php else:?>
      <?php endif; ?>

      <?php if ($_PageID == 'TheOakes'):?>
        <div class='resp-bgr-cover' data-bgr='1' data-resp-img='true' data-base='/assets/images/the-oakes/' data-xs='the-oakes-hero-xs.jpg' data-sm='the-oakes-hero-sm.jpg' data-md='the-oakes-hero-md.jpg' data-lg='the-oakes-hero-lg.jpg'></div>
      <?php else:?>
      <?php endif; ?>

      <?php if ($_PageID == 'MoorlandView'):?>
        <div class='resp-bgr-cover' data-bgr='1' data-resp-img='true' data-base='/assets/images/moorland-view/' data-xs='moorland-view-hero-xs.jpg' data-sm='moorland-view-hero-sm.jpg' data-md='moorland-view-hero-md.jpg' data-lg='moorland-view-hero-lg.jpg'></div>
      <?php else:?>
      <?php endif; ?>

      <?php if ($_PageID == 'LeakHall'):?>
        <div class='resp-bgr-cover' data-bgr='1' data-resp-img='true' data-base='/assets/images/leak-hall/' data-xs='leak-hall-hero-xs.jpg' data-sm='leak-hall-hero-sm.jpg' data-md='leak-hall-hero-md.jpg' data-lg='leak-hall-hero-lg.jpg'></div>
      <?php else:?>
      <?php endif; ?>

      <?php if ($_PageID == 'About'):?>
        <div class='resp-bgr-cover' data-bgr='1' data-resp-img='true' data-base='/assets/images/about/' data-xs='about-hero-xs.jpg' data-sm='about-hero-sm.jpg' data-md='about-hero-md.jpg' data-lg='about-hero-lg.jpg'></div>
      <?php else:?>
      <?php endif; ?>

      <?php if ($_PageID == 'News' || $_PageID == 'WP_Head'):?>
        <div class='resp-bgr-cover' data-bgr='1' data-resp-img='true' data-base='/assets/images/news/' data-xs='news-hero-xs.jpg' data-sm='news-hero-sm.jpg' data-md='news-hero-md.jpg' data-lg='news-hero-lg.jpg'></div>
      <?php else:?>
      <?php endif; ?>

      <?php if ($_PageID == 'Contact'):?>
        <div class='resp-bgr-cover' data-bgr='1' data-resp-img='true' data-base='/assets/images/contact/' data-xs='contact-hero-xs.jpg' data-sm='contact-hero-sm.jpg' data-md='contact-hero-md.jpg' data-lg='contact-hero-lg.jpg'></div>
      <?php else:?>
      <?php endif; ?>

    </div>
  </div>

</div>

<script>
$Ldr(function(){
  $('#jumbotron').Slider({
    height:{lg:340, md:340, sm:300, xs:240},
    //height:function(){ return $(window).height() },
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
