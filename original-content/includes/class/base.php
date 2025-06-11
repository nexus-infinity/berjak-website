<?php
class base {
	
	function base(){
		
            global $messages;
            
            if(is_array($_SESSION['redirect_messages'])){
                $messages = $messages + $_SESSION['redirect_messages'];
                unset($_SESSION['redirect_messages']);
            }
	}
	
			
	function query_failed($query, $error){

            $backtrace = debug_backtrace();
            var_dump($backtrace);
            //$caller = array_shift($backtrace);
            echo("<b>Query failed:</b><br/>");
            echo("<pre>$query</pre>$error<br/>");
            echo($caller['file'].':'.$caller['line']);
            
            exit(1);
	}
	

        function update_field($id, $field_name, $value, $isint = false) {
            global $db;

            if($isint) {
                $q = "UPDATE " . $this->_table_name . " SET $field_name =  ".$db->escapeSimple($value) . " WHERE id = ".$db->escapeSimple((int)$id);
            } else {
                $q = "UPDATE " . $this->_table_name . " SET $field_name =  '".$db->escapeSimple($value) . "' WHERE id = '".$db->escapeSimple($id)."'";
            }

            $rs = $db->query($q);
            if(DB::isError($rs)) $this->query_failed($q, $rs->getMessage());
        }


        function _is_text_type($sql_type) {
            // is it a text sql type.
            if(in_array($sql_type, array("text", "varchar"))) {
                return true;
            }
            if ( false !== strpos($sql_type, "varchar") ) {
                return true;
            }
            return false;
        }



	function save(&$d){
            global $db;
            
            if(!$this->_validate_save($d)){
                return false;
            }

            //Update existing
            if($d['id']){
                $q = "UPDATE " . $this->_table_name . " SET ";

                foreach($this->_field_names as $fn) {
                    if( $this->_is_text_type($this->_field_types[$fn][0]) ) {
                        $q .= $fn . " =  '".$db->escapeSimple($d[$fn])."'";
                    } else {
                        $q .= $fn . " =  ".$db->escapeSimple($d[$fn]);
                    }
                    $q .= ", ";
                }
                $q = substr($q, 0, -2);


                $q .= " WHERE id = '".$db->escapeSimple($d['id'])."'";

                $rs = $db->query($q);
                if(DB::isError($rs)) $this->query_failed($q, $rs->getMessage());

            } else {
                //New recort
                $q = "INSERT INTO " . $this->_table_name . " (";
                foreach($this->_field_names as $fn) {
                    $q .= $fn . ", ";
                }
                $q = substr($q, 0, -2);
                $q .= ") VALUES (";
                foreach($this->_field_names as $fn) {
                    if( $this->_is_text_type($this->_field_types[$fn][0]) ) {
                        $q .= "'".$db->escapeSimple($d[$fn])."'";
                    } else {
                        $q .= $db->escapeSimple($d[$fn]);
                    }
                    $q .= ", ";
                }
                $q = substr($q, 0, -2);

                $q .= ")";

                $rs = $db->query($q);
                if(DB::isError($rs)) $this->query_failed($q, $rs->getMessage());
                $d['id'] = mysql_insert_id();
            }
            
            return($d['id']);
	}



	function assign(&$d){
            foreach($this->_field_names as $fn) {
		$this->$fn = $d[$fn];
            }
            if(isset($d['id'])) {
                $this->id = $d['id'];
            }
	}




    function _validate_save(&$d){

        $valid = true;

        foreach($this->_field_names as $fn) {
            if($this->_field_types[$fn][1] == "required") {
                if($d[$fn] == ""){
                    $this->set_message('Please enter your '. $fn . '.', MSG_WARN);
                    $valid = false;
                }
            }
        }
        if($valid) {
            $valid = $this->_validate_save_more($d);
        }

        return($valid);
    }

    // this is for extra validation stuff if you need it.
    function _validate_save_more(&$d){
        return true;
    }



