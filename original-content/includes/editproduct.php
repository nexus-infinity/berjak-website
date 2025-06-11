<?
session_start();
echo a,$_SESSION['logged_in'];
exit();

$site_root = "../";
include ($site_root . "/includes/common.php");
include ($site_root . "/includes/class/products.php");
include ($site_root . "/includes/class/sieve_analysis.php");
include ($site_root . "/includes/class/sieve_size.php");
include ($site_root . "/includes/class/chemicals.php");

if( !$_SESSION['logged_in'] ) {
    header("Location: login.php");
    exit;
}


$thing_name = "Product";


include("header.php");

$id = (int)$_REQUEST['id'];
$p = new products($id);


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

    $r = $p->new_one();
    if(!$r) {
        foreach($messages as $msg) {
            echo $p->message_html($msg);
        }
        die("Error creating.");
    }
    $id = $r;
    $p = new products($id);


    echo "<h1>" . $thing_name . " Created.</h1>";
    unset($_POST['submit']);
}



if($_POST['submit']) {
    $r = $p->save($vars);


    if (!$r) {
        echo "<h1>" . $thing_name . "  not! saved.</h1>";

    } else {

        $image_path = "../galleries/offers/product_" . $id . ".jpg";

        if($_FILES["theimage"]) {
            if(!move_uploaded_file($_FILES["theimage"]["tmp_name"],$image_path)) {
                //
                $erroruploading_file=1;
            }
        }


        echo "<h1>" . $thing_name . "  saved.</h1>";
    }
    echo ">>> <a href='editproduct.php?id=$id'>Edit product again.</a><br>";
    echo ">>> <a href='index.php'>Admin page.</a><br>";
    echo ">>> <a href='../'>Front page.</a><br>";


} else {





    echo "<table border='0' cellpadding='2' cellspacing='2'>";
    echo "<tr><td>";

    echo ">>> <a href='index.php'>Admin page.</a><br>";
    echo ">>> <a href='../'>Front page.</a><br>";
    echo "<br>";

    echo "<form method='POST' action='editproduct.php'>";
    echo "<input type='hidden' name='id' value='" . $p->sfh('id') . "'>";
    echo "<input type='hidden' name='delete' value='1'>";
    echo "<input type='submit' name='submit' value='Delete " . $thing_name . " '>";
    echo "</form>";

    echo "</td>";


    echo "<td>&nbsp;";
    echo "</td>";
    echo "<td>";
    echo "</td></tr></table>";





  echo "<table border='0' cellpadding='2' cellspacing='2'>";
  echo "<tr><td valign='top'>";


    echo "<form method='POST' enctype='multipart/form-data'>";
    echo "<input type='hidden' name='id' value='" . $p->sfh('id') . "'>";

    echo "<table border=0>";

    echo "<tr>";
    echo "<td></td>";
    echo "</tr>";

    echo "<tr>";
    echo "<td>Name</td>";
    echo "<td><input type='text' name='name' value='" . $p->sfh('name') . "'></td>";
    echo "</tr>";
    echo "<tr>";
    echo "<td>Packing text</td>";
    echo "<td><input type='text' name='packing_text' value='" . $p->sfh('packing_text') . "'></td>";
    echo "</tr>";

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
    echo "<td>Image(leave blank to use old image)</td>";
    echo "<td><input type='file' name='theimage'/></td>";
    echo "</tr>";

    echo "<tr>";
    echo "<td>Description</td>";
    echo "<td><textarea name='description'>" . $p->sfh('description') . "</textarea></td>";
    echo "</tr>";

    echo "<tr>";
    echo "<td></td>";
    echo "<td><input type='submit' name='submit' value='submit'></td>";
    echo "</tr>";
    echo "</table>";




    echo "</form>";


  echo "</td>";
  echo "<td>";
  echo "<img src='../galleries/offers/product_" . $p->id . ".jpg'>";
  echo "</td></tr></table>";


    // sieve_analysis is 

    echo "<form method='POST' action='editsieve_analysis.php'>";
    echo "<input type='hidden' name='new' value='1'>";
    echo "<input type='hidden' name='product_id' value='" . $p->id . "'>";
    echo "<input type='submit' name='submit' value='Create Sieve Analysis'>";
    echo "</form>";


    $sa = new sieve_analysis();
    $rows = $sa->get_all("", "product_id = " . $p->id);

    echo "<table border='1'>";

    $i = 0;
    foreach($rows as $row) {
        if($i == 0) {
            echo "<tr><td>id</td>";
            foreach(array_keys($row) as $k) {
                if($k == "id") continue;
                if($k == "product_id") continue;
                echo "<td>$k</td>";
            }
            echo "</tr>";
            $i++;
        }

        echo "<tr><td><a href='editsieve_analysis.php?id=" . $row['id'] . "'>" . $row['id'] . "</a></td>";

        foreach(array_keys($row) as $k) {
            if($k == "id") continue;
            if($k == "product_id") continue;
            echo "<td>";
            echo $row[$k];
            echo "</td>";
        }
        echo "</tr>";
    }
    echo "</table>";





    // chemicals


    echo "<form method='POST' action='editchemicals.php'>";
    echo "<input type='hidden' name='new' value='1'>";
    echo "<input type='hidden' name='product_id' value='" . $p->id . "'>";
    echo "<input type='submit' name='submit' value='Create Chemical'>";
    echo "</form>";


    $sa = new chemicals();
    $rows = $sa->get_all("", "product_id = " . $p->id);

    echo "<table border='1'>";

    $i = 0;
    foreach($rows as $row) {
        if($i == 0) {
            echo "<tr><td>id</td>";
            foreach(array_keys($row) as $k) {
                if($k == "id") continue;
                if($k == "product_id") continue;
                echo "<td>$k</td>";
            }
            echo "</tr>";
            $i++;
        }

        echo "<tr><td><a href='editchemicals.php?id=" . $row['id'] . "'>" . $row['id'] . "</a></td>";

        foreach(array_keys($row) as $k) {
            if($k == "id") continue;
            if($k == "product_id") continue;
            echo "<td>";
            echo $row[$k];
            echo "</td>";
        }
        echo "</tr>";
    }
    echo "</table>";




    // sieve_size


    echo "<form method='POST' action='editsieve_size.php'>";
    echo "<input type='hidden' name='new' value='1'>";
    echo "<input type='hidden' name='product_id' value='" . $p->id . "'>";
    echo "<input type='submit' name='submit' value='Create Sieve Size'>";
    echo "</form>";


    $sa = new sieve_size();
    $rows = $sa->get_all("", "product_id = " . $p->id);

    echo "<table border='1'>";

    $i = 0;
    foreach($rows as $row) {
        if($i == 0) {
            echo "<tr><td>id</td>";
            foreach(array_keys($row) as $k) {
                if($k == "id") continue;
                if($k == "product_id") continue;
                echo "<td>$k</td>";
            }
            echo "</tr>";
            $i++;
        }

        echo "<tr><td><a href='editsieve_size.php?id=" . $row['id'] . "'>" . $row['id'] . "</a></td>";

        foreach(array_keys($row) as $k) {
            if($k == "id") continue;
            if($k == "product_id") continue;
            echo "<td>";
            echo $row[$k];
            echo "</td>";
        }
        echo "</tr>";
    }
    echo "</table>";




}


include("footer.php");

?>
