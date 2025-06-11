<?
session_start();

$site_root = "../";
include ($site_root . "/includes/session_stuff.php");
include ($site_root . "/includes/common.php");
include ($site_root . "/includes/class/sieve_size.php");



if( valid_login()!=1) {
    header("Location: login.php");
    exit;
}


$thing_name = "Sieve Size";


include("header.php");

$id = (int)$_REQUEST['id'];
$p = new sieve_size($id);


if($_POST['delete']) {

    $d = array('id'=>$id);
    $r = $p->delete($d);
    if(!$r) {
        die("Error deleting.");
    }


    echo "<h1>" . $thing_name . " Deleted.</h1>";
    echo ">>> <a href='index.php'>Admin page.</a><br>";
    echo ">>> <a href='../'>Front page.</a><br>";
    echo "<br>";

    include("footer.php");
    exit;

} else if($_POST['new']) {

    $r = $p->new_one($_POST['product_id']);
    if(!$r) {
        foreach($messages as $msg) {
            echo $p->message_html($msg);
        }
        die("Error creating.");
    }
    $id = $r;
    $p = new sieve_size($id);



    echo "<h1>" . $thing_name . " Created.</h1>";
    unset($_POST['submit']);
}


$product_id= (int)$_REQUEST['product_id'];

if($_POST['submit']) {
    $r = $p->save($vars);
    if (!$r) {
        echo "<h1>" . $thing_name . "  **not!** saved.</h1>";

    } else {
        echo "<h1>" . $thing_name . "  saved.</h1>";
    }

    echo "<form method='POST' action='editsieve_size.php'>";
    echo "<input type='hidden' name='new' value='1'>";
    echo "<input type='hidden' name='product_id' value='" . $product_id . "'>";
    echo "<input type='submit' name='submit' value='Create another " . $thing_name . "'>";
    echo "</form>";


    echo ">>> <a href='editproduct.php?id=$product_id'>Edit Product.</a><br>";
    echo ">>> <a href='editsieve_size.php?id=$id'>Edit " . $thing_name . " again.</a><br>";
    echo ">>> <a href='index.php'>Admin page.</a><br>";
    echo ">>> <a href='../'>Front page.</a><br>";


} else {




    echo "<form method='POST'>";
    echo "<input type='hidden' name='id' value='" . $p->sfh('id') . "'>";
    echo "<input type='hidden' name='product_id' value='" . $p->sfh('product_id') . "'>";

    echo "<table border=0>";

    echo "<tr>";
    echo "<td>Active</td>";
    echo "<td><select name='active'>";
    if($p->active) {
        $active = 1;
        $active_word = "Yes";
    } else {
        $active = 0;
        $active_word = "No";
    }
    echo "<option value='" . $active . "'>" . $active_word . "</option>";

    if($p->active) {
        $active = 0;
        $active_word = "No";
    } else {
        $active = 1;
        $active_word = "Yes";
    }
    echo "<option value='" . $active . "'>" . $active_word . "</option>";
    echo "</select></td>";
    echo "</tr>";

    echo "<tr>";
    echo "<td>First Number</td>";
    echo "<td><input type='text' name='plus_minus_num' value='" . $p->sfh('plus_minus_num') . "'></td>";
    echo "<td>eg.  + 60 or - 200</td>";
    echo "</tr>";

    echo "<tr>";
    echo "<td>Second Number</td>";
    echo "<td><input type='text' name='other_num' value='" . $p->sfh('other_num') . "'></td>";
    echo "<td>eg.  0.1</td>";
    echo "</tr>";


    echo "<tr>";
    echo "<td></td>";
    echo "<td align='right'><input type='submit' name='submit' value='submit'></td>";
    echo "<td></td>";
    echo "</tr>";
    echo "</table>";




    echo "</form>";



    echo "<table border='0' cellpadding='2' cellspacing='2'>";
    echo "<tr><td>";

    echo ">>> <a href='editproduct.php?id=" . $p->sfh('product_id') . "'>Edit Product.</a><br>";
    echo ">>> <a href='index.php'>Admin page.</a><br>";
    echo ">>> <a href='../'>Front page.</a><br>";
    echo "<br>";

    echo "<form method='POST' action='editsieve_size.php'>";
    echo "<input type='hidden' name='id' value='" . $p->sfh('id') . "'>";
    echo "<input type='hidden' name='delete' value='1'>";
    echo "<input type='submit' name='submit' value='Delete " . $thing_name . " '>";
    echo "</form>";

    echo "</td>";


    echo "<td>&nbsp;";
    echo "</td>";
    echo "<td>";
    echo "</td></tr></table>";
}


include("footer.php");

?>
