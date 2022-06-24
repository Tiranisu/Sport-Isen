```
_____                  _   _ _____  
/  ___|                | | ( )_   _|  
\ `--. _ __   ___  _ __| |_|/  | | ___  ___ _ __  
 `--. \ '_ \ / _ \| '__| __|   | |/ __|/ _ \ '_ \  
/\__/ / |_) | (_) | |  | |_   _| |\__ \  __/ | | |  
\____/| .__/ \___/|_|   \__|  \___/___/\___|_| |_|  
      | |  
      |_|  
```

#Projet-web-groupe4 (Enzo | Mael)

Connexion VM:
 - user1 / mdp: groupe4
 - user2 / mdp: groupe4

Connexion BDD:
 - login: projetweb / mdp: groupe4

Comptes :
 - Mark Couty, email : mc@test.fr, mdp : 123456
 - Robert Pater, email : rp@test.fr, mdp : 123456

Pour se connecter :
 Entrer l'adresse ip 10.10.51.54, vous allez être redirigé (si il y a une problème avec la redirection, vous pouvez cliquer sur le lien proposé) sur la page d'acceuil. Vous pouvez voir en bas de la page un carrousel contenant la note moyenne du site ainsi que des tips et des actualités (coming soon).
 Cliquez sur le bouton se connecter en haut a droite, qui vous ammenera sur la page de connection, si
 
Feature :
  - mot de passe en hash
  - création d'un access token pour obtenir les informations,
  - utilisation de cookie pour stocker l'access token,
  - utilisation de l'API maps,
  - bloquage de l'inscription a un match si le match est complet / joueur deja inscrit / refusé,
  - affichage de la note moyenne sur la page d'acceuil

Pour la table participant, le status correspond a :
 - 0 -> deny
 - 1 -> accept
 - 2 -> waiting
