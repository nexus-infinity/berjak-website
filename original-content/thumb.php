<?

define('IN_SITE',true);
$site_root = "./";
require_once($site_root . 'includes/common.php');
require_once($site_root . 'includes/config.php');
require_once($site_root . 'includes/thumbnailing.php');


//remove slashes
if(get_magic_quotes_gpc()) {
    $gallery = stripslashes($_REQUEST["gallery"]);
    $image = stripslashes($_REQUEST["image"]);
} else {
    $gallery = $_REQUEST["gallery"];
    $image = $_REQUEST["image"];
}

$width = $_REQUEST["width"];
$height = $_REQUEST["height"];
$force = isset($_REQUEST["force"]);


if(  isset($_GET['reindex'])  ) {
	if(! isset($_REQUEST["gallery"]) ) {
		$gallery=".";
	}
	if(! isset($_REQUEST["width"]) ) {
		$width=60;
	}
	if(! isset($_REQUEST["height"]) ) {
		$height=60;
	}

	echo "Creating thumbs...";


	create_thumbs($gallery, $width, $height, $force, $childGalleries = true);
	echo "done";

} else {
    showThumb($gallery,$image, $width, $height, $force);
}



?>
