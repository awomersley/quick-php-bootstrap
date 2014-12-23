<?php

// Define BASE path
define('BASE', $_SERVER["DOCUMENT_ROOT"].'/');

// Load core components
include(BASE."inc/core/functions.php");

// Load config files
include(BASE."inc/config/variables.php");
include(BASE."inc/config/libs.php");
include(BASE."inc/config/mysql.php");
