<?
define('IN_SITE',true);
$site_root = "./";

require_once($site_root . 'includes/common.php');
require_once($site_root . 'includes/topgallery.php');
require_once($site_root . 'includes/order_stuff.php');




require_once($site_root . 'includes/session_stuff.php');

header("Cache-control: private");
header("Content-type: text/html; charset=utf-8");



?>
