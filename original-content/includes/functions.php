<?

// TODO: 
//   check login/role.
//   add user.
//   list restricted files from a given directory.
//   download files.


function qhtm($s) {
    return htmlentities($s, ENT_QUOTES);
}



function check_access_for_roles($db, $username, $roles) {
    // returns true if they have access to the role.
    // roles - an array of roles that are valid.
    
    
    $results = $db->query("SELECT username, role FROM users WHERE username = " . $db->quoteSmart($username) );
    
    if(DB::isError($results) || $results->numRows() != 1) {
        // username is not a valid user.
        return false;
    }
    
    $u= $results->fetchRow();

    if ( in_array($u['role'], $roles) ) {
        return true;
    } else {
        return false;
    }


}



function mimeTypes($file) {
   if (!is_file($file) || !is_readable($file)) return false;
   $types = array();
   $fp = fopen($file,"r");
   while (false != ($line = fgets($fp,4096))) {
       if (!preg_match("/^\s*(?!#)\s*(\S+)\s+(?=\S)(.+)/",$line,$match)) continue;
       $tmp = preg_split("/\s/",trim($match[2]));
       foreach($tmp as $type) $types[strtolower($type)] = $match[1];
   }
   fclose ($fp);
  
   return $types;
}


function show_file($fullpath, $base_path = "/home/rene/mystuff/business/client_stuff/rocco/endycode/restricted_files/") {
    // shows the file of the full_path given.
    global $site_root;
    $fullpath = $base_path . $fullpath;

    # read the mime-types
    $mimes = mimeTypes($site_root . '../mime.types');

    $ext = array_pop(explode(".",$fullpath));

    if (!file_exists($fullpath)) {
        echo "file does not exist";
        return;
    }

    # use them ($ext is the extension of your file)
    if (isset($mimes[$ext])) {
        header("Content-Type: ".$mimes[$ext]);
    }

    header("Content-Length: ".@filesize($fullpath));
    readfile($fullpath);
}



//-----------------------------------------
//  thumbnail stuff.


function display_jpgs($base_path, $is_admin = false, $base_url = "") {
    // displays thumb nails of all the jpgs.

    // get directory listing.

    if ($dh = opendir($base_path)) {

        $output =  '<table border="0" cellspacing="0" cellpadding="1">';

        while (($file = readdir($dh)) !== false) {
            if(is_file($base_path . $file)) {
                // check if it is a .jpg/.jpeg.  If so print thumbnail.

                $ext = array_pop(explode(".", $base_path . $file));

                if ( in_array($ext, array("jpg", "jpeg")) )  {
                    //echo "filename: $file : filetype: " . filetype($base_path . $file) . "\n";

                    // get thumbnail.
                    //create_thumbnail($base_path, $file, $base_path . "/thumbs/");
                    $f = urlencode($file);
                    //$image_path = '<img src="list.php?mode=downloadthumb&i=""';
                    //echo '<img src="list.php?mode=downloadthumb&i="';
                    $image_path = '<img border=0 height="60" width="60" src="' .$base_url . 'list.php?mode=downloadthumb&i=' . $f . '">';
                    $big_image_path = '<a href="' .$base_url . 'list.php?mode=download&i=' . $f . '" target="_blank">' . $image_path . "</a>";

                    $output .= '<tr><td align="right" valign="middle" class="text">';
                    // a description could go here.
                    $output .= '&nbsp;';
                    $output .= '</td><td width="30" align="right" valign="middle" class="text">';
                    $output .= $big_image_path;
                    $output .= '</td>';


                    if($is_admin) {
                        // show a delete form button.
                        $output .= '<td><form action="' . $_SERVER['PHP_SELF'] . '" method="POST"> <input name="submit" type="submit" value="delete" /> <input type="hidden" name="mode" value="delete" /> <input type="hidden" name="filename" value="' . $file . '" /> </form> </td>';

                    }

                    $output .= '</tr>';

                }
            }
        }

        $output .= '</table>';

        closedir($dh);
    }

    echo $output;

}

