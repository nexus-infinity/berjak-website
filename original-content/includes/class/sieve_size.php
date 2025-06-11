<?/* This is the sql for creating it.
CREATE TABLE sieve_size (
  `id` int(11) NOT NULL auto_increment,
  `product_id` int(11) NOT NULL,
  `plus_minus_num` varchar(255) default NULL,
  `other_num` varchar(255) default NULL,
  `active` int(11) default 1,
  PRIMARY KEY  (`id`)
);
*/
require_once('class/base.php');

class sieve_size extends base {

    function sieve_size($id = null){
        $this->_table_name = "sieve_size";
    
	
        $this->_field_names = array();
        $this->_field_names [] = 'product_id';
        $this->_field_names [] = 'plus_minus_num';
        $this->_field_names [] = 'other_num';
        $this->_field_names [] = 'active';

	
        $this->_field_types = array();
        $this->_field_types['product_id'] = array('int', "required");
        $this->_field_types['plus_minus_num'] = array('text', "");
        $this->_field_types['other_num'] = array('text', "");
        $this->_field_types['active'] = array('int', "");

    

        parent::base();

        if($id){
                $this->_get($id);
        }

    }

    function new_one($product_id) {
        $d = array('product_id'=> $product_id, 'plus_minus_num'=>'', 'other_num'=>'', 'active'=>"1");
        $r = $this->save($d);
        return $r;
    }



}

?>
