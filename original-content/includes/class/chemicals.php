<?/* This is the sql for creating it.
CREATE TABLE chemicals (
  `id` int(11) NOT NULL auto_increment,
  `product_id` int(11) NOT NULL,
  `name` varchar(255) default NULL,
  `description` varchar(255) default NULL,
  `guaranteed` varchar(255) default NULL,
  `typical` varchar(255) default NULL,
  `active` int(11) default 1,
  PRIMARY KEY  (`id`)
);

*/
require_once('class/base.php');

class chemicals extends base {

    function chemicals($id = null){
        $this->_table_name = "chemicals";
    
	
        $this->_field_names = array();
        $this->_field_names [] = 'product_id';
        $this->_field_names [] = 'name';
        $this->_field_names [] = 'description';
        $this->_field_names [] = 'guaranteed';
        $this->_field_names [] = 'typical';
        $this->_field_names [] = 'active';

	
        $this->_field_types = array();
        $this->_field_types['product_id'] = array('int', "required");
        $this->_field_types['name'] = array('text', "");
        $this->_field_types['description'] = array('text', "");
        $this->_field_types['guaranteed'] = array('text', "");
        $this->_field_types['typical'] = array('text', "");
        $this->_field_types['active'] = array('int', "");

    

        parent::base();

        if($id) {
                $this->_get($id);
        }

    }


    function new_one($product_id) {
        $d = array('product_id'=> $product_id, 'name'=>'', 'description'=>'', 'guaranteed'=>"", 'typical'=>"", 'active'=>"1");
        $r = $this->save($d);
        return $r;
    }


}


?>
