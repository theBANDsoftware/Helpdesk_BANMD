package se.theband.helpdesk.health;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

/**
 * Pratar med databasen. Vanliga repositories i projektet blir JPA-interface
 * (extends JpaRepository), men den här frågan behöver ingen tabell.
 */
@Repository
public class HealthRepository {

    private final JdbcClient jdbcClient;

    public HealthRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public String findDatabaseVersion() {
        return jdbcClient.sql("SELECT VERSION()").query(String.class).single();
    }
}
