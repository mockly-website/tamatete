<?php
/**
 * logout.php — Termina la sessione admin e torna alla pagina di login.
 */
require_once __DIR__ . '/../config.php';

start_secure_session();

// Svuota la sessione e cancella il cookie di sessione.
$_SESSION = [];
if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params['path'], $params['domain'], $params['secure'], $params['httponly']);
}
session_destroy();

header('Location: login.php');
exit;