package bart.mieszkaniaj.repository;

import bart.mieszkaniaj.model.FinancialEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FinancialEntryRepository extends JpaRepository<FinancialEntry, Integer> {
}