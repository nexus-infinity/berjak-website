<?/* This is the sql for creating it.
CREATE TABLE products (
  `id` int(11) NOT NULL auto_increment,
  `active` int(11) default 1,
  `name` varchar(255) default NULL,
  `packing_text` varchar(255) default NULL,
  `image` varchar(255) default NULL,
  `description` text default NULL,
  PRIMARY KEY  (`id`)
);
*/
require_once('class/base.php');

class products extends base {

    function products($id = null){
        $this->_table_name = "products";
    
	
        $this->_field_names = array();
        $this->_field_names [] = 'active';
        $this->_field_names [] = 'name';
        $this->_field_names [] = 'packing_text';
        $this->_field_names [] = 'image';
        $this->_field_names [] = 'description';

	
        $this->_field_types = array();
        $this->_field_types['active'] = array('int', "required");
        $this->_field_types['name'] = array('text', "required");
        $this->_field_types['packing_text'] = array('text', "required");
        $this->_field_types['image'] = array('text', "");
        $this->_field_types['description'] = array('text', "");

    

        parent::base();

        if($id){
                $this->_get($id);
        }

    }

    function new_one() {
        $d = array('active'=> '0', 'name'=>'a name', 'packing_text'=>'In about XXkg bags on approx XX tonne pallettes', 'image'=>"");
        $r = $this->save($d);
        return $r;
    }


}


?>
