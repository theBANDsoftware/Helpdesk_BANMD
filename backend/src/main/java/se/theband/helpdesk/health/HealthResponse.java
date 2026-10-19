package se.theband.helpdesk.health;

/**
 * Svaret från GET /api/health.
 *
 * @param status   "ok" om databasen svarade, annars "error"
 * @param database databasens version, eller felmeddelandet om den inte svarade
 */
public record HealthResponse(String status, String database) {

    public boolean databaseReachable() {
        return "ok".equals(status);
    }
}
