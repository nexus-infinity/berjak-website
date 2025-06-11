<?


$host_specific= array();





class rConfig {


    function rConfig() {
        global $host_specific;


        $this->pathto_galleries = "galleries/";
        $this->pathto_templates = "templates/";
        $this->pathto_data_dir  = "data/";
        $this->pathto_admin_template = "templates/admin/";


        $this->default_template = "default";
        $this->recognised_extensions = "jpeg|jpg|jpe|png|gif|bmp|tif|tiff";



        $this->thumb_number_album = 30;
        $this->thumb_number_gallery = 30;

        $this->thumb_width_album= 60;
        $this->thumb_height_album= 60;
        $this->thumb_force_size_image = 0;
        $this->thumb_force_size_album= 0;
        $this->thumb_force_size_gallery= 0;

        $this->thumb_width_image= 60;
        $this->thumb_height_image= 60;

        $this->thumb_width_gallery= 60;
        $this->thumb_height_gallery= 60;


        $this->upload_overwrite = 1;

        $this->progressive_thumbs = 0;
        $this->remove_jpeg_profile = 0;

        $this->thumbnail_quality = 80;
        $this->thumbnail_software = "gd2";

        $this->umask = 0;

        $this->gallery_name = "";
        $this->site_name = "";
        $this->enable_iifn = false;
    }
}


?>
