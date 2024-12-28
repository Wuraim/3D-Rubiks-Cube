import AnsiToHtml from "ansi-to-html";

// Configurer la conversion ANSI vers HTML
const ansiConverter = new AnsiToHtml({
  fg: "#0f0", // Couleur par défaut du texte
  bg: "#000", // Couleur de fond
  newline: true, // Gérer les sauts de ligne
});

// Sélectionner le terminal
const terminal = document.getElementById("terminal") as HTMLDivElement;

// Fonction pour ajouter un log au terminal
function addLog(message: string): void {
  // Convertir le message ANSI en HTML
  const htmlMessage = ansiConverter.toHtml(message);

  // Créer une div pour chaque log
  const logLine = document.createElement("div");
  logLine.innerHTML = htmlMessage;

  terminal.appendChild(logLine);

  // Faire défiler automatiquement
  terminal.scrollTop = terminal.scrollHeight;
}

// Rediriger les sorties console
(["log", "error", "warn", "info"] as const).forEach((method) => {
  const originalMethod = console[method];
  console[method] = function (...args: unknown[]): void {
    args.forEach((arg) => {
      if (typeof arg === "string") {
        addLog(arg);
      } else {
        // Afficher les objets au format JSON
        addLog(JSON.stringify(arg, null, 2));
      }
    });
    originalMethod.apply(console, args);
  };
});

export function clearLog(): void {
  terminal.innerHTML = '';
  console.clear();
}