	/**
	* delete
	*
	* Removes a record
	*
	* @param array $d Input data
	*/
	function delete(&$d){
		global $db;
		
		if(!$this->_validate_delete($d)){
			return false;
		}
		
		$q = "DELETE FROM " . $this->_table_name . " WHERE id = ".(int)$d['id'];
		$rs = $db->query($q);
		if(DB::isError($rs)) $this->query_failed($q, $rs->getMessage());

		return true;
	}


	/**
	* _validate_delete
	*
	* Validate data passed for delete
	*
	* @param array $d Input vars
	* @private
	*/
	function _validate_delete(&$d){
	
		$valid = true;
		
		return($valid);
	}

	/**
	* _get
	*
	* Load existing record from DB
	*
	* @param int $id Row ID of record to load
	* @private
	*/
	function _get($id){
		global $db;		
	
		$q = "SELECT * FROM " . $this->_table_name . " WHERE id = ".(int)$id;
		$rs = $db->query($q);
		if(DB::isError($rs)) $this->query_failed($q, $rs->getMessage());

		
		$row = $rs->fetchRow();
		$this->assign($row);
		$this->id = $row['id'];
                $this->row = $row;
	}




	/**
	* get_for_id
	*
	* Load existing record from DB
	*
	* @param int $id Row ID of record to load
	* @private
	*/
	function get_for_id($id){
		global $db;		
	
		$q = "SELECT * FROM " . $this->_table_name . " WHERE id = ".(int)$id;
		$rs = $db->query($q);
		if(DB::isError($rs)) $this->query_failed($q, $rs->getMessage());

		
		$row = $rs->fetchRow();
                return $row;
	}

        function qsql($value) {
            global $db;
            return $db->escapeSimple($value);
        }

	function search_for_field($field_name, $value, $isint = false, $use_like = false, $all = false) {
        // search_for_field("username", "bob")
            global $db;		
	

            if($use_like) {
                $sql = "select * from " . $this->_table_name . " WHERE $field_name like ";
                $sql .="'%". $db->escapeSimple($value) . "%'";

            } else {
                $sql = "select * from " . $this->_table_name . " WHERE $field_name = ";
                if($isint) {
                    $sql .= $db->escapeSimple((int)$value);
                } else {
                    $sql .="'". $db->escapeSimple($value) . "'";
                }
            }
            $rs = $db->query($sql);
            if(DB::isError($rs)) $this->query_failed($sql, $rs->getMessage());

            if($all){
                $rows = array();
                while($row = $rs->fetchRow()) {
                    $rows[]= $row;
                }

                return $rows;
            } else {
                $row = $rs->fetchRow();
                return $row;
            }
	}


	/**
	* get_all
	*
	* returns an array of all available services.
	*
	*/
        function get_all($order_by = "", $where = "") {
		global $db;		
	
		$q = "SELECT * FROM " . $this->_table_name . "";
                if($where) {
                    $q .= " where " . $where;
                }
                if($order_by) {
                    $q .= " order by " . $order_by;
                }
		$rs = $db->query($q);
		if(DB::isError($rs)) $this->query_failed($q, $rs->getMessage());

		
                $rows = array();
                while($row = $rs->fetchRow()) {
                    $rows[]= $row;
                }

                return $rows;
        }



	function sf($var){
		
		global $vars;
		
		if($vars[$var]){
			return($vars[$var]);
		} else {
			return($this->{$var});
		}
	}
	
	function sfh($var){
		return(htmlspecialchars($this->sf($var)));
	}
	
	function set_message($text, $type = MSG_INFO){
		
		global $messages;
		
		$obj = null;
		$obj->text = $text;
		$obj->type = $type;
		
		$messages[] = $obj;
		
	}
	
	function message_html($msg){
		
		switch($msg->type){
			case MSG_INFO:
				$class = 'msg_info';
			break;
			case MSG_WARN:
				$class = 'msg_warn';
			break;
			case MSG_ERROR:
				$class = 'msg_error';
			break;
			default:
				$class = 'msg_default';
			break;
		}
		
		return("<span class=\"{$class}\">{$msg->text}</span>");
	}
}
?>
