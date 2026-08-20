<?php
/**
 * config.php — Configurazione condivisa del sistema menu di Ta Matete
 *
 * Qui si impostano le credenziali dell'area admin e i percorsi dei file.
 * Compatibile con hosting condiviso (es. Aruba) e con il server locale
 * `php -S localhost:8000` lanciato dalla cartella radice del progetto.
 */

// ---------------------------------------------------------------------
//  CREDENZIALI ADMIN
// ---------------------------------------------------------------------

// Username per l'accesso all'area di amministrazione.
define('ADMIN_USERNAME', 'admin');

// Password salvata come HASH (mai in chiaro).
// Hash bcrypt generato con: password_hash('tamatete2026', PASSWORD_DEFAULT)
// Password predefinita: tamatete2026
//
// Per cambiare password genera un nuovo hash con il comando PHP:
//   php -r "echo password_hash('NUOVA_PASSWORD', PASSWORD_DEFAULT), PHP_EOL;"
// e incolla il risultato al posto della stringa qui sotto.
define('ADMIN_PASSWORD_HASH', '$2b$12$GFIPs3o5rVtP5lfUrCJCaujJKLgfTWw.v0V/AnPNfi2qP/wfslIjC');

// ---------------------------------------------------------------------
//  PERCORSI FILE
// ---------------------------------------------------------------------

// Percorso assoluto del file JSON del menu. __DIR__ rende il percorso
// indipendente dalla cartella di lavoro corrente (funziona anche sotto
// php -S e su hosting condiviso).
define('MENU_FILE', dirname(__FILE__) . '/data/menu.json');

// ---------------------------------------------------------------------
//  SESSIONE
// ---------------------------------------------------------------------

// Avvia una sessione PHP con cookie httpOnly e SameSite=Lax.
function start_secure_session(): void {
    if (session_status() === PHP_SESSION_NONE) {
        session_set_cookie_params([
            'httponly' => true,
            'samesite' => 'Lax'
        ]);
        session_start();
    }
}

// L'utente è autenticato come admin?
function is_logged_in(): bool {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

// Blocca l'accesso alle pagine admin per chi non è autenticato.
function require_login(): void {
    if (!is_logged_in()) {
        header('Location: login.php');
        exit;
    }
}

// ---------------------------------------------------------------------
//  PROTEZIONE CSRF
// ---------------------------------------------------------------------

// Restituisce (creandolo se serve) il token CSRF della sessione.
function csrf_token(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

// Verifica un token CSRF in modo sicuro (confronto a tempo costante).
function csrf_check(?string $token): bool {
    return is_string($token) && hash_equals($_SESSION['csrf_token'] ?? '', $token);
}

// ---------------------------------------------------------------------
//  RISPOSTE JSON
// ---------------------------------------------------------------------

// Invia una risposta JSON e termina lo script.
function json_response(array $payload, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}