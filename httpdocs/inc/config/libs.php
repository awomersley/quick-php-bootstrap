<?php

// Get timestamps set by Grunt
define('TIMESTAMP',  GetContents('cache/assets/.timestamp') );

// Webfonts - https://github.com/typekit/webfontloader
$_Fonts=array(
  'google'=>array(
    'families'=>array('Open+Sans:400,700')
  )
  /*'typekit'=>array(
    'id'=>'znt5hle'
  )*/
);

// Set CSS/JS Libs
$_CSS_Dev=array(
  '/assets/libs/bootstrap/bootstrap.min.css',
  '/assets/libs/fontawesome/css/font-awesome.min.css',
  '/cache/assets/site-'.TIMESTAMP.'.css'
);

$_CSS_Live=array('/cache/assets/'.DOMAIN.'-'.TIMESTAMP.'.css');

$_JS_Dev=array(
  '/assets/libs/jquery/jquery.min.js',
  '/assets/libs/bootstrap/bootstrap.min.js',
  '/cache/assets/site-'.TIMESTAMP.'.js'
);

$_JS_Live=array('/cache/assets/'.DOMAIN.'-'.TIMESTAMP.'.js');

// Set libs based on environment
if(LOCAL){
  $_CSS=$_CSS_Dev;
  $_JS=$_JS_Dev;
}else{
  $_CSS=$_CSS_Live;
  $_JS=$_JS_Live;
}
