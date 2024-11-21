# Reseau Social

## Description

Ce projet est une application de réseau social construite avec Node.js, Express, Sequelize, SQLite, GraphQL et Socket.io. Il permet aux utilisateurs de s'inscrire, se connecter, créer des publications, commenter, s'abonner à d'autres utilisateurs et discuter en temps réel.

## Prérequis

- Node.js (version 14 ou supérieure)
- npm ou pnpm

## Installation

1. Clonez le dépôt :

```sh
git clone https://github.com/Theo-mrhd/instantagram.git
cd instantagram
```

2. Installez les dépendances :

```sh
pnpm install
ou
npm install
```

3. Créer un fichier .env à la racine du projet et ajoutez les variables d'environnement suivantes :

```sh
JWT_SECRET=your_jwt_secret
```

## Démarrage du serveur

1. Démarrez le serveur :

```sh
pnpm run start
npm run start
```

## Message webswocket

Pour envoyer un message à un utilisateur, il faut d'abord que vous vous suiviez puis avec swagger aller au niveau du create pour lancer la discussion puis aller sur le front et vous retrouverez les discussions. À ce moment la vous pourrez discuter avec lui.