function display_pdfs($base_path, $is_admin = false, $base_url = "") {

    // get directory listing.

    if ($dh = opendir($base_path)) {
        while (($file = readdir($dh)) !== false) {
            if(is_file($base_path . $file)) {
                // check if it is a .jpg/.jpeg.  If so print thumbnail.

                $ext = array_pop(explode(".", $base_path . $file));

                if ( in_array($ext, array("pdf")) )  {
                    //echo "filename: $file : filetype: " . filetype($base_path . $file) . "\n";

                    // get thumbnail.
                    //create_thumbnail($base_path, $file, $base_path . "/thumbs/");
                    $f = urlencode($file);
                    //$image_path = '<img src="list.php?mode=downloadthumb&i=""';
                    //echo '<img src="list.php?mode=downloadthumb&i="';
                    $link = '<a href="' .$base_url . 'list.php?mode=download&i=' . $f . '" class="text">' . $file . '<img src="../images/pdf_icon.gif" border="0"></a>';
                    //$image_path .= "asdf";
                    //$image_path .= '"">';

                    //var_dump($image_path);
                    echo $link;
                    if($is_admin) {
                        // show a delete form button.
                        ?>
                          <form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="POST">
                              <input name="submit" type="submit" value="delete" />
                              <input type="hidden" name="mode" value="delete" />
                              <input type="hidden" name="filename" value="<? echo $file ?>" />
                          </form>
                        <?

                    }
                    echo "<br>";

                }
            }
        }
        closedir($dh);
    }

}

function create_thumbnails($base_path) {
    // creates thumbnails for all the jpegs.
    
    if ($dh = opendir($base_path)) {
        while (($file = readdir($dh)) !== false) {
            if(is_file($base_path . $file)) {
                // check if it is a .jpg/.jpeg.  If so print thumbnail.

                $ext = array_pop(explode(".", $base_path . $file));

                if ( in_array($ext, array("jpg", "jpeg")) )  {
                    // create a thumbnail.
                    create_thumbnail($base_path, $file, $base_path . "/thumbs/");
                }
            }
        }
        closedir($dh);
    }
}




function create_thumbnail($base_path, $filename, $save_path) {
    $new_width = 60;
    $new_height = 60;

    $tmp_image=imagecreatefromjpeg($base_path . $filename);
    $width = imagesx($tmp_image);
    $height = imagesy($tmp_image);
    $new_image = imagecreatetruecolor($new_width,$new_height);
    //ImageCopyResized($new_image, $tmp_image,0,0,0,0, $new_width, $new_height, $width, $height);
    ImageCopyResampled($new_image, $tmp_image,0,0,0,0, $new_width, $new_height, $width, $height);
    //Grab new image
    ob_start();
    ImageJPEG($new_image);
    $image_buffer = ob_get_contents();
    ob_end_clean();
    ImageDestroy($new_image);

    //Create temporary file and write to it
    $fp = fopen($save_path . $filename, "wb");
    fwrite($fp, $image_buffer);
    fclose($fp);
}


function page_header_frame() {
    ?>
    <html>
    <head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
    <link rel="stylesheet" href="../style.css" type="text/css">
    </head>
    <body>
    <table border="0" cellspacing="0" cellpadding="2" height="100%" width="100%">
      <tr>
        <td valign="top" align="right">
    <?
}


function page_footer_frame() {
    ?>
        
        </td>
      </tr>
    </table>
    </body>
    </html>
    <?
}


