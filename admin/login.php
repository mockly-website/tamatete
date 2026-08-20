<?php
/**
 * login.php — Accesso all'area admin del menu Ta Matete
 *
 * Verifica le credenziali con password_verify() e avvia la sessione.
 */
require_once __DIR__ . '/../config.php';

start_secure_session();

// Se sei già autenticato vai direttamente all'editor.
if (is_logged_in()) {
    header('Location: editor.php');
    exit;
}

$error = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = (string) ($_POST['password'] ?? '');

    if ($username === '' || $password === '') {
        $error = 'Inserisci username e password.';
    } elseif ($username === ADMIN_USERNAME && password_verify($password, ADMIN_PASSWORD_HASH)) {
        // Rigenera l'ID sessione per prevenire il session fixation.
        session_regenerate_id(true);
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_username'] = $username;
        header('Location: editor.php');
        exit;
    } else {
        // Piccola pausa per rallentare eventuali tentativi di brute force.
        usleep(500000);
        $error = 'Credenziali non valide.';
    }
}
?>
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>Accesso – Gestione Menu Ta Matete</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0b0d12;
      --surface: #14171f;
      --surface-2: #1a1e28;
      --border: #232833;
      --text: #e8eaf0;
      --muted: #8b93a7;
      --volt: #d3f24b;
      --violet: #8b5cf6;
      --coral: #ff7a6e;
      --danger: #ff5d5d;
      --radius: 12px;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
      background:
        radial-gradient(900px 400px at 80% -10%, rgba(139, 92, 246, 0.14), transparent 60%),
        radial-gradient(700px 400px at 10% 110%, rgba(211, 242, 75, 0.08), transparent 60%),
        var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .login-card {
      width: 100%;
      max-width: 380px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 36px 32px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
    }
    .login-logo {
      text-align: center;
      margin-bottom: 8px;
    }
    .login-logo .brand {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 0.02em;
    }
    .login-logo .brand span { color: var(--volt); }
    .login-logo .sub {
      display: block;
      margin-top: 4px;
      font-size: 12px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--muted);
    }
    h1 {
      font-size: 18px;
      font-weight: 600;
      text-align: center;
      margin: 20px 0 24px;
    }
    .field { margin-bottom: 16px; }
    label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--muted);
      margin-bottom: 6px;
    }
    input {
      width: 100%;
      padding: 11px 14px;
      font-size: 15px;
      font-family: inherit;
      color: var(--text);
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: 8px;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    input:focus {
      border-color: var(--violet);
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
    }
    .error {
      background: rgba(255, 93, 93, 0.1);
      border: 1px solid rgba(255, 93, 93, 0.35);
      color: var(--coral);
      font-size: 13px;
      padding: 10px 12px;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    button[type="submit"] {
      width: 100%;
      padding: 12px;
      font-size: 15px;
      font-weight: 600;
      font-family: inherit;
      color: #0b0d12;
      background: var(--volt);
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: filter 0.15s, transform 0.05s;
    }
    button[type="submit"]:hover { filter: brightness(1.08); }
    button[type="submit"]:active { transform: scale(0.98); }
    .back {
      display: block;
      text-align: center;
      margin-top: 20px;
      font-size: 13px;
      color: var(--muted);
      text-decoration: none;
    }
    .back:hover { color: var(--text); }
    .hint {
      margin-top: 18px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
      font-size: 11.5px;
      color: var(--muted);
      text-align: center;
    }
  </style>
</head>
<body>
  <form class="login-card" method="post" action="login.php" autocomplete="off">
    <div class="login-logo">
      <span class="brand">Ta <span>Matete</span></span>
      <span class="sub">Gestione Menu</span>
    </div>

    <h1>Area amministrazione</h1>

    <?php if ($error): ?>
      <div class="error" role="alert"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></div>
    <?php endif; ?>

    <div class="field">
      <label for="username">Username</label>
      <input type="text" id="username" name="username" required autofocus autocomplete="username">
    </div>

    <div class="field">
      <label for="password">Password</label>
      <input type="password" id="password" name="password" required autocomplete="current-password">
    </div>

    <button type="submit">Accedi</button>

    <a class="back" href="../menu.html">&larr; Torna al sito</a>

    <p class="hint">Sessione protetta. Accesso riservato a Ta Matete.</p>
  </form>
</body>
</html>