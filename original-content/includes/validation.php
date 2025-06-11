<?

// validation functions.  each validate function returns (true/false, ""/"reason for false.")



function valid_email($e) {

    $pattern=
"/^([a-zA-Z0-9])+([\.a-zA-Z0-9_-])*@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)+/";
    if(!preg_match($pattern,$e)){
        return array(false, "Email contains invalid characters.");
    }
    if (strlen($e)>100){
        return array(false, "Email too long!");
    }

    if (strlen($e) == 0){
        return array(false, "You forgot to enter an email address.");
    }

    return array(true, "");
}

function generic_valid($v, $name) {
    if (strlen($v) == 0){
        return array(false, "You forgot to enter a " . $name . ".");
    }

    return array(true, "");
}


function all_valid($valids_array) {
    // Check if there are any invalid ones.
    foreach(array_keys($valids_array) as $v) {
        $t = $valids_array[$v];
        if ($t[0] == false) {
            return false;
        }
    }

    // all are valid!
    return true;
}

function construct_error_message($valids_array) {
    // Check if there are any invalid ones.

    $info_message = "";
    foreach(array_keys($valids_array) as $v) {
        $t = $valids_array[$v];
        if ($t[0] == false) {
            $info_message .= "$t[1]<br>";
        }
    }

    return $info_message;
}

$personal_fields = array('s_firstname', 's_lastname', 's_email', 's_streetaddr', 's_surburb', 's_postcode', 's_state', 's_country', 's_homephone', 's_officephone', 's_mobilephone');

function validate_personal_details($details_array) {
    // returns a valids array.
    global $personal_fields;

/*
    $d = array();
    $d['s_firstname'];
    $d['s_lastname'];
    $d['s_email'];
    $d['s_streetaddr'];
    $d['s_surburb'];
    $d['s_postcode'];
    $d['s_state'];
    $d['s_country'];
    $d['s_homephone'];
    $d['s_officephone'];
    $d['s_mobilephone'];
*/


    $fields = $personal_fields;



    // the full names for fields.
    $d = array();

    $d['s_firstname'] = "first name";
    $d['s_lastname'] = "last name";
    $d['s_email'] = "email";
    $d['s_streetaddr'] = "street address";
    $d['s_surburb'] = "suburb";
    $d['s_postcode'] = "postcode";
    $d['s_state'] = "state";
    $d['s_country'] = "country";
    $d['s_homephone'] = "home phone";
    $d['s_officephone'] = "office phone";
    $d['s_mobilephone'] = "mobile phone";

    $full_names = $d;


    $not_check = array('s_officephone', 's_mobilephone', 's_email');

    $valids_array = array();
    foreach($fields as $field_name) {
        if(!in_array($field_name, $not_check)) {
            $v = $details_array[$field_name];
            $name = $full_names[$field_name];
            $r = generic_valid($v, $name);
            $valids_array[$field_name] = $r;
        }
    }
    
    
    $valids_array['s_officephone'] = array(true, "");
    $valids_array['s_mobilephone'] = array(true, "");
    $valids_array['s_email'] = valid_email($details_array['s_email']);


    
    return $valids_array;
}


?>
