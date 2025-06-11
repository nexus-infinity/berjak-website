<?php

//require the PEAR::DB classes.

include("DB.php");

if(in_array($_SERVER['HTTP_HOST'], array('www.berjak.com.au', 'berjak.com.au') )) {

    $dsn = array(
        'phptype'  => "mysql",
        'hostspec' => "localhost",
        'database' => "berjak",
        'username' => "berjak",
        'password' => "kek324"
    );
} else {

    $dsn = array(
        'phptype'  => "mysql",
        'hostspec' => "localhost",
        'database' => "berjak",
        'username' => "berjak",
        'password' => "kek324"
    );
}

$db = DB::connect($dsn);


// If $db contains an error:

// error and exit.

if(DB::isError($db)) {
	die($db->getMessage());
}

$db->setFetchMode(DB_FETCHMODE_ASSOC);


?>
