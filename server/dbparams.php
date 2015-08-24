<?php
/**
 * Created by PhpStorm.
 * User: georgepipkin
 * Date: 12/10/13
 * Time: 7:05 AM
 */

$user="gpp8p";
$password="kal1ca7";
$database="dgpath";
mysql_connect("127.0.0.1",$user,$password);
@mysql_select_db($database) or die( "Unable to select database");
