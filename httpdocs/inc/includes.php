<?php

/*$protection_key='key';

if(!session_id()) session_start();
if($_REQUEST['key']){ $_SESSION['key']=$_REQUEST['key']; header("Location: /"); exit; }
if($_SESSION['key']!=$protection_key) exit;*/


// Define BASE path
define('BASE', $_SERVER["DOCUMENT_ROOT"].'/');

// Load core components
include(BASE."inc/core/functions.php");

// Load config files
include(BASE."inc/config/variables.php");
include(BASE."inc/config/libs.php");
include(BASE."inc/config/mysql.php");