function countries(){
	
	return(array('AF'=>'Afghanistan',
'AL'=>'Albania',
'DZ'=>'Algeria',
'AS'=>'American Samoa',
'AD'=>'Andorra',
'AO'=>'Angola',
'AI'=>'Anguilla',
'AQ'=>'Antarctica',
'AG'=>'Antigua And Barbuda',
'AR'=>'Argentina',
'AM'=>'Armenia',
'AW'=>'Aruba',
'AU'=>'Australia',
'AT'=>'Austria',
'AZ'=>'Azerbaijan',
'BS'=>'Bahamas',
'BH'=>'Bahrain',
'BD'=>'Bangladesh',
'BB'=>'Barbados',
'BY'=>'Belarus',
'BE'=>'Belgium',
'BZ'=>'Belize',
'BJ'=>'Benin',
'BM'=>'Bermuda',
'BT'=>'Bhutan',
'BO'=>'Bolivia',
'BA'=>'Bosnia And Herzegowina',
'BW'=>'Botswana',
'BV'=>'Bouvet Island',
'BR'=>'Brazil',
'IO'=>'British Indian Ocean Ter.',
'BN'=>'Brunei Darussalam',
'BG'=>'Bulgaria',
'BF'=>'Burkina Faso',
'BI'=>'Burundi',
'KH'=>'Cambodia',
'CM'=>'Cameroon',
'CA'=>'Canada',
'CV'=>'Cape Verde',
'KY'=>'Cayman Islands',
'CF'=>'Central African Republic',
'TD'=>'Chad',
'CL'=>'Chile',
'CN'=>'China',
'CX'=>'Christmas Island',
'CC'=>'Cocos (Keeling) Islands',
'CO'=>'Colombia',
'KM'=>'Comoros',
'CG'=>'Congo',
'CD'=>'Congo, The Dem. Rep. Of',
'CK'=>'Cook Islands',
'CR'=>'Costa Rica',
'CI'=>'Cote D\'Ivoire',
'HR'=>'Croatia (Hrvatska)',
'CU'=>'Cuba',
'CY'=>'Cyprus',
'CZ'=>'Czech Republic',
'DK'=>'Denmark',
'DJ'=>'Djibouti',
'DM'=>'Dominica',
'DO'=>'Dominican Republic',
'TP'=>'East Timor',
'EC'=>'Ecuador',
'EG'=>'Egypt',
'SV'=>'El Salvador',
'GQ'=>'Equatorial Guinea',
'ER'=>'Eritrea',
'EE'=>'Estonia',
'ET'=>'Ethiopia',
'FK'=>'Falkland Islands (Malvinas)',
'FO'=>'Faroe Islands',
'FJ'=>'Fiji',
'FI'=>'Finland',
'FR'=>'France',
'FX'=>'France, Metropolitan',
'GF'=>'French Guiana',
'PF'=>'French Polynesia',
'TF'=>'French Southern Ter.',
'GA'=>'Gabon',
'GM'=>'Gambia',
'GE'=>'Georgia',
'DE'=>'Germany',
'GH'=>'Ghana',
'GI'=>'Gibraltar',
'GR'=>'Greece',
'GL'=>'Greenland',
'GD'=>'Grenada',
'GP'=>'Guadeloupe',
'GU'=>'Guam',
'GT'=>'Guatemala',
'GN'=>'Guinea',
'GW'=>'Guinea-Bissau',
'GY'=>'Guyana',
'HT'=>'Haiti',
'HM'=>'Heard & Mc Donald Isl.',
'VA'=>'Holy See',
'HN'=>'Honduras',
'HK'=>'Hong Kong',
'HU'=>'Hungary',
'IS'=>'Iceland',
'IN'=>'India',
'ID'=>'Indonesia',
'IR'=>'Iran (Islamic Republic Of)',
'IQ'=>'Iraq',
'IE'=>'Ireland',
'IL'=>'Israel',
'IT'=>'Italy',
'JM'=>'Jamaica',
'JP'=>'Japan',
'JO'=>'Jordan',
'KZ'=>'Kazakhstan',
'KE'=>'Kenya',
'KI'=>'Kiribati',
'KP'=>'Korea, Dem. Ppls\' Rep.',
'KR'=>'Korea, Republic Of',
'KW'=>'Kuwait',
'KG'=>'Kyrgyzstan',
'LA'=>'Lao Ppl\'s Dem. Rep.',
'LV'=>'Latvia',
'LB'=>'Lebanon',
'LS'=>'Lesotho',
'LR'=>'Liberia',
'LY'=>'Libyan Arab Jamahiriya',
'LI'=>'Liechtenstein',
'LT'=>'Lithuania',
'LU'=>'Luxembourg',
'MO'=>'Macau',
'MK'=>'Macedonia',
'MG'=>'Madagascar',
'MW'=>'Malawi',
'MY'=>'Malaysia',
'MV'=>'Maldives',
'ML'=>'Mali',
'MT'=>'Malta',
'MH'=>'Marshall Islands',
'MQ'=>'Martinique',
'MR'=>'Mauritania',
'MU'=>'Mauritius',
'YT'=>'Mayotte',
'MX'=>'Mexico',
'FM'=>'Micronesia, Fed. States Of',
'MD'=>'Moldova, Republic Of',
'MC'=>'Monaco',
'MN'=>'Mongolia',
'MS'=>'Montserrat',
'MA'=>'Morocco',
'MZ'=>'Mozambique',
'MM'=>'Myanmar',
'NA'=>'Namibia',
'NR'=>'Nauru',
'NP'=>'Nepal',
'NL'=>'Netherlands',
'AN'=>'Netherlands Antilles',
'NC'=>'New Caledonia',
'NZ'=>'New Zealand',
'NI'=>'Nicaragua',
'NE'=>'Niger',
'NG'=>'Nigeria',
'NU'=>'Niue',
'NF'=>'Norfolk Island',
'MP'=>'Northern Mariana Islands',
'NO'=>'Norway',
'OM'=>'Oman',
'PK'=>'Pakistan',
'PW'=>'Palau',
'PA'=>'Panama',
'PG'=>'Papua New Guinea',
'PY'=>'Paraguay',
'PE'=>'Peru',
'PH'=>'Philippines',
'PN'=>'Pitcairn',
'PL'=>'Poland',
'PT'=>'Portugal',
'PR'=>'Puerto Rico',
'QA'=>'Qatar',
'RE'=>'Reunion',
'RO'=>'Romania',
'RU'=>'Russian Federation',
'RW'=>'Rwanda',
'KN'=>'Saint Kitts And Nevis',
'LC'=>'Saint Lucia',
'VC'=>'Saint Vincent / Grenadines',
'WS'=>'Samoa',
'SM'=>'San Marino',
'ST'=>'Sao Tome And Principe',
'SA'=>'Saudi Arabia',
'SN'=>'Senegal',
'SC'=>'Seychelles',
'SL'=>'Sierra Leone',
'SG'=>'Singapore',
'SK'=>'Slovakia (Slovak Republic)',
'SI'=>'Slovenia',
'SB'=>'Solomon Islands',
'SO'=>'Somalia',
'ZA'=>'South Africa',
'ES'=>'Spain',
'LK'=>'Sri Lanka',
'SH'=>'St. Helena',
'PM'=>'St. Pierre And Miquelon',
'SD'=>'Sudan',
'SR'=>'Suriname',
'SJ'=>'Svalbard & Jan Mayen',
'SZ'=>'Swaziland',
'SE'=>'Sweden',
'CH'=>'Switzerland',
'SY'=>'Syrian Arab Republic',
'TW'=>'Taiwan, Rep. Of China',
'TJ'=>'Tajikistan',
'TZ'=>'Tanzania, Un. Rep.',
'TH'=>'Thailand',
'TG'=>'Togo',
'TK'=>'Tokelau',
'TO'=>'Tonga',
'TT'=>'Trinidad And Tobago',
'TN'=>'Tunisia',
'TR'=>'Turkey',
'TM'=>'Turkmenistan',
'TC'=>'Turks And Caicos Islands',
'TV'=>'Tuvalu',
'UG'=>'Uganda',
'UA'=>'Ukraine',
'AE'=>'United Arab Emirates',
'GB'=>'United Kingdom',
'US'=>'United States',
'UY'=>'Uruguay',
'UZ'=>'Uzbekistan',
'VU'=>'Vanuatu',
'VE'=>'Venezuela',
'VN'=>'Viet Nam',
'VG'=>'Virgin Isl. (British)',
'VI'=>'Virgin Isl. (U.S.)',
'WF'=>'Wallis And Futuna',
'EH'=>'Western Sahara',
'YE'=>'Yemen',
'YU'=>'Yugoslavia',
'ZM'=>'Zambia',
'ZW'=>'Zimbabwe'));
}


