<?php
include_once "common.php";

/**
 * Created by CHEN Hao for Vulture Egg Project
 * on 20-8-13.
 * EMail : iascchen@gmail.com
 */

$return = queryCurrent($data_config['egg_id'], $data_config['pi_id']);

$temp = 0;
for ($i = 0; $i < 14; $i++) {
    $_sensor_name = "temp_" . (str_pad(($i + 1), 2, "0", STR_PAD_LEFT));
    $temp += $return[$_sensor_name];
}
$temp = number_format($temp / 14, 3);
$return['avg_temp'] = $temp;

/*
// calc $gravity and $ypr
$MPU6050_RAW2G = 16384.0;
$MPU6050_RAW2Angle = 180 / pi();

$q = [$return['quaternion_0'] / $MPU6050_RAW2G, $return['quaternion_1'] / $MPU6050_RAW2G, $return['quaternion_2'] / $MPU6050_RAW2G, $return['quaternion_3'] / $MPU6050_RAW2G];

$gravity[0] = 2 * ($q[1] * $q[3] - $q[0] * $q[2]);
$gravity[1] = 2 * ($q[0] * $q[1] + $q[2] * $q[3]);
$gravity[2] = $q[0] * $q[0] - $q[1] * $q[1] - $q[2] * $q[2] + $q[3] * $q[3];

$ypr[0] = atan2(2 * $q[1] * $q[2] - 2 * $q[0] * $q[3], 2 * $q[0] * $q[0] + 2 * $q[1] * $q[1] - 1) * $MPU6050_RAW2Angle;
$ypr[1] = atan($gravity[0] / sqrt($gravity[1] * $gravity[1] + $gravity[2] * $gravity[2])) * $MPU6050_RAW2Angle;
$ypr[2] = atan($gravity[1] / sqrt($gravity[0] * $gravity[0] + $gravity[2] * $gravity[2])) * $MPU6050_RAW2Angle;

$return['g_x'] = number_format($gravity[0], 3);
$return['g_y'] = number_format($gravity[1], 3);
$return['g_z'] = number_format($gravity[2], 3);

$return['yaw'] = number_format($ypr[0], 3);
$return['pitch'] = number_format($ypr[1], 3);
$return['roll'] = number_format($ypr[2], 3);
*/

database_close();

header('Content-Type: application/json');
echo json_encode(array("data" => $return, "msg" => "", "state" => 1));

?>