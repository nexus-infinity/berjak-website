<?

// things to be included for sessions.

//expire in ages ages.
//$sessionLifetimeSeconds = (2030-1970)*60*60*24*365 - time();
//session_set_cookie_params($sessionLifetimeSeconds);

// a long time too.
//session_cache_expire(60 * 12 * 24);

session_start();
header ("Cache-control: private"); //IE6 Fix

?>
