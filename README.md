# Dossier : LoLWager

## Binôme

- Olando Bazil
- Boumessaoud Abdelkader

## Sujet de l’application et ses principales fonctionnalités

LoLWager est une application innovante pour les joueurs de League of Legends qui souhaitent parier entre amis sur leurs parties préférées. Les utilisateurs peuvent créer un profil pour suivre vos résultats et votre historique de paris, rejoindre des forums de discussion pour partager leurs astuces et leurs pronostics, et parier sur des matchs en temps réel. Grâce à un système de jetons (monnaie virtuelle), chaque pari a une cote et c'est elle qui permet de connaître à l'avance, en fonction de la somme misée, le nombre de jetons gagné si l'événement se produit. Avec LoLWager, les joueurs de League of Legends peuvent s'immerger encore plus dans leur passion tout en ajoutant une dimension compétitive à leur expérience de jeu.

## API Web choisie

- Riot Games API : [Riot Developer Portal (riotgames.com)](https://developer.riotgames.com/apis)

Nous utiliserons l'API Riot Games pour collecter des données sur les parties de League of Legends. Cette API fournit des données sur les parties récentes, les joueurs, les champions, les matchs professionnels et les ligues. Pour accéder à cette API, une clé d'API est nécessaire, qui peut être obtenue gratuitement à partir du site officiel de Riot Games.

Pour notre application, nous utiliserons les critères suivants pour la recherche de données sur les parties de League of Legends :

- Nom d'utilisateur
- ID de joueur
- Champion joué
- Résultat de la partie
- Durée de la partie

Nous pouvons également obtenir des informations sur les matchs professionnels, y compris les résultats, les équipes et les joueurs impliqués. Les données fournies par cette API incluent :

- Les détails de chaque joueur, y compris leur nom, leur niveau de compétence et leur score de classement
- Les statistiques pour chaque champion, y compris le nombre de fois joué et le taux de victoire
- Les résultats de chaque partie, y compris les joueurs impliqués, le résultat et la durée de la partie
- Les équipes et les joueurs impliqués dans les matchs professionnels

Nous utiliserons ces informations avoir accès à des statistiques détaillées sur les parties de League of Legends, ainsi que des informations sur les joueurs, les champions et les équipes. Les données seront utilisées pour calculer des cotes de paris et permettre aux utilisateurs de placer des paris sur les parties.

## Fonctionnalités de l’application

- Parier sur des parties de League of Legends
- Créer un profil pour suivre les résultats et l'historique de paris
- Parier sur des matchs en temps réel avec un système de jetons et des cotes de paris
- Utiliser des critères de recherche tels que le nom d'utilisateur, l'ID de joueur et l’ID de la partie
- Obtenir des informations sur les matchs professionnels, y compris les résultats, les équipes et les joueurs impliqués
- Afficher des statistiques détaillées sur les parties de League of Legends, ainsi que des informations sur les joueurs, les champions et les équipes
- Composante Sociale:
    - S’ajouter entre amis
    - Rejoindre de lobbies (public/privé)
    - Rejoindre des forums de discussion pour partager des astuces et des pronostics
    - Voir des mises à jour a propos des ses amis sur la page d'accueil

## Cas d’utilisations classiques de l’application

- Olando s'inscrit et se connecte à l'application, une page de personnalisation de profil lui propose de choisir un pseudo, modifier sa bio, choisir son champion préféré, choisir une photo de profil … ect.
- Abdelkader se connecte à l'application, il peut créer où rejoindre un lobby public (par nom du lobby) ou privé (via un code d’invitation), la page suivante dédiée au lobby lui permet de commencer a parier.
- Olando peut ajouter d'autre utilisateur en amis, ainsi voir leurs exploits en page d'accueil.
- Abdelkader peut accéder a la section Forum, pour créer un topic, ou en rejoindre un et commencer a discuter.

## Données

- SGBD : MySQL

**Utilisateur**

| id (primary_key) | pseudo | mail | password | Bio | profil_pic | wallet | friend_list | ratio_w_l | fav_champion |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 19e4c3u7f | abdelkader_bm | abdelkader.boumessaoud@etu.sorbonne-universite.fr | qwerty123 | 2023 loseless run | pp_04 | 1000 | olando_bz,
olando_bz_2,
abdelkader_bm_smurf | n/a | Viego |
| 1d8a7h2p6 | olando_bz | olando.bazil@etu.sorbonne-universite.fr | 123azerty | n/a | pp_19 | 2783 | abdelkader_bm,
abdelkader_bm_smurf | 65% | Jinx |

**Lobby**

| url (primary_key) | title | nb_players | visibility |
| --- | --- | --- | --- |
| https://www.LoLWager.fr/lobby-79tj1n7b2f | Who Will Come Out on Top? | 20 | public |

Forum

| id (primary_key) | name | body | user_id (foreign_key) | category | created_at |
| --- | --- | --- | --- | --- | --- |
| fedcba5739 | most played champion | what could be the most played champion in 2023 | 19e4c3u7f | Suggestions and Feedback | 2023-03-29 |

**Posts**

| post_id | post_content | post_date | post_forum (foreign_key) | post_by (foreign_key) |
| --- | --- | --- | --- | --- |
| hjaytf7254 | all time played champion is Viego, could be the same for 2023 | 2023-03-29 | fedcba5739 | 19e4c3u7f |

## **Mise à jour de données**

Nous utilisons l'API “Riot Games API” pour récupérer les données des parties de League of Legends en temps réel. Toutes les heures, nous collectons les données de 100 parties récentes et mettons à jour notre base de données avec ces informations pour permettre aux utilisateurs de parier sur les événements les plus récents. Les données collectées sont stockées temporairement pour permettre aux utilisateurs de parier sur les parties en temps réel, et sont supprimées après 24 heures pour libérer de l'espace de stockage.

## **Serveur**

Nous utiliserons également une approche basée sur les ressources pour notre application. Les 3 composants principaux seront l'inscription, la connexion et la récupération de données de parties.

- Inscription
    - Le client enverra une requête POST avec les informations d'inscription.
    - Le serveur répondra avec une réponse d'inscription ou une erreur.
- Connexion
    - Le client enverra une requête POST avec les informations de connexion.
    - Le serveur répondra avec un jeton JWT ou une erreur.
- Données de parties
    - Récupération de ces donnés via le jeton JWT

## Plan du site

![image.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/7f637922-ede0-470f-92ee-8f9c84ff6d85/image.png)

## **Requêtes et Réponses**

Les requêtes seront effectuées en utilisant le protocole HTTP. Les paramètres nécessaires pour effectuer chaque requête seront inclus dans la partie "Parameters" de la requête HTTP. Le token JWT sera inclus dans la partie "Header".

Les réponses renvoyées par le serveur seront au format JSON. Pour les ressources représentant des parties, les réponses JSON incluront des données telles que :

- Les détails de chaque joueur participant à la partie, y compris leur pseudo, leur ID de joueur, leur champion, leur position, leur score et leur niveau d'objet
- Les détails de la partie elle-même, tels que la durée, le mode de jeu, la carte, les tours détruites et les objectifs réalisés
- Les événements de la partie, tels que les morts, les éliminations, les assistances, les prises d'objectifs, les améliorations d'objet, les sorts d'invocateur utilisés, les dégâts infligés et subis, les soins et les boucliers octroyés
- ……..