<?php
// Set params
$sliderID = 'slider'.rand(10000, 99999);

// Get project ID
$pID = $_REQUEST['projectID'];

// Get images
if ($pID == 'theoakes') {
  include("the-oakes.php");
} elseif ($pID == 'moorlandviewfrankel') {
  include("moorland-view-frankel.php");
} elseif ($pID == 'moorlandviewfaugheen') {
  include("moorland-view-faugheen.php");
} elseif ($pID == 'moorlandviewkauto') {
  include("moorland-view-kauto.php");
} elseif ($pID == 'moorlandviewedredon') {
  include("moorland-view-edredon.php");
} elseif ($pID == 'moorlandvieworchidsemi') {
  include("moorland-view-orchid-semi.php");
} elseif ($pID == 'moorlandvieworchidtown') {
  include("moorland-view-orchid-town.php");
} elseif ($pID == 'moorlandviewdenman') {
  include("moorland-view-denman.php");
}


print("<div class='slider allery-slider none-till-ready' id='".$sliderID."'>");

  print("<div class='align-mid'><i class='material-icons anim-spin icon-xl grey'>loop</i></div>");

  foreach($imgs as $img){

    print("<div class='frame'><div class='layer0 image-container'>");

    print("<div data-bgr='1' defer-src='".$img['src']."' ".$img['responsive']." ".$img['sizes']." class='align-mid resp-bgr-contain'  />");

      print("<div class='image-overlay overlay-bar overlay-bgr'><div class='container'><div class='overlay-text'>");
        echo $img['desc'];
      print("</div></div></div>");

    print("</div></div>");

  }

  print("
  <i class='material-icons icon-xl icon-box icon-box-xl valign-mid next' data-toggle='slider.next'>chevron_right</i>
  <i class='material-icons icon-xl icon-box icon-box-xl valign-mid prev ' data-toggle='slider.prev'>chevron_left</i>
  ");

print("</div>");

?>

<script>
$Ldr(function(){

  $("#<?=$sliderID;?> img").load(function() {
    $STAN.imgBox($(this));
  });

  $("#<?=$sliderID;?>").Slider({

    height: {lg:'100%', md:'100%', sm:'100%', xs:'100%'},
    autoplay: 0,
    autoplay_delay: 0,
    autoplay_break_on_click: 0,
    layers:[{
      presetCSS:"fade",
      inDuration: 100,
      outDuration: 100
    }]

  }).Slider("set", '<?=$_REQUEST['index'] ? $_REQUEST['index'] : '0';?>').Slider('loadDeferedImages').Swiper({

    left: true,
    right: true,
    sensitivity: "low"

  }).On("swiper.left", function($this, settings) {

    $this.Slider("next");

  }).On("swiper.right", function($this, settings) {

    $this.Slider("prev");

  });

});
</script>
