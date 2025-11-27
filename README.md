# Projet-Web-Logement-UQAC
Projet web facilitant la recherche de logements pour les étudiants de l’UQAC : annonces vérifiées, carte interactive, outils de comparaison et interface simple pour connecter propriétaires et étudiants.

Ce site Web a été conçu comme une application frontale entièrement statique, en utilisant uniquement les technologies standards du Web : HTML5 pour la structure des pages, CSS3 pour le design et la mise en page responsive, ainsi que JavaScript ES6+ pour la logique interactive (navigation entre les sections, chargement des données, filtres, favoris, modale de détails et formulaires). Les données des logements sont stockées dans un fichier data.json au format JSON, qui joue le rôle de source de données simulée consommée par le script JavaScript.

#Technologies Utilisées
HTML5 pour la structure des pages (index.html), sections sémantiques (header, main, section, footer) et composant modal.​

CSS3 avec variables CSS (custom properties), grid et flexbox pour la mise en page responsive et le design (fichier style.css).​

JavaScript ES6+ côté client pour la logique : chargement du JSON avec fetch, filtrage, gestion des favoris via localStorage, navigation monopage, modale de détail et formulaire de contact (fichier script.js).​

JSON comme pseudo‑base de données des logements (data.json) consommée par le front‑end.​
