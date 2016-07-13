<?php foreach($_CSS as $lib) print("<link rel='stylesheet' href='".$lib."'>"); ?>
<!--[if lt IE 10]>
  <?php foreach($_CSS_Dev as $lib) print("<link rel='stylesheet' href='".$lib."'>"); // IE8/9 can't handle css files with lots of styles :( ?>
<![endif]-->
<title>Home</title>
<meta name="description" content=".">
<meta charset="utf-8">
<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1' />
<?php include($_SERVER['DOCUMENT_ROOT']."/inc/template/stan-loader.php"); ?>
<link rel="shortcut icon" href="/favicon/favicon.ico?v=2">
