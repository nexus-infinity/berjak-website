<?/* This is the sql for creating it.

CREATE TABLE sieve_analysis (
  `id` int(11) NOT NULL auto_increment,
  `product_id` int(11) NOT NULL,
  `aperture_microns` varchar(255) default NULL,
  `retained` varchar(255) default NULL,
  `cumulative_retained` varchar(255) default NULL,
  `active` int(11) default 1,
  PRIMARY KEY  (`id`)
);

*/
require_once('class/base.php');

class sieve_analysis extends base {

    function sieve_analysis($id = null){
        $this->_table_name = "sieve_analysis";
    
	
        $this->_field_names = array();
        $this->_field_names [] = 'product_id';
        $this->_field_names [] = 'aperture_microns';
        $this->_field_names [] = 'retained';
        $this->_field_names [] = 'cumulative_retained';
        $this->_field_names [] = 'active';

	
        $this->_field_types = array();
        $this->_field_types['product_id'] = array('int', "required");
        $this->_field_types['aperture_microns'] = array('text', "");
        $this->_field_types['retained'] = array('text', "");
        $this->_field_types['cumulative_retained'] = array('text', "");
        $this->_field_types['active'] = array('int', "");

    

        parent::base();

        if($id){
                $this->_get($id);
        }

    }

    function new_one($product_id) {
        $d = array('product_id'=> $product_id, 'aperture_microns'=>'', 'retained'=>'', 'cumulative_retained'=>"", 'active'=>"1");
        $r = $this->save($d);
        return $r;
    }


    }?>
