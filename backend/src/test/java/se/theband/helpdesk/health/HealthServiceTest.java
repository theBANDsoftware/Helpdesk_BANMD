package se.theband.helpdesk.health;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.dao.DataAccessResourceFailureException;

/**
 * Testar HealthService utan databas, så att testerna går att köra överallt.
 * I stället för den riktiga databasen används ett påhittat repository.
 */
class HealthServiceTest {

    @Test
    void svararOkMedVersionNarDatabasenSvarar() {
        HealthRepository repository = new HealthRepository(null) {
            @Override
            public String findDatabaseVersion() {
                return "8.0.46";
            }
        };

        HealthResponse response = new HealthService(repository).check();

        assertThat(response.status()).isEqualTo("ok");
        assertThat(response.database()).isEqualTo("MySQL 8.0.46");
    }

    @Test
    void svararErrorNarDatabasenInteSvarar() {
        HealthRepository repository = new HealthRepository(null) {
            @Override
            public String findDatabaseVersion() {
                throw new DataAccessResourceFailureException("Communications link failure");
            }
        };

        HealthResponse response = new HealthService(repository).check();

        assertThat(response.status()).isEqualTo("error");
        assertThat(response.databaseReachable()).isFalse();
    }
}
