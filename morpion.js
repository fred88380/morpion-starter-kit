const carres = document.querySelectorAll('.carre');
const boutonRejouer = document.getElementById('boutonRejouer');
const titre = document.getElementById('titre');
let joueur = 1;
let jeuActif = true;
let mode = "joueur"; // Par défaut : mode joueur contre joueur
let difficulte = "facile"; // Par défaut : difficulté facile

// Création des boutons dynamiquement
const boutonModeJoueur = document.createElement('button');
boutonModeJoueur.textContent = "Mode Joueur vs Joueur";
const boutonModeOrdi = document.createElement('button');
boutonModeOrdi.textContent = "Mode Joueur vs Ordinateur";
const boutonFacile = document.createElement('button');
boutonFacile.textContent = "Facile";
const boutonDifficile = document.createElement('button');
boutonDifficile.textContent = "Difficile";

// Application de styles aux boutons
[boutonModeJoueur, boutonModeOrdi, boutonFacile, boutonDifficile].forEach(bouton => {
    bouton.style.padding = "10px 20px";
    bouton.style.marginLeft = "10px";
    bouton.style.fontSize = "16px";
    bouton.style.cursor = "pointer";
});

// Placement des boutons
boutonRejouer.parentNode.insertBefore(boutonModeJoueur, boutonRejouer.nextSibling);
boutonRejouer.parentNode.insertBefore(boutonModeOrdi, boutonModeJoueur.nextSibling);
boutonRejouer.parentNode.insertBefore(boutonFacile, boutonModeOrdi.nextSibling);
boutonRejouer.parentNode.insertBefore(boutonDifficile, boutonFacile.nextSibling);

// Réinitialisation du jeu
const resetGame = () => {
    carres.forEach(carre => {
        carre.style.backgroundPosition = '';
        delete carre.dataset.play;
    });
    joueur = 1;
    jeuActif = true;
    titre.textContent = "Jeu du Morpion";
};

// Logique des cases
carres.forEach((carre, index) => {
    carre.addEventListener('click', () => {
        if (!jeuActif || carre.dataset.play) {
            return;
        }

        if (mode === "joueur") {
            // Mode Joueur vs Joueur
            jouerTour(carre);
        } else if (mode === "ordi") {
            // Mode Joueur vs Ordinateur
            jouerTour(carre);
            if (jeuActif) {
                jouerOrdi();
            }
        }
    });
});

// Fonction pour jouer un tour
const jouerTour = (carre) => {
    if (joueur === 1) {
        carre.style.backgroundPosition = 'center';
        carre.dataset.play = "1";
    } else {
        carre.style.backgroundPosition = 'right';
        carre.dataset.play = "2";
    }

    if (checkGagnant()) {
        titre.textContent = `Le joueur ${joueur} a gagné !`;
        jeuActif = false;
        return;
    }

    const egalite = Array.from(carres).every(carre => carre.dataset.play);
    if (egalite) {
        titre.textContent = "Égalité !";
        jeuActif = false;
        return;
    }

    joueur = (joueur % 2) + 1;
};

// Fonction pour le tour de l'ordinateur
const jouerOrdi = () => {
    if (difficulte === "facile") {
        jouerOrdiFacile();
    } else if (difficulte === "difficile") {
        jouerOrdiDifficile();
    }
};

const jouerOrdiFacile = () => {
    const casesLibres = Array.from(carres).filter(carre => !carre.dataset.play);
    if (casesLibres.length > 0) {
        const choix = Math.floor(Math.random() * casesLibres.length);
        const carre = casesLibres[choix];
        carre.style.backgroundPosition = 'right';
        carre.dataset.play = "2";

        if (checkGagnant()) {
            titre.textContent = "L'ordinateur a gagné !";
            jeuActif = false;
            return;
        }

        const egalite = Array.from(carres).every(carre => carre.dataset.play);
        if (egalite) {
            titre.textContent = "Égalité !";
            jeuActif = false;
            return;
        }

        joueur = 1;
    }
};

const jouerOrdiDifficile = () => {
    // L'ordinateur essaie de gagner ou de bloquer
    const casesLibres = Array.from(carres).filter(carre => !carre.dataset.play);
    let choix = null;

    // Vérifier si l'ordinateur peut gagner
    choix = trouverMouvementGagnant("2");
    if (choix !== null) {
        jouerTour(carres[choix]);
        return;
    }

    // Bloquer l'adversaire
    choix = trouverMouvementGagnant("1");
    if (choix !== null) {
        jouerTour(carres[choix]);
        return;
    }

    // Sinon, jouer aléatoirement
    if (casesLibres.length > 0) {
        choix = Math.floor(Math.random() * casesLibres.length);
        jouerTour(casesLibres[choix]);
    }
};

const trouverMouvementGagnant = (joueur) => {
    const resultatGagnant = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let combinaison of resultatGagnant) {
        const [a, b, c] = combinaison;
        if (
            carres[a].dataset.play === joueur &&
            carres[b].dataset.play === joueur &&
            !carres[c].dataset.play
        ) {
            return c;
        }
        if (
            carres[a].dataset.play === joueur &&
            !carres[b].dataset.play &&
            carres[c].dataset.play === joueur
        ) {
            return b;
        }
        if (
            !carres[a].dataset.play &&
            carres[b].dataset.play === joueur &&
            carres[c].dataset.play === joueur
        ) {
            return a;
        }
    }
    return null;
};

// Vérification des gagnants
const checkGagnant = () => {
    const resultatGagnant = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return resultatGagnant.some(combinaison => {
        const [a, b, c] = combinaison;
        return carres[a].dataset.play &&
            carres[a].dataset.play === carres[b].dataset.play &&
            carres[a].dataset.play === carres[c].dataset.play;
    });
};

// Gestion des boutons
boutonModeJoueur.addEventListener('click', () => {
    mode = "joueur";
    resetGame();
    titre.textContent = "Mode Joueur vs Joueur";
});

boutonModeOrdi.addEventListener('click', () => {
    mode = "ordi";
    resetGame();
    titre.textContent = "Mode Joueur vs Ordinateur";
});

boutonFacile.addEventListener('click', () => {
    difficulte = "facile";
    titre.textContent = "Difficulté : Facile";
});

boutonDifficile.addEventListener('click', () => {
    difficulte = "difficile";
    titre.textContent = "Difficulté : Difficile";
});

boutonRejouer.addEventListener('click', resetGame);
