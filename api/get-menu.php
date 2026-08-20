<?php
/**
 * get-menu.php — Endpoint pubblico che restituisce il menu in JSON.
 *
 * Legge data/menu.json e lo restituisce con header Content-Type JSON.
 * Non richiede autenticazione: viene usato dal sito pubblico e dall'editor.
 */
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if (!file_exists(MENU_FILE)) {
    json_response(['status' => 'error', 'message' => 'Menu non disponibile.'], 500);
}

$raw = file_get_contents(MENU_FILE);
if ($raw === false) {
    json_response(['status' => 'error', 'message' => 'Impossibile leggere il file del menu.'], 500);
}

$menu = json_decode($raw, true);
if (!is_array($menu)) {
    json_response(['status' => 'error', 'message' => 'File del menu non valido.'], 500);
}

// Restituisce la struttura così com'è: { "categorie": [ ... ] }
echo json_encode($menu, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);