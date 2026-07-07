# 🚀 MonSport → App Store (guide de bascule)

Objectif : transformer la PWA MonSport en vraie app iOS native (via Capacitor) et la publier sur l'App Store. On réutilise **100 % du code web existant**.

---

## 📋 Prérequis (à réunir)

| Élément | Détail | Coût |
|---|---|---|
| Mac + Xcode | Emprunté — pour compiler/signer/soumettre | 0 € (emprunt) |
| Compte Apple Developer | À créer sur developer.apple.com | 99 €/an |
| URL politique de confidentialité | `https://<ton-site>/confidentialite.html` (déjà prête) | 0 € |
| Node.js | Déjà installé côté Windows | 0 € |

---

## 🖥️ Étape 1 — Préparer le socle (sur Windows, sans Mac)

Dans le dossier du projet :

```bash
# 1. Initialiser le projet Node (si pas déjà fait)
npm init -y

# 2. Installer Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/ios

# 3. Copier les fichiers web dans le dossier www/ (webDir)
#    (index.html, app.js, manifest.json, icon.svg, sw.js, confidentialite.html)
mkdir www
cp index.html app.js manifest.json icon.svg sw.js confidentialite.html www/

# 4. Ajouter la plateforme iOS (crée le dossier ios/)
npx cap add ios

# 5. Plugins natifs utiles
npm install @capacitor/geolocation @capacitor/camera @capacitor/local-notifications
#   HealthKit (communauté) :
npm install @perfood/capacitor-healthkit

# 6. Synchroniser
npx cap sync ios
```

> `capacitor.config.json` est déjà configuré (appId `com.yohan.monsport`, appName `MonSport`).

---

## 🍎 Étape 2 — Sur le Mac (session courte)

```bash
# Ouvrir le projet dans Xcode
npx cap open ios
```

Dans Xcode :
1. **Signing & Capabilities** → connecte ton compte Apple Developer, choisis ton Team.
2. Ajoute les **capacités** : HealthKit, Background Modes (Location), Push (si notifs).
3. Renseigne les **descriptions de permission** dans `Info.plist` :
   - `NSHealthShareUsageDescription` = « MonSport lit tes données de santé pour t'afficher tes tendances. »
   - `NSLocationWhenInUseUsageDescription` = « Pour tracer ton itinéraire pendant une séance cardio. »
   - `NSCameraUsageDescription` = « Pour scanner les codes-barres alimentaires. »
   - `NSPhotoLibraryUsageDescription` = « Pour ajouter tes photos de progression. »
4. **Product → Archive** → **Distribute App** → App Store Connect.

---

## 🏬 Étape 3 — App Store Connect (fiche)

Sur appstoreconnect.apple.com :
- Créer l'app (nom **MonSport**, bundle `com.yohan.monsport`)
- **Politique de confidentialité** : coller l'URL `.../confidentialite.html`
- **Confidentialité des données** : déclarer Santé, Localisation, Photos (stockées sur l'appareil)
- **Captures d'écran** (obligatoires) : je te les prépare
- **Description, mots-clés, catégorie** (Forme et santé) : je te les rédige
- **Prix** : gratuit (ou payant / achats intégrés — voir ci-dessous)
- **Soumettre pour review** → réponse Apple en ~1 à 3 jours

---

## 💼 Décisions « vrai produit avec Kévin » (à planifier)

1. **Comptes utilisateurs + cloud** : aujourd'hui les données sont locales. Pour de vrais utilisateurs et de la synchro multi-appareils, prévoir un backend (Supabase/Firebase, gratuit au début).
2. **Monétisation** : gratuit ? payant ? contenu premium ? ⚠️ Le contenu numérique premium doit passer par les **achats intégrés Apple** (commission 15–30 %).
3. **Contenu de Kévin** : accord écrit + modèle (crédit + liens, licence, ou partenariat avec partage de revenus). À intégrer seulement après son OK.
4. **Mentions légales / société** : si vente, prévoir statut (auto-entrepreneur…) et CGU.

---

## ✅ Ce que je prépare côté Windows (moi)

- [x] Politique de confidentialité (`confidentialite.html`)
- [x] `capacitor.config.json`
- [ ] Icônes iOS (toutes tailles) + splash screen
- [ ] Textes de la fiche App Store (description, mots-clés)
- [ ] Captures d'écran
- [ ] Câblage des plugins natifs (HealthKit, caméra, GPS, notifs) dans le code

Quand tu as le Mac → étapes 2 et 3, je te guide en direct.