function get_heights(){
    $heights = array();
    for($i=145; $i < 210; $i++) {
        $heights[] = $i . "cm";
    }
    return $heights;
}

function get_eyes(){
    $eyes = array();
    $eyes[]= 'blue';
    $eyes[]= 'brown';
    $eyes[]= 'green';
    $eyes[]= 'hazel';
    $eyes[]= 'grey';
    $eyes[]= 'black';
    
    return $eyes;
}

function get_busts(){
    $busts = array();
    for($i=32; $i < 46; $i += 0.5) {
        $busts[] = $i . '"';
    }
    return $busts;
}

function get_waists(){
    $waists = array();
    for($i=22; $i < 36; $i += 0.5) {
        $waists[] = $i . '"';
    }
    return $waists;
}

function get_hips(){
    $hips = array();
    for($i=32; $i < 46; $i += 0.5) {
        $hips[] = $i . '"';
    }
    return $hips;
}

function get_hairs(){
    $hairs = array();
    $hairs['blonde']= 'blonde';
    $hairs['brown']= 'brown';
    $hairs['red']= 'red';
    $hairs['lightbrown']= 'light brown';
    $hairs['black']= 'black';
    $hairs['other']= 'other';
    
    return $hairs;
}


function get_services() {
    die('this is an old function... need to get from db.');
    $services = array();
    $services['filmtelevision']= 'Film & Television';
    $services['modelling']= 'Modelling';
    $services['advertisements']= 'Advertisements';
    $services['promotionalwork']= 'Promotional Work';
    //$services['']= '';
    return $services;
}

