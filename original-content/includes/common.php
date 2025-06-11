<?
set_include_path(get_include_path() . PATH_SEPARATOR . dirname(__FILE__));
require_once('defines.php');
ini_set("session.auto_start","0");
ini_set("register_globals","On");
// common include file which includes everything else.

include ($site_root . "includes/db_connect.php");
include ($site_root . "includes/functions.php");

//$restricted_base_path = "/home/rene/mystuff/business/client_stuff/rocco/endycode/restricted_files/";
//$restricted_base_path_thumbs = "/home/rene/mystuff/business/client_stuff/rocco/endycode/restricted_files/thumbs/";

//$restricted_base_path = "/home/rene/public_html/endycode/restricted_files/";
//$restricted_base_path_thumbs = "/home/rene/public_html/endycode/restricted_files/thumbs/";


$restricted_base_path = "../restricted_files/";
$restricted_base_path_thumbs = "../restricted_files/thumbs/";


$the_base_path = ".";


$vars = array_merge($_POST, $_GET);
if(get_magic_quotes_gpc()){
	$vars = stripslashes_array($vars);
}
$messages = array();



function rdx($v) {

    echo "<pre>\n";
    var_dump($v);

    echo "\n</pre>";
}

function set_login(){
$sql="insert into `login` (md5) values ('1') ";
mysql_query($sql) or die(mysql_error());
}

function valid_login(){
		global $db;		
	
		$q = "SELECT * FROM login order by id Desc";
		$rs = $db->query($q);
		if(DB::isError($rs)) $this->query_failed($q, $rs->getMessage());		
		$row = $rs->fetchRow();
		$m20=date("Y-m-d H:i:s", mktime(date('H'),date('i')-20,date('s'),date('m'),date('d'),date('Y')));		
		if($row['md5']==1 &&  ($row['datetime']>$m20)){ return 1;}
		else return 0;
              
	}

function set_logout(){
		global $db;		
	
		$q = "SELECT * FROM login order by id Desc";
		$rs = $db->query($q);
		if(DB::isError($rs)) $this->query_failed($q, $rs->getMessage());		
		$row = $rs->fetchRow();
				
		$id=$row['id'];
		$q = "update login set md5='0' where id='$id'";
		$rs = $db->query($q);
              
	}
?>
