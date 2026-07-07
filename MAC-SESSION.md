# 🍎 Session Mac — MonSport → Xcode (checklist)

Le projet iOS est **déjà généré** (dossier `ios/`). Voici les étapes à faire sur le Mac de ta chérie.

## ✅ Déjà fait (côté Windows)
- Projet Capacitor + dossier `ios/App/App.xcodeproj`
- Plugins : caméra, GPS, notifications
- Permissions (Info.plist) rédigées
- Swift Package Manager (SPM) → **pas de CocoaPods nécessaire**

## 📦 Étape 1 — Amener le projet sur le Mac
Copie **tout le dossier du projet** (sauf `node_modules/`, qui se régénère) sur le Mac.
- Le plus simple : **GitHub** (je te guide pour le push), ou une clé USB / un partage cloud.

## 🖥️ Étape 2 — Sur le Mac (Terminal)
```bash
cd chemin/vers/le/projet
npm install          # régénère les dépendances
npx cap sync ios     # synchronise le projet iOS
npx cap open ios     # ouvre le projet dans Xcode
```

## 🔨 Étape 3 — Dans Xcode
1. Sélectionne le projet **App** (à gauche) → onglet **Signing & Capabilities**.
2. **Team** : connecte **ton** compte Apple Developer (ton Apple ID) → choisis ton équipe.
3. **Bundle Identifier** : `com.yohan.monsport` (ou change-le si tu veux, une seule fois).
4. Branche ton iPhone en USB → sélectionne-le en haut → **▶ Run** pour tester en vrai.
5. Pour publier : **Product → Archive** → **Distribute App** → App Store Connect.

## 🏬 Étape 4 — App Store Connect
- Créer l'app (nom, catégorie « Forme et santé »)
- Coller l'URL de la **politique de confidentialité** : `https://graceful-capybara-5c8190.netlify.app/confidentialite.html`
- Ajouter captures d'écran + description (je te les prépare)
- **Soumettre** → review Apple (~1 à 3 jours)

## 🔁 Pour les mises à jour futures
Quand on modifie l'app : `npx cap sync ios` puis re-archive dans Xcode. C'est tout.

> ℹ️ Le nom affiché de l'app (« MonSport ») se change dans `capacitor.config.json` (`appName`) + `Info.plist` (`CFBundleDisplayName`) — je peux le faire à tout moment.
