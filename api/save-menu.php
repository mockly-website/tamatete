<?php
/**
 * save-menu.php — Endpoint di salvataggio del menu.
 *
 * - Accetta solo richieste POST
 * - Richiede sessione admin attiva (altrimenti 403)
 * - Verifica il token CSRF (altrimenti 403)
 * - Valida e sanitizza il JSON ricevuto
 * - Scrive su data/menu.json con JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
 */
require_once __DIR__ . '/../config.php';

start_secure_session();

// Solo POST.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['status' => 'error', 'message' => 'Metodo non consentito. Usa POST.'], 405);
}

// Autenticazione: l'utente deve essere loggato come admin.
if (!is_logged_in()) {
    json_response(['status' => 'error', 'message' => 'Non autorizzato. Sessione scaduta, accedi di nuovo.'], 403);
}

// Protezione CSRF: il token arriva nell'header HTTP o nei parametri POST.
$csrf = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? ($_POST['csrf_token'] ?? null);
if (!csrf_check(is_string($csrf) ? $csrf : null)) {
    json_response(['status' => 'error', 'message' => 'Token di sicurezza non valido. Ricarica la pagina e riprova.'], 403);
}

// Legge e decodifica il body JSON.
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data) || !array_key_exists('categorie', $data) || !is_array($data['categorie'])) {
    json_response(['status' => 'error', 'message' => 'JSON non valido: manca o è errato il campo "categorie".'], 400);
}

// ---------------------------------------------------------------
//  Validazione e sanitizzazione
// ---------------------------------------------------------------
// Funzione di sanitizzazione: rimuove tag HTML/script e spazi extra.
function sanitize_text($value): string {
    return trim(strip_tags((string) $value));
}

$clean = ['categorie' => []];

foreach ($data['categorie'] as $cat) {
    if (!is_array($cat)) {
        json_response(['status' => 'error', 'message' => 'Ogni categoria deve essere un oggetto con "nome" e "piatti".'], 400);
    }

    $nome = sanitize_text($cat['nome'] ?? '');
    if ($nome === '') {
        json_response(['status' => 'error', 'message' => 'Ogni categoria deve avere un nome non vuoto.'], 400);
    }

    $piatti = $cat['piatti'] ?? [];
    if (!is_array($piatti)) {
        json_response(['status' => 'error', 'message' => "La categoria \"$nome\" deve avere un array \"piatti\"."], 400);
    }

    $catClean = ['nome' => $nome, 'piatti' => []];

    foreach ($piatti as $p) {
        if (!is_array($p)) continue;

        $pNome = sanitize_text($p['nome'] ?? '');
        if ($pNome === '') continue; // i piatti senza nome vengono scartati

        $catClean['piatti'][] = [
            'nome'        => $pNome,
            'descrizione' => sanitize_text($p['descrizione'] ?? ''),
            'prezzo'      => sanitize_text($p['prezzo'] ?? ''),
            'disponibile' => (bool) ($p['disponibile'] ?? true)
        ];
    }

    $clean['categorie'][] = $catClean;
}

// ---------------------------------------------------------------
//  Scrittura su disco
// ---------------------------------------------------------------
$json = json_encode($clean, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
if ($json === false) {
    json_response(['status' => 'error', 'message' => 'Impossibile serializzare il menu.'], 500);
}

$written = file_put_contents(MENU_FILE, $json, LOCK_EX);
if ($written === false) {
    $lastError = error_get_last();
    json_response([
        'status'  => 'error',
        'message' => 'Impossibile scrivere il file menu.json. Verifica i permessi della cartella data/.',
        'detail'  => $lastError['message'] ?? ''
    ], 500);
}

json_response(['status' => 'ok', 'message' => 'Menu salvato con successo.']);