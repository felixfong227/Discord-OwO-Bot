-- MySQL dump 10.15  Distrib 10.0.38-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: owo
-- ------------------------------------------------------
-- Server version	10.0.38-MariaDB-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `animal`
--

DROP TABLE IF EXISTS `animal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `animal` (
  `id` bigint(20) unsigned NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `count` int(4) NOT NULL,
  `xp` int(11) NOT NULL DEFAULT '0',
  `ispet` tinyint(4) DEFAULT '0',
  `nickname` varchar(35) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `totalcount` int(4) NOT NULL DEFAULT '0',
  `offensive` tinyint(4) DEFAULT '0',
  `sellcount` int(10) unsigned DEFAULT '0',
  `saccount` int(10) unsigned DEFAULT '0',
  PRIMARY KEY (`id`,`name`),
  UNIQUE KEY `pid` (`pid`),
  UNIQUE KEY `pid_2` (`pid`),
  UNIQUE KEY `pid_3` (`pid`),
  KEY `name` (`name`),
  CONSTRAINT `animal_ibfk_1` FOREIGN KEY (`name`) REFERENCES `animals` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=225738659 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `animal_count`
--

DROP TABLE IF EXISTS `animal_count`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `animal_count` (
  `id` bigint(20) unsigned NOT NULL,
  `common` int(5) NOT NULL DEFAULT '0',
  `uncommon` int(5) NOT NULL DEFAULT '0',
  `rare` int(5) NOT NULL DEFAULT '0',
  `epic` int(5) NOT NULL DEFAULT '0',
  `mythical` int(5) NOT NULL DEFAULT '0',
  `legendary` int(5) NOT NULL DEFAULT '0',
  `special` int(5) NOT NULL DEFAULT '0',
  `fabled` int(5) NOT NULL DEFAULT '0',
  `patreon` int(5) NOT NULL DEFAULT '0',
  `cpatreon` int(5) NOT NULL DEFAULT '0',
  `hidden` int(5) NOT NULL DEFAULT '0',
  `gem` int(5) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `animal_food`
--

DROP TABLE IF EXISTS `animal_food`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `animal_food` (
  `pid` int(10) unsigned NOT NULL,
  `pfid` int(10) unsigned NOT NULL,
  `fid` int(11) NOT NULL,
  PRIMARY KEY (`pid`,`pfid`),
  KEY `fid` (`fid`),
  CONSTRAINT `animal_food_ibfk_1` FOREIGN KEY (`pid`) REFERENCES `animal` (`pid`),
  CONSTRAINT `animal_food_ibfk_2` FOREIGN KEY (`fid`) REFERENCES `food` (`fid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `animals`
--

