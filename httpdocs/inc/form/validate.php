<?php

function curl($url){

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER,true);
	return curl_exec($ch);

}

function sa_nl2br($v){
	$v=str_replace(array("\r\n", "\n\r", "\r", "\n"), "<br/>", $v);
	return $v;
}

function sa_get($x,$return=false){ // GET MIXED CHAR STRING FROM GET/POST

	global ${$x};

	$v=$_REQUEST[$x];

	//if(get_magic_quotes_gpc()==1) $v=stripslashes($v);

	$v=strip_tags($v);
	$v=htmlentities($v,ENT_QUOTES,"utf-8");
	$v=sa_nl2br($v);
	//$v=mysql_real_escape_string($v);
	$v=stripslashes($v);

	//STUPID WORD CHARS ‘ ’ “ ” -
	$v=str_replace("&amp;#8217;","&#39;",$v);
	$v=str_replace("&amp;#8216;","&#39;",$v);
	$v=str_replace("&amp;#8220;",'"',$v);
	$v=str_replace("&amp;#8221;",'"',$v);
	$v=str_replace("&amp;#8211;","-",$v);
	$v=str_replace("&amp;#8226;","&bull;",$v);
	$v=str_replace("&amp;#8230;","...",$v);

	if($return) return $v; else ${$x}=$v;

}

sa_get('name');
sa_get('tel');
sa_get('msg');
sa_get('email');
sa_get('dev');
sa_get('recaptcha');

$key = '6LeDAhsTAAAAAG4xmjuKOmFQ5vxSVeY_vfnOO9jI';

if(!$dev) $dev = 'Contact';

$url="https://www.google.com/recaptcha/api/siteverify?secret=".$key."&remoteip=".$_SERVER['REMOTE_ADDR']."&response=".$recaptcha;

$response = json_decode(curl($url));


if($name=='' || $tel=='' || $email=='' || !$response->success){

	echo "ERROR";

}else{

	$m="<img src='http://www.site.com/assets/images/logo.gif' />";
  $m.="<h1 style='font:normal 18px/20px Arial, Helvetica, sans-serif; color:#212121;'>".$dev." - Enquiry Form</h1>";
  $m.="<span style='font-size:14px; font-family:Arial, Helvetica, sans-serif; line-height:20px; color:#212121;'>Thank you for your enquiry. We will be in touch shortly.</span><br/><br/>";

	$m.="<span style='font-size:14px; font-family:Arial, Helvetica, sans-serif; line-height:20px;'>";

	$m.="Name: $name <br/>";
	$m.="Tel: $tel <br/>";
	$m.="Email: $email <br/>";
	$m.=$msg;

	$m.="</span><br/><br/><span style='font-size:14px; font-family:Arial, Helvetica, sans-serif; line-height:20px;'>Bla bla</span>";

	$m=html_entity_decode($m,ENT_QUOTES);

	$subject="Heywood Homes - ".$dev." Form";

	$h="From: no-reply@site.com\nContent-type:text/html; charset=utf-8\n";

  // Send to admin
	mail("email@domain.com",$subject,$m,$h);

  // Send to customer
	mail($email,$subject,$m,$h);

	echo "OK";

}
