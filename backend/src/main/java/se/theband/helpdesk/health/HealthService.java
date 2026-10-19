package se.theband.helpdesk.health;

import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

/** Kontrollerar att backend når databasen. */
@Service
public class HealthService {

    private final HealthRepository healthRepository;

    public HealthService(HealthRepository healthRepository) {
        this.healthRepository = healthRepository;
    }

    public HealthResponse check() {
        try {
            return new HealthResponse("ok", "MySQL " + healthRepository.findDatabaseVersion());
        } catch (DataAccessException e) {
            return new HealthResponse("error", e.getMostSpecificCause().getMessage());
        }
    }
}
