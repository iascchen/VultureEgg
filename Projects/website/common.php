<?php

/*
Created by leeturn for Vulture Egg Project
Modified by CHEN Hao
    on 20-8-13.
    EMail : iascchen@gmail.com
*/

$data_config = include 'config.php';
$conn = NULL;
function data_con()
{
    GLOBAL $data_config;
    GLOBAL $conn;
    $conn = mysql_connect($data_config['mysql_host'], $data_config['mysql_username'], $data_config['mysql_password']);
}

//function query($sql, $database_num = 0)
//{
//    GLOBAL $conn;
//    GLOBAL $data_config;
//    if (!$conn) {
//        data_con();
//    }
//    $database = $data_config['mysql_database'][$database_num];
//    mysql_select_db($database, $conn);
//    $result = mysql_query($sql);
//    if (is_resource($result)) {
//        $return = array();
//        while ($row = mysql_fetch_array($result, MYSQLI_ASSOC)) {
//            $return[] = $row;
//        }
//        return $return;
//    } else {
//        return $result;
//    }
//}

function query($sql)
{
    GLOBAL $conn;
    GLOBAL $data_config;
    if (!$conn) {
        data_con();
    }
    $database = $data_config['mysql_database'];
    mysql_select_db($database, $conn);
    $result = mysql_query($sql);
    if (is_resource($result)) {
        $return = array();
        while ($row = mysql_fetch_array($result, MYSQLI_ASSOC)) {
            $return[] = $row;
        }
        return $return;
    } else {
        return $result;
    }
}

function queryCurrent($egg_id = NULL, $pi_id = NULL, $before_time = NULL)
{
    if ($before_time == null) {
        $condition1 = "egg_id = '" . $egg_id . "' and pi_id = '" . $pi_id . "' ";
        $condition2 = "pi_id = '" . $pi_id . "' ";
    } else {
        $condition1 = "egg_id = '" . $egg_id . "' and pi_id = '" . $pi_id . "' and time < '" . $before_time . "' ";
        $condition2 = "pi_id = '" . $pi_id . "' and time < '" . $before_time . "' ";
    }

    $sql = "select a.*, b.*, c.*, d.* from (" .
        "(select time as mpu_time, acc_x, acc_y, acc_z, gyro_x, gyro_y, gyro_z " .
        "from egg_report " .
        "where " . $condition1 . "and sensor_acc_available > 0 " .
        "order by time desc limit 1) a," .
        "(select time as temp_time, temp_01, temp_02, temp_03, temp_04,temp_05,temp_06,temp_07,temp_08,temp_09,temp_10,temp_11,temp_12,temp_13,temp_14 " .
        "from egg_report " .
        "where " . $condition1 . "and sensor_temp_available > 0 " .
        "order by time desc limit 1) b," .
        "(select time as hum_time , humidity " .
        "from egg_report " .
        "where " . $condition1 . "and sensor_humidity_available > 0 " .
        "order by time desc limit 1) c," .
        "(select time as weather_time, humidity as weather_hum, light, pressure, temperature " .
        "from pi_report " .
        "where " . $condition2 . "order by time desc limit 1) d);";

    // print $sql;

    $return = query($sql);
    return $return[0];
}

//function queryByTime($timestamp = NULL, $database_num = 0)
//{
//    if ($timestamp == null) {
//        $sql = "select * from EEF0  order by `Time` DESC  LIMIT 1";
//    } else {
//
//        $sql = "select * from EEF0  where `Time` >'" . $timestamp . "' order by `Time` DESC limit 1";
//    }
//    $return = query($sql, $database_num);
//    return $return[0];
//}

function database_close()
{
    GLOBAL $conn;
    GLOBAL $data_config;
    if ($conn !== NULL) {
        mysql_close($conn);
    }
}

?>