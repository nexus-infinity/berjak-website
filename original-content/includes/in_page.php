<?

$site_root = "./";
include ($site_root . "/includes/common.php");
require_once($site_root . 'includes/session_stuff.php');
include ($site_root . "/includes/class/pages.php");


function show_page($id) {

    if($id) {
        // Get defaults
        $page = new pages((int)$id);
        $defaults = $page->row;
    } else {
        $defaults = array('words'=>'No page found.', 'title'=>'No page found.');
    }

    echo $defaults['words'];
}


// searches for a string, and shows that page.
function get_page_for_string(&$page, $category, $subcategory, $title) {
    
    $s = str_replace(".html", "", $s);
    $s = str_replace(".htm", "", $s);
    $parts = explode("-", $s);

    $to_search = implode(" ", $parts);


    $rows = $page->get_pages_for($category, $subcategory, $title);
    if($rows) {
        return $rows[0];
    } else {
        return $rows;
    }
}



function get_category_html() {
    
    $page = new pages();

    $categories = array();
    foreach($page->categories as $category) {
        $categories[$category] = $page->get_categories($category);
    }



    // returns html for the categories.
    $r = '<table width="100%" border="0" cellpadding="0" cellspacing="0">';




	foreach($page->categories as $cat) {
	    
	    $r .= '<tr>';
            if(in_array($cat, array("Articles", "Humour"))) {
                $r .= '  <td width="163" height="28" class="leftmenuHead"><a href="' . qhtm($cat) .'">' . qhtm($cat) . '</a></td></tr>';
            } else {
                $r .= '  <td width="163" height="28" class="leftmenuHead">' . qhtm($cat) .' v </td></tr>';
            }
	    if(in_array($cat, array('Q & A', 'Case studies') )) {
		$r .= '<tr><td height="155" valign="top" class="leftmenuSub"><p>';

		foreach($page->subcategories[$cat] as $sub) {
		    $parts = explode(" ", $sub);
		    $sub_url = implode("-", $parts);

		    $parts = explode(" ", $cat);
		    $cat_url = implode("-", $parts);

		    $url = urlencode($cat_url . "__" . $sub_url);

		    $r .= '<a href="' . $url . '">' . qhtm($sub) . '</a><br>';
		}
		$r .= '</p></td></tr>';
	    }
	}

	$r .= '</table>';

	return $r;
}



function get_category_htmlOLD() {
    
    $page = new pages();

    $categories = array();
    foreach($page->categories as $category) {
        $categories[$category] = $page->get_categories($category);
    }

	// returns html for the categories.
	$r = '<table width="100%" border="0" cellpadding="0" cellspacing="0">';

	foreach(array_keys($categories) as $cat) {
	    
	    $r .= '<tr>';
	    $r .= '  <td width="163" height="28" class="leftmenuHead">' . qhtm($cat) .'</td></tr>';
	    if($categories[$cat]) {
		$r .= '<tr><td height="155" valign="top" class="leftmenuSub"><p>';

		foreach($categories[$cat] as $row) {
		    $parts = explode(" ", $row['title']);
		    $url = implode("-", $parts);
		    $r .= '<a href="' . $url . '">' . qhtm($row['title']) . '</a><br>';
		}
		$r .= '</p></td></tr>';
	    }
	}

	$r .= '</table>';

	return $r;
}

function create_url($category = "", $subcategory = "", $title) {

    $parts = explode(" ", $title);
    $title_part = implode("-", $parts);

    $parts = explode(" ", $subcategory);
    $sub_url = implode("-", $parts);

    $parts = explode(" ", $category);
    $cat_url = implode("-", $parts);

    $url = urlencode($cat_url . "__" . $sub_url . "__" . $title_part);
    return $url;
    //$r .= '<a href="' . $url . '">' . qhtm($sub) . '</a><br>';
}


?>
