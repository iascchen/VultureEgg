<?php
include_once "common.php";

/**
 * Created by CHEN Hao for Vulture Egg Project
 * on 20-8-13.
 * EMail : iascchen@gmail.com
 */

$egg_id = (isset($_GET['egg_id'])) ? $_GET['egg_id'] : $data_config['egg_id'];
$pi_id = (isset($_GET['pi_id'])) ? $_GET['pi_id'] : $data_config['pi_id'];

$return = queryCurrent($egg_id, $pi_id);

$temp = 0;
for ($i = 0; $i < 14; $i++) {
    $_sensor_name = "temp_" . (str_pad(($i + 1), 2, "0", STR_PAD_LEFT));
    $temp += $return[$_sensor_name];
}
$temp = number_format($temp / 14, 3);
$return['avg_temp'] = $temp;

database_close();

header('Content-Type: application/json');
echo json_encode(array("data" => $return, "msg" => "", "state" => 1));

?>