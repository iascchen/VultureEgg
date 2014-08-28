
INSERT INTO egg_report (
  time,
  egg_id, pi_id,
  sensor_acc_available,Acc_x, Acc_y, Acc_z, Gyro_x, Gyro_y, Gyro_z,
  sensor_temp_available,Temp_01,Temp_02,Temp_03,Temp_04,Temp_05,Temp_06,Temp_07,
  Temp_08,Temp_09,Temp_10,Temp_11,Temp_12,Temp_13,Temp_14,
  sensor_humidity_available,Humidity
) values (
	FROM_UNIXTIME('1405094400'), 
	'EEF0', 'HEAE',
	1, '0.6', '0.2', '-0.7', '12.5', '-7.8', '13.9',
	1, '35.2', '33.1', '-5.5', '34.2', '28.9', '29.9', '32.9', '35.8', '33.8', '34.1', '28.7', '29.3', '32.8', '18.2',
	1, '68.2'
);


INSERT INTO pi_report (
  time,
  pi_id,
  Humidity,Light,Pressure,Temperature)
VALUES (
	FROM_UNIXTIME('1405094400'), 'HEAE', '68.5', '684.4', '101325', '32.6');