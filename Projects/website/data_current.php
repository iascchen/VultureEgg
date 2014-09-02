<?php
include_once "common.php";

/**
 * Created by CHEN Hao for Vulture Egg Project
 * on 20-8-13.
 * EMail : iascchen@gmail.com
 */

$return = queryCurrent($data_config['egg_id'], $data_config['pi_id']);

$temp = 0;
for ($i = 0; $i<14; $i++ ) {
    $_sensor_name = "temp_" . (str_pad(($i + 1),2,"0",STR_PAD_LEFT));
    $temp += $return[$_sensor_name];
}
$temp = number_format( $temp / 14 , 1);
$return['avg_temp'] = $temp;

/*
$MPU6050_RAW2G = 16384.0;
$MPU6050_RAW2Angle = 131.0;

$return['acc_x'] = number_format( $return['acc_x'] / $MPU6050_RAW2G , 2);
$return['acc_y'] = number_format( $return['acc_y'] / $MPU6050_RAW2G , 2);
$return['acc_z'] = number_format( $return['acc_z'] / $MPU6050_RAW2G , 2);
$return['gyro_x'] = number_format( $return['gyro_x'] / $MPU6050_RAW2Angle , 1);
$return['gyro_y'] = number_format( $return['gyro_y'] / $MPU6050_RAW2Angle , 1);
$return['gyro_z'] = number_format( $return['gyro_z'] / $MPU6050_RAW2Angle , 1);
*/

//$return['acc_x'] = number_format( $return['acc_x'], 2);
//$return['acc_y'] = number_format( $return['acc_y'], 2);
//$return['acc_z'] = number_format( $return['acc_z'], 2);
//$return['gyro_x'] = number_format( $return['gyro_x'], 1);
//$return['gyro_y'] = number_format( $return['gyro_y'], 1);
//$return['gyro_z'] = number_format( $return['gyro_z'] , 1);

database_close();

header('Content-Type: application/json');
echo json_encode(array("data" => $return, "msg" => "", "state" => 1));

?>