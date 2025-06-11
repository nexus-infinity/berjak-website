<?
require_once('class/base.php');
/*
+-----------------+--------------+------+-----+-------------------+----------------+
| Field           | Type         | Null | Key | Default           | Extra          |
+-----------------+--------------+------+-----+-------------------+----------------+
| id              | int(11)      | NO   | PRI | NULL              | auto_increment |
| email           | varchar(255) | NO   | UNI |                   |                |
| confirmed       | tinyint(4)   | YES  |     | 0                 |                |
| blacklisted     | tinyint(4)   | YES  |     | 0                 |                |
| bouncecount     | int(11)      | YES  |     | 0                 |                |
| entered         | datetime     | YES  |     | NULL              |                |
| modified        | timestamp    | YES  |     | CURRENT_TIMESTAMP |                |
| uniqid          | varchar(255) | YES  | MUL | NULL              |                |
| htmlemail       | tinyint(4)   | YES  |     | 0                 |                |
| subscribepage   | int(11)      | YES  |     | NULL              |                |
| rssfrequency    | varchar(100) | YES  |     | NULL              |                |
| password        | varchar(255) | YES  |     | NULL              |                |
| passwordchanged | date         | YES  |     | NULL              |                |
| disabled        | tinyint(4)   | YES  |     | 0                 |                |
| extradata       | text         | YES  |     | NULL              |                |
| foreignkey      | varchar(100) | YES  |     | NULL              |                |
+-----------------+--------------+------+-----+-------------------+----------------+
*/


class phplist_user_user extends base {

    function phplist_user_user($id = null){
        $this->_table_name = "phplist_user_user";

        $this->_field_names = array();
        $this->_field_names [] = 'email';
        $this->_field_names [] = 'confirmed';
        $this->_field_names [] = 'blacklisted';
        $this->_field_names [] = 'bouncecount';
        $this->_field_names [] = 'entered';
        $this->_field_names [] = 'modified';
        $this->_field_names [] = 'uniqid';
        $this->_field_names [] = 'htmlemail';
        $this->_field_names [] = 'subscribepage';
        $this->_field_names [] = 'rssfrequency';
        $this->_field_names [] = 'password';
        $this->_field_names [] = 'passwordchanged';
        $this->_field_names [] = 'disabled';
        $this->_field_names [] = 'extradata';
        $this->_field_names [] = 'foreignkey';



        $this->_field_types = array();
        $this->_field_types['email'] = array('text', "required");
        $this->_field_types['confirmed'] = array('int', "required");
        $this->_field_types['blacklisted'] = array('int', "required");
        $this->_field_types['bouncecount'] = array('int', "required");
        $this->_field_types['entered'] = array('text', "required");
        $this->_field_types['modified'] = array('text', "required");
        $this->_field_types['uniqid'] = array('text', "required");
        $this->_field_types['htmlemail'] = array('int', "");
        $this->_field_types['subscribepage'] = array('int', "");
        $this->_field_types['rssfrequency'] = array('text', "");
        $this->_field_types['password'] = array('text', "");
        $this->_field_types['passwordchanged'] = array('text', "");
        $this->_field_types['disabled'] = array('int', "");
        $this->_field_types['extradata'] = array('text', "");
        $this->_field_types['foreignkey'] = array('text', "");


        parent::base();

        if($id){
            $this->_get($id);
        }
    }

    function subscribe_user() {
        global $db;

        $q = "DELETE FROM phplist_user_blacklist where email = '" . $db->escapeSimple($this->email) . "'";
        $rs = $db->query($q);
        if(DB::isError($rs)) $this->query_failed($q, $rs->getMessage());

        $q = "DELETE FROM phplist_user_blacklist_data where email = '" . $db->escapeSimple($this->email) . "'";
        $rs = $db->query($q);
        if(DB::isError($rs)) $this->query_failed($q, $rs->getMessage());


    }

    function unsubscribe_user() {
        global $db;

        $this->update_field($this->id, 'confirmed', 0, true);
        $this->update_field($this->id, 'blacklisted', 1, true);

        $q = "INSERT INTO phplist_user_blacklist (email, added) values('" . $db->escapeSimple($this->email) . "', Now())";


        $rs = $db->query($q);
        if(DB::isError($rs)) $this->query_failed($q, $rs->getMessage());


        $q = "INSERT INTO phplist_user_blacklist_data (email, name, data) values('" . $db->escapeSimple($this->email) . "', 'reason', '')";
        $rs = $db->query($q);
        if(DB::isError($rs)) $this->query_failed($q, $rs->getMessage());


        $q = "DELETE FROM phplist_listuser where userid = " . $db->escapeSimple($this->id);
        $rs = $db->query($q);
        if(DB::isError($rs)) $this->query_failed($q, $rs->getMessage());

    }


}
?>
