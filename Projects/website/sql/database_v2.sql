SET SQL_SAFE_UPDATES = 0;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

DROP DATABASE IF EXISTS egg;

CREATE DATABASE egg
  DEFAULT CHARACTER SET utf8
  COLLATE utf8_general_ci;

USE egg;

-- Create syntax for TABLE 'egg_report'
DROP TABLE IF EXISTS egg_report;
CREATE TABLE egg_report (
  egg_id                    VARCHAR(32) NOT NULL,
  time                      BIGINT(20)  NOT NULL DEFAULT '0',
  pi_id                     VARCHAR(32) NOT NULL DEFAULT '',
  sensor_acc_available      INT(11)     NOT NULL DEFAULT '0',
  Acc_x                     DECIMAL(3, 1) DEFAULT NULL,
  Acc_y                     DECIMAL(3, 1) DEFAULT NULL,
  Acc_z                     DECIMAL(3, 1) DEFAULT NULL,
  Gyro_x                    DECIMAL(4, 1) DEFAULT NULL,
  Gyro_y                    DECIMAL(4, 1) DEFAULT NULL,
  Gyro_z                    DECIMAL(4, 1) DEFAULT NULL,
  sensor_temp_available     INT(11)     NOT NULL DEFAULT '0',
  Temp_01                   DECIMAL(3, 1) DEFAULT NULL,
  Temp_02                   DECIMAL(3, 1) DEFAULT NULL,
  Temp_03                   DECIMAL(3, 1) DEFAULT NULL,
  Temp_04                   DECIMAL(3, 1) DEFAULT NULL,
  Temp_05                   DECIMAL(3, 1) DEFAULT NULL,
  Temp_06                   DECIMAL(3, 1) DEFAULT NULL,
  Temp_07                   DECIMAL(3, 1) DEFAULT NULL,
  Temp_08                   DECIMAL(3, 1) DEFAULT NULL,
  Temp_09                   DECIMAL(3, 1) DEFAULT NULL,
  Temp_10                   DECIMAL(3, 1) DEFAULT NULL,
  Temp_11                   DECIMAL(3, 1) DEFAULT NULL,
  Temp_12                   DECIMAL(3, 1) DEFAULT NULL,
  Temp_13                   DECIMAL(3, 1) DEFAULT NULL,
  Temp_14                   DECIMAL(3, 1) DEFAULT NULL,
  sensor_humidity_available INT(11)     NOT NULL DEFAULT '0',
  Humidity                  DECIMAL(3, 1) DEFAULT NULL,
  uploaded                  INT(20)     NOT NULL DEFAULT '0',
  PRIMARY KEY (time, egg_id)
)
  ENGINE =InnoDB
  DEFAULT CHARSET =utf8;

-- Create syntax for TABLE 'pi_report'
DROP TABLE IF EXISTS pi_report;
CREATE TABLE pi_report (
  pi_id       VARCHAR(32)   NOT NULL,
  Time        BIGINT(20)    NOT NULL DEFAULT '0',
  Humidity    DECIMAL(3, 1) NOT NULL,
  Light       DECIMAL(5, 1) NOT NULL,
  Pressure    INT(6)        NOT NULL,
  Temperature DECIMAL(3, 1) NOT NULL,
  uploaded    INT(11)       NOT NULL DEFAULT '0',
  PRIMARY KEY (Time, pi_id)
)
  ENGINE =InnoDB
  DEFAULT CHARSET =utf8;