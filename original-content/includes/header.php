<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>||| Nathan Kotler |||</title>
<meta name="keywords" content="nathan kotler psychologist family therapist prahran addictions anxiety obsessions compulsions drugs cannabis panicking anger depression relationships loss grief life threatening illnesses ">
<meta name="description" content="Nathan Kotler is a psychologist & family therapist who specialises in counselling for individuals, couples & families with problematic addictive & compulsive behaviours and those dealing with loss and grief. Other issues dealt with include; addiction, anxiety, obsessive compulsive, drugs, cannabis, panick, anger depression, relationships and illness.">
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<link rel="stylesheet" type="text/css" href="menuCSS.css" />
<style type="text/css">
<!--
.style1 {font-weight: bold}
.style3 {
	font-size: 14px;
	color: #FF0000;
}
.style4 {color: #FF0000}
.style5 {font-size: 14px}
-->
</style>
</head>

<body>
<table width="743" height="500" border="0" align="center" cellpadding="0" cellspacing="0">
  <!--DWLayoutTable-->
  <tr>
    <td width="167" valign="top"><table width="100%" height="100"  border="0" cellpadding="0" cellspacing="0">
      <!--DWLayoutTable-->
      <tr>
        <td width="163" height="100" valign="top"><img src="Images/logo.gif" width="163" height="100"></td>
        <td width="4" valign="top"><!--DWLayoutEmptyCell-->&nbsp;</td>
      </tr>
      <tr>
        <td rowspan="2" valign="top">
        <?

            echo $category_html;

        ?>
           
           
           </td>
      </tr>
    </table></td>
    <td width="576" valign="top"><table width="100%" height="100"  border="0" cellpadding="0" cellspacing="0">
      <!--DWLayoutTable-->
      <tr>
        <td width="580" height="100" align="right"><img src="Images/logoHeader.gif" width="293" height="100"></td>
      </tr>
      <tr>
        <td height="25" valign="top"><table width="100%"  border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td><div id="chromemenu">
              <ul>
			    <li><a href="index.php">HOME</a></li>
                <li><a href="#" onMouseover="cssdropdown.dropit(this,event,'dropmenu2')">ABOUT NATHAN </a></li>
                <li><a href="#" onMouseover="cssdropdown.dropit(this,event,'dropmenu3')">SERVICES</a></li>
                <li><a href="#" onMouseover="cssdropdown.dropit(this,event,'dropmenu4')">LOGIN</a></li>
                <li><a href="#" onMouseover="cssdropdown.dropit(this,event,'dropmenu5')">CONTACT</a></li>
              </ul>
            </div>


<!--1st drop down menu -->                                                   
<div id="dropmenu2" class="dropmenudiv">

<a href="specialities.php">> Specialities</a>
<a href="workexperience.php">> Work Experience</a>
<a href="currentwork.php">> Current Work</a>
<a href="qualifications.php">> Qualifications</a>
<a href="memberships.php">> Memberships</a>
<a href="accreditation.php">> Accreditation</a>
</div>

<!--2nd drop down menu -->                                                
<div id="dropmenu3" class="dropmenudiv" style="width: 172px;">
<a href="clientwork.php">> How I Work with Clients</a>
<a href="helpyou.php">> How I Can Help You</a>
<a href="Waysofworking.php">> Ways of Working with Me</a>
</div>

<!--3rd anchor link and menu -->                                                 
<div id="dropmenu4" class="dropmenudiv" style="width: 98px;">
<a href="join.php">> Click to Join</a>
<a href="login.php">> Login</a>
<a href="editprofile.php">> Edit Profile</a>
</div>

<!--4th anchor link and menu -->                                                 
<div id="dropmenu5" class="dropmenudiv" style="width: 130px;">
<a href="contact.php">> How to Contact Me</a>
<a href="queries.php">> Queries</a></div></td>
          </tr>
        </table></td>
      </tr>
      <tr>
        <td valign="top"><table width="100%"  border="0" cellspacing="0" cellpadding="0">
          <!--DWLayoutTable-->
          <tr>
            <td width="576" height="120" valign="top"><img src="<? echo $heading_image; ?>" width="576" height="120"></td>
          </tr>
          <tr>
            <td height="176" valign="top"><?
              if ($no_textCSS) {
              ?>
                  <div id="contained">
              <?
              } else {
              ?>
                  <div class="textCSS" id="contained">
            <?
              }
            ?>
            <?
                if($subcategory) {
                    echo '<p><span class="textHeadings">' . $subcategory . '</span></p>';
                }

                echo $subcategory_html;
                echo $category_body_html;

            ?>

