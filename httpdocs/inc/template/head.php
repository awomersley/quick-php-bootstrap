<?php foreach($_CSS as $lib) print("<link rel='stylesheet' href='".$lib."'>"); ?>
<!--[if lt IE 10]>
  <?php foreach($_CSS_Dev as $lib) print("<link rel='stylesheet' href='".$lib."'>"); // IE8/9 can't handle css files with lots of styles :( ?>
<![endif]-->
<!--[if lt IE 9]>
  <script type='text/javascript' src='http://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.6.2/html5shiv.js'></script>
  <script type='text/javascript' src='http://cdnjs.cloudflare.com/ajax/libs/respond.js/1.3.0/respond.js'></script>
  <link rel='stylesheet' href='/assets/css/ie8.css'>
<![endif]-->
<meta charset="utf-8">
<title><?=NAME;?></title>