DROP TABLE IF EXISTS `animals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `animals` (
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `announcement`
--

DROP TABLE IF EXISTS `announcement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `announcement` (
  `aid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `url` varchar(75) NOT NULL,
  `adate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`aid`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `autohunt`
--

DROP TABLE IF EXISTS `autohunt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `autohunt` (
  `id` bigint(20) unsigned NOT NULL,
  `essence` int(11) NOT NULL DEFAULT '0',
  `efficiency` int(11) NOT NULL DEFAULT '0',
  `duration` int(11) NOT NULL DEFAULT '0',
  `cost` int(11) NOT NULL DEFAULT '0',
  `gain` int(11) NOT NULL DEFAULT '0',
  `exp` int(11) NOT NULL DEFAULT '0',
  `start` timestamp NOT NULL DEFAULT '2001-01-01 08:00:00',
  `huntcount` int(11) DEFAULT '0',
  `huntmin` int(11) DEFAULT '0',
  `password` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `passwordtime` timestamp NOT NULL DEFAULT '2001-01-01 08:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `backgrounds`
--

DROP TABLE IF EXISTS `backgrounds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `backgrounds` (
  `bid` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `name_color` varchar(15) DEFAULT '255,255,255,255',
  `bname` varchar(30) NOT NULL,
  `price` int(10) unsigned NOT NULL DEFAULT '0',
  `active` tinyint(4) DEFAULT '1',
  PRIMARY KEY (`bid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `battle_settings`
--

DROP TABLE IF EXISTS `battle_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `battle_settings` (
  `uid` int(11) NOT NULL,
  `auto` tinyint(4) DEFAULT '0',
  `display` varchar(10) DEFAULT NULL,
  `speed` tinyint(4) DEFAULT '1',
  `logs` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`uid`),
  CONSTRAINT `battle_settings_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `battle_type`
--

DROP TABLE IF EXISTS `battle_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `battle_type` (
  `uid` int(11) NOT NULL,
  `type` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`uid`),
  CONSTRAINT `battle_type_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `blackjack`
--

DROP TABLE IF EXISTS `blackjack`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blackjack` (
  `id` bigint(20) unsigned NOT NULL,
  `bjid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `bet` int(10) unsigned DEFAULT '0',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `active` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `bjid` (`bjid`)
) ENGINE=InnoDB AUTO_INCREMENT=2088890 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `blackjack_card`
--

DROP TABLE IF EXISTS `blackjack_card`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blackjack_card` (
  `bjid` int(10) unsigned NOT NULL,
  `card` tinyint(3) unsigned NOT NULL,
  `dealer` tinyint(3) unsigned NOT NULL,
  `sort` int(11) DEFAULT '0',
  PRIMARY KEY (`bjid`,`card`),
  CONSTRAINT `blackjack_card_ibfk_1` FOREIGN KEY (`bjid`) REFERENCES `blackjack` (`bjid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `blacklist`
--

DROP TABLE IF EXISTS `blacklist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blacklist` (
  `id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `buff`
--

DROP TABLE IF EXISTS `buff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `buff` (
  `bfid` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY (`bfid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cowoncy`
--

DROP TABLE IF EXISTS `cowoncy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cowoncy` (
  `id` bigint(20) unsigned NOT NULL,
  `money` int(20) NOT NULL,
  `daily` timestamp NOT NULL DEFAULT '2017-01-01 18:10:10',
  `daily_streak` int(20) NOT NULL DEFAULT '0',
  `battle` timestamp NOT NULL DEFAULT '2017-01-01 18:10:10',
  `pet` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cowoncydrop`
--

DROP TABLE IF EXISTS `cowoncydrop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cowoncydrop` (
  `channel` bigint(20) unsigned NOT NULL,
  `amount` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`channel`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `crate`
--

DROP TABLE IF EXISTS `crate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crate` (
  `uid` int(11) NOT NULL DEFAULT '0',
  `cratetype` tinyint(4) NOT NULL DEFAULT '0',
  `boxcount` int(10) unsigned NOT NULL DEFAULT '0',
  `claimcount` int(11) DEFAULT '0',
  `claim` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`uid`,`cratetype`),
  CONSTRAINT `crate_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `disabled`
--

DROP TABLE IF EXISTS `disabled`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `disabled` (
  `channel` bigint(20) unsigned NOT NULL,
  `command` varchar(20) NOT NULL,
  PRIMARY KEY (`channel`,`command`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `eightball`
--

DROP TABLE IF EXISTS `eightball`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `eightball` (
  `id` int(4) unsigned NOT NULL AUTO_INCREMENT,
  `answer` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `emoji_steal`
--

DROP TABLE IF EXISTS `emoji_steal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `emoji_steal` (
  `uid` int(11) NOT NULL,
  `guild` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `feedback` (
  `id` int(5) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `message` varchar(255) NOT NULL,
  `sender` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7226 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `food`
--

DROP TABLE IF EXISTS `food`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `food` (
  `fid` int(11) NOT NULL AUTO_INCREMENT,
  `fname` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`fid`),
  UNIQUE KEY `name` (`fname`),
  UNIQUE KEY `fname` (`fname`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `gem`
--

DROP TABLE IF EXISTS `gem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gem` (
  `gname` varchar(25) NOT NULL,
  `type` varchar(35) NOT NULL,
  PRIMARY KEY (`gname`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `guild`
--

DROP TABLE IF EXISTS `guild`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `guild` (
  `id` bigint(20) unsigned NOT NULL,
  `count` int(10) unsigned NOT NULL,
  `young` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `guild_setting`
--

DROP TABLE IF EXISTS `guild_setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `guild_setting` (
  `id` bigint(20) unsigned NOT NULL,
  `levelup` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lootbox`
--

DROP TABLE IF EXISTS `lootbox`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lootbox` (
  `id` bigint(20) unsigned NOT NULL,
  `boxcount` int(11) NOT NULL DEFAULT '0',
  `claimcount` int(11) NOT NULL DEFAULT '0',
  `claim` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lottery`
--

DROP TABLE IF EXISTS `lottery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lottery` (
  `id` bigint(20) unsigned NOT NULL,
  `amount` int(4) unsigned NOT NULL,
  `valid` tinyint(4) NOT NULL,
  `channel` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `luck`
--

DROP TABLE IF EXISTS `luck`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `luck` (
  `id` bigint(20) unsigned NOT NULL,
  `lcount` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `marriage`
--

DROP TABLE IF EXISTS `marriage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `marriage` (
  `uid1` int(11) NOT NULL DEFAULT '0',
  `uid2` int(11) NOT NULL DEFAULT '0',
  `marriedDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dailies` int(11) NOT NULL DEFAULT '0',
  `rid` tinyint(4) NOT NULL,
  PRIMARY KEY (`uid1`,`uid2`),
  KEY `uid2` (`uid2`),
  KEY `rid` (`rid`),
  CONSTRAINT `marriage_ibfk_1` FOREIGN KEY (`uid1`) REFERENCES `user` (`uid`),
  CONSTRAINT `marriage_ibfk_2` FOREIGN KEY (`uid2`) REFERENCES `user` (`uid`),
  CONSTRAINT `marriage_ibfk_3` FOREIGN KEY (`rid`) REFERENCES `ring` (`rid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `old_animals`
--

DROP TABLE IF EXISTS `old_animals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `old_animals` (
  `id` bigint(20) unsigned DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `rankchar` varchar(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `patreons`
--

DROP TABLE IF EXISTS `patreons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patreons` (
  `uid` int(11) NOT NULL,
  `patreonMonths` int(10) unsigned NOT NULL DEFAULT '0',
  `patreonType` int(10) unsigned NOT NULL DEFAULT '0',
  `patreonTimer` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`uid`),
  CONSTRAINT `patreons_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pet_team`
--

DROP TABLE IF EXISTS `pet_team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pet_team` (
  `uid` int(11) NOT NULL,
  `pgid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `tname` varchar(50) DEFAULT NULL,
  `win` int(10) unsigned DEFAULT '0',
  `lose` int(10) unsigned DEFAULT '0',
  `censor` tinyint(1) DEFAULT '0',
  `streak` int(10) unsigned DEFAULT '0',
  `highest_streak` int(10) unsigned DEFAULT '0',
  PRIMARY KEY (`pgid`,`uid`),
  KEY `uid` (`uid`),
  CONSTRAINT `pet_team_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=64550 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pet_team_animal`
--

DROP TABLE IF EXISTS `pet_team_animal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pet_team_animal` (
  `pgid` int(11) unsigned NOT NULL DEFAULT '0',
  `pos` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `pid` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`pgid`,`pos`),
  KEY `pid` (`pid`),
  CONSTRAINT `pet_team_animal_ibfk_1` FOREIGN KEY (`pgid`) REFERENCES `pet_team` (`pgid`),
  CONSTRAINT `pet_team_animal_ibfk_2` FOREIGN KEY (`pid`) REFERENCES `animal` (`pid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pet_team_battle`
--

DROP TABLE IF EXISTS `pet_team_battle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pet_team_battle` (
  `pgid` int(10) unsigned NOT NULL,
  `epgid` int(10) unsigned NOT NULL,
  `started` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cphp` varchar(25) NOT NULL,
  `cpwp` varchar(25) NOT NULL,
  `cehp` varchar(25) NOT NULL,
  `cewp` varchar(25) NOT NULL,
  `active` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`pgid`),
  KEY `epgid` (`epgid`),
  CONSTRAINT `pet_team_battle_ibfk_1` FOREIGN KEY (`pgid`) REFERENCES `pet_team` (`pgid`),
  CONSTRAINT `pet_team_battle_ibfk_2` FOREIGN KEY (`epgid`) REFERENCES `pet_team` (`pgid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pet_team_battle_buff`
--

DROP TABLE IF EXISTS `pet_team_battle_buff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pet_team_battle_buff` (
  `pgid` int(10) unsigned NOT NULL,
  `pid` int(10) unsigned NOT NULL,
  `bfid` tinyint(3) unsigned NOT NULL,
  `duration` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `qualities` varchar(20) NOT NULL,
  `pfrom` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`pgid`,`pid`,`bfid`),
  KEY `pid` (`pid`),
  KEY `bfid` (`bfid`),
  CONSTRAINT `pet_team_battle_buff_ibfk_1` FOREIGN KEY (`pgid`) REFERENCES `pet_team_battle` (`pgid`),
  CONSTRAINT `pet_team_battle_buff_ibfk_2` FOREIGN KEY (`pid`) REFERENCES `animal` (`pid`),
  CONSTRAINT `pet_team_battle_buff_ibfk_3` FOREIGN KEY (`bfid`) REFERENCES `buff` (`bfid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pizza`
--

DROP TABLE IF EXISTS `pizza`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pizza` (
  `uid` int(11) NOT NULL,
  `count` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`uid`),
  CONSTRAINT `pizza_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `propose`
--

DROP TABLE IF EXISTS `propose`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `propose` (
  `sender` bigint(20) unsigned NOT NULL,
  `receiver` bigint(20) unsigned NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rid` tinyint(4) NOT NULL,
  PRIMARY KEY (`sender`,`receiver`),
  KEY `rid` (`rid`),
  CONSTRAINT `propose_ibfk_1` FOREIGN KEY (`rid`) REFERENCES `ring` (`rid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `quest`
--

DROP TABLE IF EXISTS `quest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quest` (
  `uid` int(11) NOT NULL,
  `qid` int(11) NOT NULL,
  `qname` varchar(30) NOT NULL,
  `level` tinyint(4) NOT NULL DEFAULT '0',
  `prize` varchar(25) NOT NULL,
  `count` int(11) NOT NULL DEFAULT '0',
  `claimed` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`uid`,`qid`),
  CONSTRAINT `quest_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ranking`
--

DROP TABLE IF EXISTS `ranking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ranking` (
  `id` bigint(20) unsigned NOT NULL,
  `ranking` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rep`
--

DROP TABLE IF EXISTS `rep`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rep` (
  `id` bigint(20) NOT NULL,
  `count` int(20) NOT NULL,
  `lasttime` timestamp NOT NULL DEFAULT '2017-01-01 18:10:10',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ring`
--

DROP TABLE IF EXISTS `ring`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ring` (
  `rid` tinyint(4) NOT NULL,
  PRIMARY KEY (`rid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rules`
--

DROP TABLE IF EXISTS `rules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rules` (
  `uid` int(11) NOT NULL,
  `opinion` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`uid`),
  CONSTRAINT `rules_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `timeout`
--

DROP TABLE IF EXISTS `timeout`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `timeout` (
  `id` bigint(20) unsigned NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `count` int(4) NOT NULL DEFAULT '1',
  `penalty` int(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `timers`
--

DROP TABLE IF EXISTS `timers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `timers` (
  `uid` int(11) NOT NULL,
  `questTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dailyTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lootboxTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `questrrTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cookieTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`uid`),
  CONSTRAINT `user_timers` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tracker`
--

DROP TABLE IF EXISTS `tracker`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tracker` (
  `uid` int(11) NOT NULL,
  `questCount` int(11) DEFAULT '0',
  PRIMARY KEY (`uid`),
  CONSTRAINT `tracker_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transaction` (
  `tid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `sender` bigint(20) unsigned NOT NULL,
  `reciever` bigint(20) unsigned NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `amount` int(20) NOT NULL,
  PRIMARY KEY (`sender`,`reciever`,`time`),
  UNIQUE KEY `tid` (`tid`),
  CONSTRAINT `transaction_ibfk_1` FOREIGN KEY (`sender`) REFERENCES `cowoncy` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=917997 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` bigint(20) unsigned NOT NULL,
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `count` int(10) unsigned NOT NULL DEFAULT '1',
  `patreonAnimal` tinyint(4) NOT NULL DEFAULT '0',
  `patreonDaily` tinyint(4) NOT NULL DEFAULT '0',
  `started` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uid` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=22355192 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_announcement`
--

DROP TABLE IF EXISTS `user_announcement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_announcement` (
  `uid` int(11) NOT NULL,
  `aid` int(10) unsigned DEFAULT NULL,
  `disabled` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`uid`),
  KEY `aid` (`aid`),
  CONSTRAINT `user_announcement_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`),
  CONSTRAINT `user_announcement_ibfk_2` FOREIGN KEY (`aid`) REFERENCES `announcement` (`aid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_backgrounds`
--

DROP TABLE IF EXISTS `user_backgrounds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_backgrounds` (
  `uid` int(11) NOT NULL DEFAULT '0',
  `bid` tinyint(3) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`uid`,`bid`),
  KEY `bid` (`bid`),
  CONSTRAINT `user_backgrounds_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`),
  CONSTRAINT `user_backgrounds_ibfk_2` FOREIGN KEY (`bid`) REFERENCES `backgrounds` (`bid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_battle`
--

DROP TABLE IF EXISTS `user_battle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_battle` (
  `user1` int(11) NOT NULL DEFAULT '0',
  `user2` int(11) NOT NULL DEFAULT '0',
  `sender` int(11) NOT NULL,
  `bet` int(10) unsigned NOT NULL DEFAULT '0',
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `win1` int(10) unsigned NOT NULL DEFAULT '0',
  `win2` int(10) unsigned NOT NULL DEFAULT '0',
  `tie` int(10) unsigned NOT NULL DEFAULT '0',
  `flags` varchar(30) DEFAULT NULL,
  `channel` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`user1`,`user2`),
  KEY `user2` (`user2`),
  KEY `sender` (`sender`),
  CONSTRAINT `user_battle_ibfk_1` FOREIGN KEY (`user1`) REFERENCES `user` (`uid`),
  CONSTRAINT `user_battle_ibfk_2` FOREIGN KEY (`user2`) REFERENCES `user` (`uid`),
  CONSTRAINT `user_battle_ibfk_3` FOREIGN KEY (`sender`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_food`
--

DROP TABLE IF EXISTS `user_food`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_food` (
  `uid` int(11) NOT NULL,
  `fid` int(11) NOT NULL,
  `fcount` int(11) DEFAULT '0',
  PRIMARY KEY (`uid`,`fid`),
  KEY `fid` (`fid`),
  CONSTRAINT `user_food_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`),
  CONSTRAINT `user_food_ibfk_2` FOREIGN KEY (`fid`) REFERENCES `food` (`fid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_gem`
--

DROP TABLE IF EXISTS `user_gem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_gem` (
  `uid` int(11) NOT NULL,
  `gname` varchar(25) NOT NULL,
  `gcount` int(11) NOT NULL DEFAULT '0',
  `activecount` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`uid`,`gname`),
  KEY `gname` (`gname`),
  CONSTRAINT `user_gem_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`),
  CONSTRAINT `user_gem_ibfk_2` FOREIGN KEY (`gname`) REFERENCES `gem` (`gname`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_level_rewards`
--

DROP TABLE IF EXISTS `user_level_rewards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_level_rewards` (
  `uid` int(11) NOT NULL,
  `rewardLvl` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`uid`),
  CONSTRAINT `user_level_rewards_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_profile`
--

DROP TABLE IF EXISTS `user_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_profile` (
  `uid` int(11) NOT NULL,
  `bid` tinyint(3) unsigned DEFAULT NULL,
  `accent` varchar(15) DEFAULT NULL,
  `about` varchar(255) NOT NULL DEFAULT '',
  `accent2` varchar(15) DEFAULT NULL,
  `title` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`uid`),
  KEY `user_profile_ibfk_2` (`bid`),
  CONSTRAINT `user_profile_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`),
  CONSTRAINT `user_profile_ibfk_2` FOREIGN KEY (`bid`) REFERENCES `backgrounds` (`bid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_ring`
--

DROP TABLE IF EXISTS `user_ring`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_ring` (
  `uid` int(11) NOT NULL DEFAULT '0',
  `rid` int(10) unsigned NOT NULL DEFAULT '0',
  `rcount` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`uid`,`rid`),
  CONSTRAINT `user_ring_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_weapon`
--

DROP TABLE IF EXISTS `user_weapon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_weapon` (
  `uwid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `wid` int(10) unsigned NOT NULL,
  `stat` varchar(20) NOT NULL,
  `found` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `pid` int(10) unsigned DEFAULT NULL,
  `avg` int(10) unsigned DEFAULT '0',
  PRIMARY KEY (`uwid`),
  UNIQUE KEY `pid` (`pid`),
  KEY `uid` (`uid`),
  KEY `wid` (`wid`),
  CONSTRAINT `user_weapon_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`),
  CONSTRAINT `user_weapon_ibfk_2` FOREIGN KEY (`wid`) REFERENCES `weapon` (`wid`)
) ENGINE=InnoDB AUTO_INCREMENT=3936947 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_weapon_passive`
--

DROP TABLE IF EXISTS `user_weapon_passive`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_weapon_passive` (
  `uwid` int(10) unsigned NOT NULL DEFAULT '0',
  `pcount` tinyint(3) unsigned NOT NULL,
  `wpid` int(10) unsigned NOT NULL,
  `stat` varchar(20) NOT NULL,
  PRIMARY KEY (`uwid`,`pcount`),
  KEY `wpid` (`wpid`),
  CONSTRAINT `user_weapon_passive_ibfk_1` FOREIGN KEY (`uwid`) REFERENCES `user_weapon` (`uwid`),
  CONSTRAINT `user_weapon_passive_ibfk_2` FOREIGN KEY (`wpid`) REFERENCES `weapon_passive` (`wpid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vote`
--

DROP TABLE IF EXISTS `vote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vote` (
  `id` bigint(20) unsigned NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `count` int(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `weapon`
--

DROP TABLE IF EXISTS `weapon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `weapon` (
  `wid` int(10) unsigned NOT NULL,
  PRIMARY KEY (`wid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `weapon_passive`
--

DROP TABLE IF EXISTS `weapon_passive`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `weapon_passive` (
  `wpid` int(10) unsigned NOT NULL,
  PRIMARY KEY (`wpid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'owo'
--
/*!50003 DROP PROCEDURE IF EXISTS `CowoncyDrop` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CowoncyDrop`(
IN tid BIGINT UNSIGNED,
IN tchannel BIGINT UNSIGNED,
IN tamount INT UNSIGNED)
BEGIN

DECLARE exit handler for sqlexception
  BEGIN
  ROLLBACK;
END;

DECLARE exit handler for sqlwarning
 BEGIN
 ROLLBACK;
END;

START TRANSACTION;
IF (SELECT IFNULL((SELECT money FROM cowoncy WHERE id = tid),0) < tamount) THEN
ROLLBACK;
ELSE
UPDATE cowoncy SET money = money - tamount WHERE id = tid;
INSERT INTO cowoncydrop (channel,amount) VALUES (tchannel,tamount) ON DUPLICATE KEY UPDATE amount = amount + tamount;
END IF;
COMMIT;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CowoncyPickup` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CowoncyPickup`(
IN tid BIGINT UNSIGNED,
IN tchannel BIGINT UNSIGNED,
IN tamount INT UNSIGNED)
BEGIN

DECLARE exit handler for sqlexception
  BEGIN
  ROLLBACK;
END;

DECLARE exit handler for sqlwarning
 BEGIN
 ROLLBACK;
END;

START TRANSACTION;
IF (SELECT IFNULL((SELECT money FROM cowoncy WHERE id = tid),0)) < tamount THEN
ROLLBACK;
ELSEIF ((SELECT IFNULL((SELECT amount FROM cowoncydrop WHERE channel = tchannel),0) >= tamount) AND (SELECT IFNULL((SELECT money FROM cowoncy WHERE id = tid),0) >= tamount)) THEN
INSERT INTO cowoncy (id,money) VALUES (tid,tamount) ON DUPLICATE KEY UPDATE money = money + tamount;
UPDATE cowoncydrop SET amount = amount - tamount WHERE channel = tchannel;
ELSE
UPDATE cowoncy SET money = money - tamount WHERE id = tid;
INSERT INTO cowoncydrop (channel,amount) VALUES (tchannel,tamount) ON DUPLICATE KEY UPDATE amount = amount + tamount;
END IF;
COMMIT;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CowoncyTransfer` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CowoncyTransfer`(
IN send BIGINT UNSIGNED,
IN rec BIGINT UNSIGNED,
IN tamount INT UNSIGNED)
BEGIN

DECLARE exit handler for sqlexception
  BEGIN
  ROLLBACK;
END;

DECLARE exit handler for sqlwarning
 BEGIN
 ROLLBACK;
END;

START TRANSACTION;
IF (SELECT money FROM cowoncy WHERE id = send) < tamount THEN
ROLLBACK;
END IF;
UPDATE cowoncy SET money = money - tamount WHERE id = send;
INSERT INTO cowoncy (id,money) VALUES (rec,tamount) ON DUPLICATE KEY UPDATE money = money + tamount;
INSERT INTO transaction (sender,reciever,amount) VALUES (send,rec,tamount);
COMMIT;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-08-29 17:03:26
