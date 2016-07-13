<?php

define('DOMAIN',            basename(dirname(BASE)));
define('SITE_ID',           'site-id');
define('NAME',              'Name of Site');
define('URL',               'URL of Site');

define('LOCAL',             ($_SERVER['SERVER_NAME']=='localhost' || $_SERVER['SERVER_NAME']=='0.0.0.0') ? true : false);
