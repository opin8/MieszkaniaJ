package bart.mieszkaniaj.repository;

import bart.mieszkaniaj.model.Agreement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgreementRepository extends JpaRepository<Agreement, Integer> {
    // Możesz dodać metody filtrujące, np. findByContractorId, findByApartmentId, findByCategory
}