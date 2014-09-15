<?php

// SQL to generate database schema on
// https://github.com/guoxiangyang/VultureEgg/blob/master/Projects/RaspberryPi/mysql.sql

return array(
    "mysql_host" => "localhost", // such as localhost, or localhost:3306
    "mysql_username" => "", // mysql user can READ the vulture egg schema
    "mysql_password" => "", // mysql password
    "mysql_database" => "egg", // database schema name

    "egg_id" => "BC6A29BD0E5C", // default egg_id, used by data_current.php
    "pi_id" => "02:10:08:41:50:74" // default pi_id, used by data_current.php
);
?>