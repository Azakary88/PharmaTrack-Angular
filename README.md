# 💊 PharmaTrack

PharmaTrack est une application Angular permettant de gérer les stocks et la distribution de produits pharmaceutiques.
Elle utilise Angular pour le front-end et json-server comme API simulée pour la gestion des données locales.

# 🚀 Installation et exécution du projet
1. Cloner le dépôt
````bash
git clone https://github.com/Azakary88/PharmaTrack-Angular.git
````
2. Se rendre dans le dossier du projet

````bash
cd PharmaTrack-Angular
````
3. Installer les dépendances

````bash
npm install
````
4. Installer json-server (simulateur d’API)

````bash
npm install -g json-server
````
5. Démarrer le serveur JSON

Ce serveur permet de simuler une base de données locale à partir du fichier db.json.

````bash
json-server --watch db.json

````
# 👉 Par défaut, le serveur tourne sur :
http://localhost:3000

6. Lancer l’application Angular

Dans un autre terminal :

```bash
ng serve
```

# Puis ouvre ton navigateur à l’adresse :
👉 http://localhost:4200

