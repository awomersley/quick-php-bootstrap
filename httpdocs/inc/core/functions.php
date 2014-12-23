<?php

function GetContents($file){
  return trim(file_get_contents($file,FILE_USE_INCLUDE_PATH));
}
