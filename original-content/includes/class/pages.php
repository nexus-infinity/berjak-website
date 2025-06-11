<?
require_once('class/base.php');

/*
CREATE TABLE pages (
  `id` int(11) NOT NULL auto_increment,
  `title` varchar(255) default NULL,
  `words` text default NULL,
  `demowords` text default NULL,
  `category` text default NULL,
  `subcategory` text default NULL,
  `available` int(11) default 1,
  `ordernum` int(11) default 1,
  PRIMARY KEY  (`id`)
);
*/

class pages extends base {

    function pages($id = null){
        $this->_table_name = "pages";

        $this->_field_names = array();
        $this->_field_names [] = 'title';
        $this->_field_names [] = 'words';
        $this->_field_names [] = 'demowords';
        $this->_field_names [] = 'category';
        $this->_field_names [] = 'subcategory';
        $this->_field_names [] = 'available';
        $this->_field_names [] = 'ordernum';

        $this->_field_types = array();
        $this->_field_types['title'] = array('text', "required");
        $this->_field_types['words'] = array('text', "required");
        $this->_field_types['demowords'] = array('text', "");
        $this->_field_types['category'] = array('text', "required");
        $this->_field_types['subcategory'] = array('text', "");
        $this->_field_types['available'] = array('int', "required");
        $this->_field_types['ordernum'] = array('int', "");

        $this->categories = array('Q & A', 'Case studies', 'Articles', 'Humour');

        $s = array();


        $s['Q & A'] = array('Anxiety', 'Anger & Depression', 'Relationships', 'Addictions & Compulsions', 'Loss & Grief', 'Life Threatening Illnesses', 'Issues for Family & Friends');
        $s['Case studies'] = array('Anxiety', 'Anger & Depression', 'Relationships', 'Addictions & Compulsions', 'Loss & Grief', 'Life Threatening Illnesses', 'Issues for Family & Friends');
        
        
        $this->subcategories = $s;



        $this->available_words= array(1 => "Demo shown", 2=>"Full shown", 3=>"Only shown for members.", 4=> "Not Shown at all");

        parent::base();

        if($id){
            $this->_get($id);
        }
    }

    function new_one() {
        $d = array('words'=> 'words', 'title'=>'a title', 'demowords'=>'', 'category'=>$this->categories[0], 'subcategory'=> $this->subcategories[0], 'available'=>4, 'ordernum'=>0);
        $r = $this->save($d);
        return $r;
    }

    function get_categories($category= "") {
        global $db;		
        $order_by = "";

        $q = "SELECT * FROM " . $this->_table_name . "";
        $q .= " where category = " . "'". $db->escapeSimple($category) . "'";

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


    function get_pages_for($category= "", $subcategory = "", $title= "") {
        global $db;		
        $order_by = "ordernum desc, id";

        $q = "SELECT * FROM " . $this->_table_name . "";
        $q .= " where category = " . "'". $db->escapeSimple($category) . "'";
        if($subcategory) {
            $q .= " AND subcategory = " . "'". $db->escapeSimple($subcategory) . "'";
        }
        if($title) {
            $q .= " AND title= " . "'". $db->escapeSimple($title) . "'";
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





}
?>
