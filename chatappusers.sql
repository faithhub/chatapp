-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 27, 2020 at 11:38 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `node`
--

-- --------------------------------------------------------

--
-- Table structure for table `chatappusers`
--

CREATE TABLE `chatappusers` (
  `id` int(200) NOT NULL,
  `userId` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `mobile` varchar(50) NOT NULL,
  `country` varchar(50) NOT NULL,
  `countryCode` varchar(50) NOT NULL,
  `fullName` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `dob` varchar(50) NOT NULL,
  `password` varchar(200) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updatedAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `chatappusers`
--

INSERT INTO `chatappusers` (`id`, `userId`, `username`, `mobile`, `country`, `countryCode`, `fullName`, `email`, `dob`, `password`, `createdAt`, `updatedAt`) VALUES
(2, '5403c34b-66c7-41ca-9c1e-62a49c37e917', 'olamide', '+2348156129655', 'Nigeria', '234', 'adebayo', 'adebayooluwadara@gmail.com', '2020-07-12', '$2b$10$WWtjzIdxW3.B7mbSWeeZEu.ZY5s5XPBJ2x.AuzCOxkDeJY/RuFhIC', '2020-07-12 22:51:10', '2020-07-12');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chatappusers`
--
ALTER TABLE `chatappusers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userId` (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chatappusers`
--
ALTER TABLE `chatappusers`
  MODIFY `id` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
