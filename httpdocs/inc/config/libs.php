<?php

// Get timestamps set by Grunt
define('TIMESTAMP',  GetContents(BASE . 'cache/assets/.timestamp') );

// Webfonts - https://github.com/typekit/webfontloader
$_Fonts=array(
  'google'=>array(
    'families'=>array('Lato:400,300,700')
  )
  /*'typekit'=>array(
    'id'=>'znt5hle'
  )*/
);

// Set CSS/JS Libs
$_CSS_Dev=array(
  '/cache/assets/material-icons.css',
  '/cache/assets/site-'.TIMESTAMP.'.css'
);

$_CSS_Live=array('/cache/assets/'.SITE_ID.'-'.TIMESTAMP.'.css');

$_JS_Dev=array(
  '/cache/assets/jquery.min.js',
  '/cache/assets/site-'.TIMESTAMP.'.js'
);

$_JS_Live=array('/cache/assets/'.SITE_ID.'-'.TIMESTAMP.'.js');

// Set libs based on environment
if(LOCAL){
  $_CSS=$_CSS_Dev;
  $_JS=$_JS_Dev;
}else{
  $_CSS=$_CSS_Live;
  $_JS=$_JS_Live;
}
