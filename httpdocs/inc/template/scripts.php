<?php //foreach($_JS as $script) print("<script src='".$script."' /></script>"); ?>
<?php if(LOCAL) print("<script src='//0.0.0.0:35729/livereload.js'></script>"); ?>



  <script>
  function runtime(){

  }

  $Ldr.init(['<?php echo implode("','",$_JS); ?>'],function() {

      runtime();

  },function(){


  });
  </script>
