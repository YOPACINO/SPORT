# MonSport 💪

Ton app de suivi sport, 100 % gratuite, qui fonctionne sur iPhone (et Android) sans compte, sans Mac, sans rien payer. Toutes tes données restent sur ton téléphone.

## Ce que l'app fait

- **Muscu** : exercices rangés par muscle (Pecs, Dos, Jambes, Épaules, Bras, Abdos). Tu notes poids + reps + séries + photo, et tu vois ta **courbe de progression** + ton record (PR).
- **Cardio** : course / vélo / marche avec **itinéraire GPS sur carte** (comme Strava), distance, durée, allure, vitesse. Historique de tes sorties avec le tracé.
- **Photos d'évolution** : galerie pour suivre ton évolution physique dans le temps.
- **Santé** : importe ton fichier d'export **Apple Santé** (`.zip`) pour voir ton **sommeil**, tes **pas**, ta **fréquence cardiaque** et tes **séances Apple Watch** en graphiques. À réimporter de temps en temps pour rester à jour (l'accès en temps réel n'existe qu'en app native).
- **Bien-être** : routines d'**étirements guidées** avec minuteur, routines **soin/beauté** à cocher, et **rappels** (notifications) à l'heure de ton choix.

## Comment l'installer sur ton iPhone

1. Mets les fichiers en ligne (voir ci-dessous) → tu obtiens un lien `https://...`
2. Ouvre ce lien dans **Safari** sur ton iPhone
3. Bouton **Partager** (carré avec flèche) → **« Sur l'écran d'accueil »**
4. L'app apparaît avec son icône comme une vraie app 🎉
5. Pour les **notifications** : ouvre l'app depuis l'écran d'accueil, va dans Bien-être → Rappels, active-les et autorise.

Pour la **partager à tes collègues** : envoie-leur simplement le lien, ils font pareil.

## Mettre en ligne gratuitement (au choix)

### Option simple — Netlify Drop (2 min, sans compte technique)
1. Va sur https://app.netlify.com/drop
2. Glisse-dépose le dossier `SPORT` entier
3. Tu obtiens un lien du type `https://ton-app.netlify.app` — c'est tout !

### Option GitHub Pages
1. Crée un dépôt GitHub, mets-y ces fichiers
2. Settings → Pages → branche `main` → dossier `/root`
3. Lien : `https://ton-pseudo.github.io/nom-du-repo`

## Fichiers

- `index.html` — l'interface
- `app.js` — toute la logique
- `manifest.json` + `icon.svg` — pour l'installation type app
- `sw.js` — fonctionnement hors-ligne

## Note

La synchro avec **Apple Santé** n'est pas possible en version web (réservée aux apps natives App Store, qui coûtent 99 €/an + un Mac). Tout le reste fonctionne ici gratuitement.