function stripslashes_array($array){
	
	if(is_array($array)){
		foreach($array as $key=>$val){			
			if(is_array($val)){				
				$array[$key] = stripslashes_array($val);
			} else {
				$array[$key] = stripslashes($val);
			}
		}
	}
	
	return($array);
}

function redirect($url){
	
	global $messages;
	$_SESSION['redirect_messages'] = $messages;
	
	header('Location: '.$url);
	exit();
}



function email_confirmation($secret, $email) {

    $email_good = false;
    $base_url = "";

    $message = "A request has been made for you to join the mailing list.";
    $message .= "\r\n\r\n";
    $message .= "Please click the following link in order to join.";
    $message .= "\r\n\r\n";
    $message .= $base_url;
    $message .= "mailinglist_content.php?c=1&s=" . $secret;
    $message .= "\r\n\r\n";

    $email_to = $email;
    $email_cc = '';

    $email_subject = 'Confirmation for joining mailing list.';



    $email_from = "info@f0o.com";


    if(!preg_match('/^[a-z0-9\-\_\.]+@[a-z0-9\-\_\.]+\.[a-z]+$/i', $email_from)){
        $error_message= "The email you have entered is invalid.<br>";
    } else {


        $headers = "";
        $headers .= "From: " . $email_from . "\r\n";
        if($email_cc) {
            $headers .= "CC: " . $email_cc. "\r\n";
        }

        $r = mail($email_to,$email_subject,$message,$headers);
        if(!$r) {
            $error_message= "Tried to send your contact email, however there was a problem sending. Please try again later, or try contacting us otherwise.<br>";
        } else {
            $email_good = true;
        }
    }


    return $email_good;
}


function get_advert_links(&$sg, $max_links) {
    // returns an array of three advert links.  html.
    //$sg = new rTopGallery();

    $r = array();
    $i = 0;

    for($index = $sg->startat; $index < $sg->gallerySelectedImagesCount()+$sg->startat; $index++) {
        // only show the maximum given.
        if ($i > $max_links) { break; }


        $thehtml = "";
        $linkto = $sg->gallery->images[$index]->artist;

        if($linkto) {
            $thehtml .= "<a href='" . $linkto . "'>";
        }

        $thehtml .= $sg->imageThumbnailImage($index);

        if($linkto) {
            $thehtml .= "</a>";
        }


        $r[]= $thehtml;
        $i++;
    }

    return $r;

}



function get_featured_member_link(&$sg) {
    // returns an array of three advert links.  html.
    //$sg = new rTopGallery();

    $r = array();
    $i = 0;

    for($index = $sg->startat; $index < $sg->gallerySelectedImagesCount()+$sg->startat; $index++) {
        // only show the maximum given.
        if ($i > 1) { break; }


        $thehtml = "";
        $linkto = $sg->gallery->images[$index]->artist;

        if($linkto) {
            $thehtml .= "<a href='" . $linkto . "'>";
        }

        $thehtml .= $sg->imageThumbnailImage($index);

        if($linkto) {
            $thehtml .= "</a>";
        }


        $r[]= $thehtml;
        $i++;
    }

    return $r;

}



function make_gallery($galleryID) {
    global $site_root;
    $r = mkdir($site_root . "galleries/" . $galleryID);
    return $r;
}


?>
