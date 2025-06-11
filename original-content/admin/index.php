<?

//session_start();
$site_root = "../";
include ($site_root . "/includes/session_stuff.php");
include ($site_root . "/includes/common.php");
include ($site_root . "/includes/class/products.php");

$secret = 'made007';

// admin index page.

// shows a list of available pages.


if( $_POST['password'] == $secret && $_POST['username'] == 'admin') {
  $_SESSION['logged_in'] = true;
  set_login();
	
}

if( $_GET['logout'] == "z") {
set_logout();
    $_SESSION['logged_in'] = false;
    header("Location: login.php");
    exit;
}



if( valid_login()!=1) {
    // show login page.
    //echo "here";
    header("Location: login.php");
    exit();
}

include("header.php");


//echo session_register('logged_in');
$p = new products((int)$id);

$rows = $p->get_all();

echo "<h1>Products </h1>";
echo ">>> <a href='index.php'>Admin page.</a><br>";
echo ">>> <a href='../'>Front page.</a><br>";
echo "<br><br>";

echo "<form method='POST' action='editproduct.php'>";
echo "<input type='hidden' name='new' value='1'>";
echo "<input type='submit' name='submit' value='Create Product'>";
echo "</form>";

echo "<br><br>";

foreach($rows as $row) {
    echo "<a href='editproduct.php?id=" . $row['id'] . "'>" . $row['id'] . ". " . $row['name'] . "</a>";
    echo "<br>";
}


echo "<br><br>";
echo "<a href='index.php?logout=z'>Logout</a>";

include("footer.php");
?>
