<?php
/*
<?=svg("svg-test.svg", array(
  'width' 	=> 400,
  'height' 	=> 120,
  'class'		=> 'test',
  'attr'		=> 'onclick="alert(12)"',
  'href'		=> '/test',
  'target'	=> '_blank'
)); ?>
*/
function svg($path, $options = array()) {

  $file = BASE . 'assets/images/' . $path;

  if (is_file($file)) {

    $svg = file_get_contents($file);

    if ($options['class']) {
      $class = " class='" . $options['class'] . "'";
    }

    if($options['attr']) {
      $attr = " " . $options['attr'];
    }

    if ($options['width']) {
      $style .= "width:" . $options['width'] . "px;";
    }
    if ($options['height']) {
      $style .= "height:" . $options['height'] . "px;";
    }
    if ($style) {
      $style = " style='" . $style . "'";
    }

    if ($options['href']) {
      $target = $options['target'] ? " target='" . $options['target'] . "'" : "";
      $html .= "<a href='" . $options['href'] . "'".$target.">";
    }

    $html .= str_replace("<svg", "<svg" . $style . $class . $attr, $svg);

    if ($options['href']) {
      $html .= "</a>";
    }

    return $html;

  }

}

function twitter($id, $limit) {

  // URL to send to
    $url='http://api.smartarts.co.uk/twitter/';

    // Auth key
    $key='_^XcIt#ETVGk+9idgnIn40rUqt*XWc1M)DPHWH_viwGdlOhs2PFMvXmL+doRg=jeyZMalDvu02y_vFjd?PPvr16n5a5_+=+tTIt5';

    // Init cURL
    $ch=curl_init();

    // Set Options
    curl_setopt_array($ch,array(
        CURLOPT_URL				          => $url,
        CURLOPT_HTTPHEADER		      => array('X-key:'.$key),
        CURLOPT_POSTFIELDS 		      => "screen_name=".$id."&count=".$limit,
        CURLOPT_RETURNTRANSFER	    => true,
        CURLOPT_CONNECTTIMEOUT	    => 5,
        CURLOPT_TIMEOUT 		        => 5
      )
    );

    // Execute
    $tweets=json_decode(curl_exec($ch));

    return $tweets;

}


function GetContents($file){
  return trim(file_get_contents($file,FILE_USE_INCLUDE_PATH));
}
