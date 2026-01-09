package bart.mieszkaniaj.init;

import bart.mieszkaniaj.model.Apartment;
import bart.mieszkaniaj.model.Contractor;
import bart.mieszkaniaj.model.Agreement;
import bart.mieszkaniaj.repository.ApartmentRepository;
import bart.mieszkaniaj.repository.ContractorRepository;
import bart.mieszkaniaj.repository.AgreementRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
@Profile("local") // działa tylko lokalnie
public class TestDataInitializer {

    @Autowired
    private ApartmentRepository apartmentRepository;

    @Autowired
    private ContractorRepository contractorRepository;

    @Autowired
    private AgreementRepository agreementRepository;

    @PostConstruct
    public void init() {
        List<Apartment> apartments = new ArrayList<>();
        List<Contractor> contractors = new ArrayList<>();

        // ==================== 30 MIESZKAŃ (a6 do a35) ====================
        String[] miasta = {"Poznań", "Wrocław", "Kraków", "Warszawa", "Gdańsk"};
        String[] ulice = {"Grunwaldzka", "Święty Marcin", "Rynek Główny", "Marszałkowska", "Długa", "Halfka", "Starowiejska"};

        for (int i = 6; i <= 35; i++) {
            Apartment apt = new Apartment();
            apt.setCity(miasta[(i - 6) % miasta.length]);
            apt.setPostalCode(String.format("%02d-%03d", 10 + (i % 90), 100 + i));
            apt.setStreet(ulice[(i - 6) % ulice.length]);
            apt.setHouseNumber(5 + i);
            apt.setApartmentNumber(1 + (i % 20));
            apt.setArea(45.0 + (i * 2.7));
            apt.setNumberOfRooms(2 + (i % 4));
            apt.setStorageUnit(i % 3 != 0);
            apt.setParkingSpotNumber(i % 5 == 0 ? null : 10 + i);
            apt.setBalconyTerraceArea(4.0 + (i % 12));
            apt.setGarageNumber(i % 7 == 0 ? "G" + i : null);

            apartmentRepository.save(apt);
            apartments.add(apt);

            System.out.println("Utworzono mieszkanie a" + i + " – " + apt.getCity() + ", " + apt.getStreet() + " " + apt.getHouseNumber());
        }

        // ==================== 30 KONTRAHENTÓW ====================
        String[] imiona = {"Anna", "Piotr", "Katarzyna", "Michał", "Magdalena", "Tomasz", "Julia", "Kamil", "Oliwia", "Bartosz",
                "Zofia", "Jakub", "Natalia", "Adam", "Wiktoria", "Szymon", "Aleksandra", "Filip", "Gabriela", "Krzysztof",
                "Marta", "Paweł", "Ewa", "Jan", "Monika", "Robert", "Agnieszka", "Marek", "Karolina", "Łukasz"};

        String[] nazwiska = {"Kowalska", "Nowak", "Wiśniewska", "Wójcik", "Kowalczyk", "Kamińska", "Lewandowski", "Zielińska",
                "Szymański", "Dąbrowska", "Jankowska", "Mazur", "Kwiatkowska", "Wojciechowski", "Kaczmarek",
                "Zając", "Król", "Wróbel", "Kamiński", "Lis", "Pawlak", "Michalak", "Sikora", "Baran", "Dudek",
                "Wieczorek", "Stępień", "Jaworska", "Malinowska", "Adamczyk"};

        for (int i = 0; i < 30; i++) {
            Contractor c = new Contractor();
            c.setName(imiona[i] + " " + nazwiska[i]);
            c.setPeselOrNip("9" + String.format("%09d", 100000000 + i * 87654));
            c.setEmail(imiona[i].toLowerCase() + "." + nazwiska[i].toLowerCase() + "@example.com");
            c.setPhone("48" + (500 + i) + "111" + String.format("%03d", i + 100));
            c.setAddress(miasta[i % miasta.length] + ", ul. Testowa " + (i + 10) + "/m." + (i + 1));
            c.setAdditionalInfo(i < 20 ? "Najemca długoterminowy" : "Najemca okazjonalny");
            c.setContractorType(i < 22 ? "Najemca" : "Właściciel");

            contractorRepository.save(c);
            contractors.add(c);

            System.out.println("Utworzono kontrahenta: " + c.getName());
        }

        // ==================== 30 UMÓW Z BARDZO RÓŻNYMI DATAMI ====================
        String[] kategorie = {"Czynsz", "Kaucja", "Prąd", "Internet", "Woda i CO"};

        for (int i = 0; i < 30; i++) {
            Agreement agr = new Agreement();

            agr.setContractor(contractors.get(i));
            agr.setApartment(apartments.get(i));

            String kat = kategorie[i % kategorie.length];
            agr.setCategory(kat);

            // Bardzo zróżnicowane daty: od 2023-01 do 2026-12
            int rokStart = 2023 + (i / 10);
            int miesiacStart = 1 + (i % 12);
            LocalDate start = LocalDate.of(rokStart, miesiacStart, 1);

            // Długość umowy: od 6 miesięcy do 3 lat
            int lataTrwania = 1 + (i % 3);
            int dodatkoweMiesiace = i % 12;
            LocalDate end = start.plusYears(lataTrwania).plusMonths(dodatkoweMiesiace);

            agr.setDateFrom(start);
            agr.setDateTo(end);

            double kwota = switch (kat) {
                case "Czynsz" -> 1800.0 + i * 120;
                case "Kaucja" -> 5000.0 + i * 400;
                case "Prąd" -> 100.0 + i * 25;
                case "Internet" -> 70.0 + i * 15;
                case "Woda i CO" -> 250.0 + i * 60;
                default -> 200.0;
            };

            agr.setMonthlyNetValue(kwota);
            agr.setVatRate(kat.equals("Czynsz") || kat.equals("Kaucja") ? 23.0 : 8.0);
            agr.setDescription("Testowa umowa " + kat + " – a" + (i + 6) + " (" + start.getYear() + ")");
            agr.setTaxOperation(true);

            agreementRepository.save(agr);

            System.out.println("Utworzono umowę: " + kat + " | " + kwota + " zł/mc | " +
                    start + " → " + end + " | " + apartments.get(i).getCity());
        }

        System.out.println("=== Zakończono inicjalizację: 30 mieszkań (a6-a35), 30 kontrahentów, 30 umów z lat 2023–2026 ===");
        System.out.println("Teraz użyj przycisku 'Generuj wpisy z umów' w FinancialTab dla różnych miesięcy (np. od 2023 do 2026),");
        System.out.println("a następnie przetestuj AnalyticsTab – tabela miesięczna będzie pełna danych z wielu lat!");
    }
}