<?
require_once('class/base.php');
/*
+-------------+--------------+------+-----+---------+-------+
| Field       | Type         | Null | Key | Default | Extra |
+-------------+--------------+------+-----+---------+-------+
| attributeid | int(11)      | NO   | PRI | 0       |       |
| userid      | int(11)      | NO   | PRI | 0       |       |
| value       | varchar(255) | YES  |     | NULL    |       |
+-------------+--------------+------+-----+---------+-------+
*/

class phplist_user_user_attribute extends base {

    function phplist_user_user_attribute($id = null){
        $this->_table_name = "phplist_user_user_attribute";

        $this->_field_names = array();
        $this->_field_names [] = 'attributeid';
        $this->_field_names [] = 'userid';
        $this->_field_names [] = 'value';

        $this->_field_types = array();
        $this->_field_types['attributeid'] = array('int', "required");
        $this->_field_types['userid'] = array('int', "required");
        $this->_field_types['value'] = array('text', "");

        parent::base();

        if($id){
            $this->_get($id);
        }
    }

    function update_attribute($attributeid, $userid, $value) {
        global $db;

        $q = "UPDATE " . $this->_table_name . " SET value = '".$db->escapeSimple($value) . "' WHERE userid = ".$db->escapeSimple((int)$userid) . " AND attributeid=" . $db->escapeSimple((int)$attributeid);


        $rs = $db->query($q);
        if(DB::isError($rs)) $this->query_failed($q, $rs->getMessage());
    }



}
?>
