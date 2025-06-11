<?php
require_once('class/base.php');

/**
*

CREATE TABLE `users` (
  `id` int(11) NOT NULL auto_increment,
  `username` varchar(255) NOT NULL default '',
  `password` varchar(64) NOT NULL default '',
  `status` enum('join1','join2','expired','canceled','active') NOT NULL default 'join1',
  `name` varchar(128) NOT NULL default '',
  `address` text NOT NULL default '',
  `city` varchar(128) NOT NULL default '',
  `state` varchar(128) NOT NULL default '',
  `country` varchar(4) NOT NULL default '',
  `postcode` varchar(28) NOT NULL default '',
  `email` varchar(255) NOT NULL default '',
  `phone` varchar(32) NOT NULL default '',
  `information` text NOT NULL default '',
  `join_time` datetime NOT NULL default '0000-00-00 00:00:00',
  `expire_time` datetime NOT NULL default '0000-00-00 00:00:00',
  `last_login` datetime NOT NULL default '0000-00-00 00:00:00',
  `login_time` datetime default NULL,
  `role` enum('member','admin') NOT NULL default 'member',
  `secret` varchar(64) NOT NULL default '',
  PRIMARY KEY  (`id`),
  UNIQUE KEY `username` (`username`)
);


insert into users (username, password, email, role, secret, status) values('rene@f0o.com', '1ca106bbe33e58d930757f821cfb504b', 'rene@f0o.com', 'admin', '42', 'active');
insert into users (username, password, email, role, secret) values('admin@nathankotler.com.au', '1ca106bbe33e58d930757f821cfb504b', 'admin@nathankotler.com.au', 'admin', '42');
insert into users (username, password, email, role, secret, status) values('kathryn@alphastation.com.au', '1ca106bbe33e58d930757f821cfb504b', 'kathryn@alphastation.com.au', 'admin', '42', 'active');



* @author 
* @file users.php
*/

class users extends base {

	/**
	* users
	*
	* constructor
	*
	* @param int $id Row ID (default = null)
	*/
	function users($id = null) {
		$this->_table_name = "users";

		$this->_field_names = array();
                $this->_field_names [] = 'username';
                $this->_field_names [] = 'password';
                $this->_field_names [] = 'status';
                $this->_field_names [] = 'name';
                $this->_field_names [] = 'address';
                $this->_field_names [] = 'city';
                $this->_field_names [] = 'state';
                $this->_field_names [] = 'country';
                $this->_field_names [] = 'postcode';
                $this->_field_names [] = 'email';
                $this->_field_names [] = 'phone';
                $this->_field_names [] = 'information';
                $this->_field_names [] = 'join_time';
                $this->_field_names [] = 'expire_time';
                $this->_field_names [] = 'last_login';
                $this->_field_names [] = 'login_time';
                $this->_field_names [] = 'role';
                $this->_field_names [] = 'secret';


                $this->_field_types = array();
                //$this->_field_types[''] = array('text', "required");
                //$this->_field_types[''] = array('int', "required");
                $this->_field_types['username'] = array('text', "required");
                $this->_field_types['password'] = array('text', "required");
                $this->_field_types['status'] = array('text', "required");
                $this->_field_types['name'] = array('text', "required");
                $this->_field_types['address'] = array('text', "");
                $this->_field_types['city'] = array('text', );
                $this->_field_types['state'] = array('text', );
                $this->_field_types['country'] = array('text', );
                $this->_field_types['postcode'] = array('text', );
                $this->_field_types['email'] = array('text', "required");
                $this->_field_types['information'] = array('text', "");
                $this->_field_types['phone'] = array('text', "");
                $this->_field_types['join_time'] = array('text', "");
                $this->_field_types['expire_time'] = array('text', "");
                $this->_field_types['last_login'] = array('text', "");
                $this->_field_types['login_time'] = array('text', "");
                $this->_field_types['role'] = array('text', "required");
                $this->_field_types['secret'] = array('text', "required");



		parent::base();

		if($id){
			$this->_get($id);
		}
	}
	

        function create_edit_form_fields($id) {
            $form = "";

            if($id) {
                $row = $this->get_for_id($id);
            }

            foreach($this->_field_names as $field_name) {

                if(in_array($field_name, array('id', 'password'))) {
                    $form .= "<input type='hidden' name='" .$field_name . "'";
                    if($id){ 
                        $form .= " value='" . htmlspecialchars($row[$field_name], ENT_QUOTES) . "'";
                    }
                    $form .= ">\n";

                } else if(in_array($field_name, array('languages', 'describeyourself'))) {

                    $form .= "<tr><td>";
                    $form .= $field_name;
                    $form .= "</td><td>";

                    $form .= "<textarea name='" .$field_name . "'>";
                    if($id){ 
                        $form .= htmlspecialchars($row[$field_name], ENT_QUOTES);
                    }
                    $form .= "</textarea>\n";
                    $form .= "</td></tr>";
                } else {
                    $form .= "<tr><td>";
                    $form .= $field_name;
                    $form .= "</td><td>";

                    $form .= "<input type='text' name='" .$field_name . "'";
                    if($id){ 
                        $form .= " value='" . htmlspecialchars($row[$field_name], ENT_QUOTES) . "'";
                    }
                    $form .= ">\n";
                    $form .= "</td></tr>";

                }
            }
            return $form;
        }



        function _validate_save_more(&$d){
            $valid = true;
            if(!$d['id']) {
                $r = $this->search_for_field("username", $d['username']);
                if ($r) {
                    $this->set_message('That username has already been used.', MSG_WARN);
                    $valid = false;
                }
            }
            return $valid;
        }



}
?>
