--
-- PostgreSQL database dump
--

\restrict Kce7fYEYfZVg7PigM12tAcCDHfuHhZLOyNhzZ5mG3BaBkKIINjtbTHM4hOCQN3o

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: apartments; Type: TABLE DATA; Schema: public; Owner: mieszkania_user
--

COPY public.apartments (id, apartment_number, area, balcony_terrace_area, city, garage_number, house_number, number_of_rooms, parking_spot_number, postal_code, storage_unit, street) FROM stdin;
1	7	85.5	10	Warszawa	G1	15	4	42	00-123	t	Marszałkowska
2	3	62	7	Kraków	25	8	3	\N	31-234	f	Floriańska
3	12	120	12	Gdańsk	77	22	5	101	80-345	t	Długa
4	5	48.5	10	Wrocław	G1	1	2	\N	50-456	f	Rynek
5	2	73	10	Poznań	G1	10	3	15	61-567	t	Stary Rynek
\.


--
-- Data for Name: contractors; Type: TABLE DATA; Schema: public; Owner: mieszkania_user
--

COPY public.contractors (id, additional_info, address, contractor_type, email, name, pesel_or_nip, phone) FROM stdin;
1	Dodatkowe informacje	Marszałkowska 1, Warszawa	Najemca	mail@gmail.com	Robert Bandrowski	90010109109	48500000000
2		Marszałkowska 1, Warszawa	Najemca	mail@gmail.com	Tomasz Wieczorek	90010109109	48500000000
3	Najemca długoterminowy	Floriańska 8, Kraków	Najemca	maria@example.com	Maria Kowalska	85050512345	48600123456
4	Zarządca budynku	Długa 22, Gdańsk	Spółdzielnia	spoldzielnia@gdansk.pl	Spółdzielnia Mieszkaniowa Gdańsk	1234567890	48587654321
5	Właściciel	Rynek 1, Wrocław	Właściciel	jan.nowak@wp.pl	Jan Nowak	78020345678	48789123456
\.


--
-- Data for Name: agreements; Type: TABLE DATA; Schema: public; Owner: mieszkania_user
--

COPY public.agreements (id, category, date_from, date_to, description, monthly_net_value, tax_operation, vat_rate, apartment_id, contractor_id) FROM stdin;
1	Czynsz najmu	2024-01-01	2026-12-31	Umowa najmu roczna	2500	t	23	1	1
2	Czynsz administracyjny	2024-01-01	2026-12-31	Opłaty administracyjne cykliczne	800	f	8	2	2
3	Remont/naprawa	2024-06-15	2026-06-15	Remont balkonu	1500	t	23	3	1
4	Prąd	2024-11-01	2026-11-30	Rozliczenie energii	320.5	f	23	4	3
5	Kaucja	2024-01-01	2026-01-01	Kaucja zwrotna	5000	f	0	5	4
6	Kaucja	2024-01-01	2025-01-01	Kaucja zwrotna	5000	f	0	5	4
\.


--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: mieszkania_user
--

COPY public.expenses (apartment_id, amount, category, date, description) FROM stdin;
\.


--
-- Data for Name: financial_entries; Type: TABLE DATA; Schema: public; Owner: mieszkania_user
--

COPY public.financial_entries (id, category, date, description, net_amount, paid, tax_operation, vat_rate, apartment_id) FROM stdin;
1	Czynsz administracyjny	2025-01-01	Opłata za styczeń	-800	t	t	8	1
2	Prąd	2025-02-15	Rozliczenie energii	-450	t	f	23	2
3	Remont/naprawa	2025-06-20	Malowanie klatki	-2000	f	t	23	3
4	Podatek	2025-03-01	Podatek od nieruchomości	-1200	t	f	0	4
5	Ubezpieczenie	2025-01-01	Ubezpieczenie mieszkania	-600	t	f	0	5
\.


--
-- Data for Name: meter_readings; Type: TABLE DATA; Schema: public; Owner: mieszkania_user
--

COPY public.meter_readings (apartment_id, cost, date_from, date_to, reading) FROM stdin;
\.


--
-- Data for Name: rent_payments; Type: TABLE DATA; Schema: public; Owner: mieszkania_user
--

COPY public.rent_payments (apartment_id, amount, valid_from, valid_to) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: mieszkania_user
--

COPY public.users (id, password, username) FROM stdin;
1	$2a$10$RFas3d/ey3Ix8YZthMn/XubaWtbpOlVC.jyce0NiCLLhsoITN3ZuK	admin
\.


--
-- Name: agreements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mieszkania_user
--

SELECT pg_catalog.setval('public.agreements_id_seq', 6, true);


--
-- Name: apartments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mieszkania_user
--

SELECT pg_catalog.setval('public.apartments_id_seq', 5, true);


--
-- Name: contractors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mieszkania_user
--

SELECT pg_catalog.setval('public.contractors_id_seq', 5, true);


--
-- Name: financial_entries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mieszkania_user
--

SELECT pg_catalog.setval('public.financial_entries_id_seq', 5, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mieszkania_user
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

\unrestrict Kce7fYEYfZVg7PigM12tAcCDHfuHhZLOyNhzZ5mG3BaBkKIINjtbTHM4hOCQN3o

