-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 12 Feb 2026 pada 08.31
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `trivgoocrm`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `team_id` varchar(20) DEFAULT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `no_hp` varchar(20) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','sales','bd','finance') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `accounts`
--

INSERT INTO `accounts` (`id`, `team_id`, `nama`, `no_hp`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'ACC001', 'ADMIN', '087817638249', 'admin@gmail.com', '$2a$12$uTmmjiHKbsInPrSf9bbE/OUEIT0kvXaVLi1gXuJ0XKE3J9neK/OEG', 'admin', '2026-02-12 07:06:06'),
(2, '121', 'ANTON', '87843942938', 'anton@gmail.com', '$2b$10$nY3tBY95iA.bdjG4KnYx..R.4XuJ5EcpKTNTHQFdSGIMdsnlNK.a6', 'sales', '2026-02-12 07:19:08');

-- --------------------------------------------------------

--
-- Struktur dari tabel `client`
--

CREATE TABLE `client` (
  `id` int(11) NOT NULL,
  `client_id` varchar(20) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `no_hp` varchar(20) DEFAULT NULL,
  `owner` int(11) DEFAULT NULL,
  `status` enum('new','qualified','discussion','negotiation') NOT NULL DEFAULT 'new',
  `doc` varchar(255) DEFAULT NULL,
  `geo_map` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `client`
--

INSERT INTO `client` (`id`, `client_id`, `nama`, `email`, `no_hp`, `owner`, `status`, `doc`, `geo_map`, `created_at`, `updated_at`) VALUES
(1, 'CLN001', 'ANTON', 'anton@gmail.com', '87843942938', 1, 'qualified', 'upload\\clients\\1770881256422-145413060.docx', 'https://www.google.com/maps?q=-8.709406676554996,115.20361168823146', '2026-02-12 07:27:36', '2026-02-12 07:27:36');

-- --------------------------------------------------------

--
-- Struktur dari tabel `deal`
--

CREATE TABLE `deal` (
  `id` int(11) NOT NULL,
  `proposal_id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `status` enum('paid','close','lost') NOT NULL DEFAULT 'close',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `need`
--

CREATE TABLE `need` (
  `id` int(11) NOT NULL,
  `nama` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `need`
--

INSERT INTO `need` (`id`, `nama`) VALUES
(1, 'paket '),
(2, 'transportasi'),
(3, 'tour'),
(4, 'lainnya');

-- --------------------------------------------------------

--
-- Struktur dari tabel `proposal`
--

CREATE TABLE `proposal` (
  `id` int(11) NOT NULL,
  `no_proposal` varchar(50) NOT NULL,
  `client_id` int(11) NOT NULL,
  `need_id` int(11) NOT NULL,
  `req_date` date NOT NULL,
  `status` enum('send','review','revised','submit','accept','lose') NOT NULL DEFAULT 'send',
  `budget` decimal(15,2) NOT NULL,
  `qty` int(11) NOT NULL DEFAULT 1,
  `total_budget` decimal(15,2) GENERATED ALWAYS AS (`budget` * `qty`) STORED,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_owner` (`owner`);

--
-- Indeks untuk tabel `deal`
--
ALTER TABLE `deal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_deal_proposal` (`proposal_id`),
  ADD KEY `fk_deal_client` (`client_id`);

--
-- Indeks untuk tabel `need`
--
ALTER TABLE `need`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `proposal`
--
ALTER TABLE `proposal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_proposal_client` (`client_id`),
  ADD KEY `fk_proposal_need` (`need_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `client`
--
ALTER TABLE `client`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `deal`
--
ALTER TABLE `deal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `need`
--
ALTER TABLE `need`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `proposal`
--
ALTER TABLE `proposal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `client`
--
ALTER TABLE `client`
  ADD CONSTRAINT `fk_owner` FOREIGN KEY (`owner`) REFERENCES `accounts` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `deal`
--
ALTER TABLE `deal`
  ADD CONSTRAINT `fk_deal_client` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_deal_proposal` FOREIGN KEY (`proposal_id`) REFERENCES `proposal` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `proposal`
--
ALTER TABLE `proposal`
  ADD CONSTRAINT `fk_proposal_client` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_proposal_need` FOREIGN KEY (`need_id`) REFERENCES `need` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
