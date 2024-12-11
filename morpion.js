const carres = document.querySelectorAll('.carre');
const boutonRejouer = document.getElementById('boutonRejouer');
let joueur = 1;

carres.forEach((carre, index) => {
    carre.addEventListener('click', () => {
        if (carre.dataset.play) {
            return;
        }

        if (joueur === 1) {
            carre.style.backgroundPosition = 'center';
            carre.dataset.play = "1";
        } else {
            carre.style.backgroundPosition = 'right';
            carre.dataset.play = "2";
        }

        if (checkGagnant()) {
            alert(`Le joueur ${joueur} a gagné !`);
            boutonRejouer.style.display = 'block'; 
            return;
        }

        joueur = (joueur % 2) + 1;
    });
});

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


boutonRejouer.addEventListener('click', () => {
    carres.forEach(carre => {
        carre.style.backgroundPosition = '';
        delete carre.dataset.play;
    });
    joueur = 1; 
    boutonRejouer.style.display = 'none'; 
});
