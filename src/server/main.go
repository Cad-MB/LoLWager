package main

import (
    "context"
    "fmt"
    "log"
    "net/http"
    "encoding/json"
    "strconv"




    "time"
    "github.com/gorilla/mux"
    
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
    "go.mongodb.org/mongo-driver/bson"
    "golang.org/x/crypto/bcrypt"
)

type User struct {
    Username    string    `json:"username" bson:"username"`
    Password    string    `json:"password" bson:"password"`
    Description string    `json:"description" bson:"description"`
    IsAdmin     bool      `json:"isAdmin" bson:"isAdmin"`
    LCoins      int    `json:"LCoins" bson:"LCoins"`
    Img         string    `json:"img" bson:"img"`
    CreatedAt   time.Time `json:"createdAt" bson:"createdAt"`
}

type ProPlayer struct {
    Username string `bson:"username" required:"true" unique:"true" json:"name"`
    Puuid     string `bson:"puuid" json:"puuid"`
}

type Message struct {
    Username  string    `json:"username"`
    Contenu   string    `json:"contenu"`
    ProfilName string    `json:"profilName`
    CreatedAt time.Time `json:"createdAt`
}

type WinOrLoose struct {
	Username   string    `json:"username"`
	Contenu    string    `json:"contenu"`
	LCoins     string    `json:"lCoins"`
	WinOrLoose bool      `json:"winOrLoose"`
	Img        string    `json:"img,omitempty"`
	CreatedAt  time.Time `json:"createdAt"`
}

type Lobby struct {
    Players     []User  `json:"players"`
    Title       string  `json:"title"`
    MaxPlayers  int     `json:"maxPlayers"`
    Current     int     `json:"current"`
	CreatedAt  time.Time `json:"createdAt"`
}
func initBdd(client *mongo.Client){
    proPlayerTab := []string{"KCSAKEN12","Season3Chall","GrizzłyHills","HisZephyr","G2Joker"}
    addPlayersToDB(client, proPlayerTab, "<tokken Riot>")
    
}
func main() {
    
    
    mux := mux.NewRouter()
    mux.HandleFunc("/", handler)
    

    // Configuration des CORS
	headersOk := "Accept, Content-Type, Content-Length, Accept-Encoding, Authorization"
	originsOk := "*"
	methodsOk := "GET, POST, OPTIONS"
    corsMiddleware := func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Set headers
			w.Header().Set("Access-Control-Allow-Headers", headersOk)
			w.Header().Set("Access-Control-Allow-Origin", originsOk)
			w.Header().Set("Access-Control-Allow-Methods", methodsOk)

			// Handle preflight requests
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}

			// Call the next handler
			next.ServeHTTP(w, r)
		})
	}
    handler := corsMiddleware(mux)

    fmt.Println("Connecting to MongoDB...")
    clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
    client, err := mongo.Connect(context.Background(), clientOptions)
    if err != nil {
        log.Fatal(err)
    }

    // Ping the MongoDB server to verify that the connection is established
    err = client.Ping(context.Background(), nil)
    if err != nil {
        log.Fatal(err)
    }

    fmt.Println("Connected to MongoDB!")
    initBdd(client)


    mux.HandleFunc("/SignUp", SignUpHandler(client))
    mux.HandleFunc("/Login", LoginHandler(client))

    


    mux.HandleFunc("/WinOrLoose", winOrLooseHandler(client))
    mux.HandleFunc("/WinOrLoose/{id}", getWinOrLooseByUserHandler(client))
    


    mux.HandleFunc("/Message", messageHandler(client))
    mux.HandleFunc("/Message/{id}", getMessageByLobbyNameHandler(client))

    
    mux.HandleFunc("/ProPlayer", getProPlayerHandler(client))

    
    mux.HandleFunc("/User/{id}", getUserByName(client))
    mux.HandleFunc("/User/{id}/{lcoins}", setUserLcoinsByName(client))
    mux.HandleFunc("/UserRank", getTop25UserHandler(client))
    

    fmt.Println("Listening on port 5000...")
    http.ListenAndServe(":5000", handler)
    
}


func handler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello, World!")
}



func SignUpHandler(client *mongo.Client) http.HandlerFunc {
    
    return func(w http.ResponseWriter, r *http.Request) {
        if r.Method != "POST" {
            http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
            return
        }
        loc, errT := time.LoadLocation("Europe/Paris")
        if errT != nil {
            panic(errT)
        }
        // Récupérer les données de l'utilisateur
        var user User
        err := json.NewDecoder(r.Body).Decode(&user)
        if err != nil {
            http.Error(w, err.Error(), http.StatusBadRequest)
            return
        }
        // Vérifier si l'utilisateur existe déjà dans la base de données
        collection := client.Database("LolGambling").Collection("User")
        result := collection.FindOne(r.Context(), bson.M{"Username": user.Username})
        if result.Err() == nil {
            http.Error(w, "User already exists", http.StatusConflict)
            return
        }

        // Crypter le mot de passe
        passwordBytes := []byte(user.Password)
        salt, err := bcrypt.GenerateFromPassword(passwordBytes, 10)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        hash := string(salt)
        now := time.Now().In(loc)
        // Enregistrer l'utilisateur dans la base de données
        
        _, err = collection.InsertOne(r.Context(), bson.M{
            "Username": user.Username,
            "Password": hash,
            "Description": "Je suis nouveau ici !",
            "IsAdmin": false,
            "LCoins": 100,
            "Img": "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
            "CreatedAt": now,
        })
        
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        // Retourner une réponse réussie
        w.WriteHeader(http.StatusOK)
        fmt.Fprint(w, "True")
    }
}
func LoginHandler(client *mongo.Client) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "application/json")
        
        var user User
        err := json.NewDecoder(r.Body).Decode(&user)
        if err != nil {
            http.Error(w, err.Error(), http.StatusBadRequest)
            return
        }

        // Vérifier si l'utilisateur existe déjà dans la base de données
        collection := client.Database("LolGambling").Collection("User")
        result := collection.FindOne(r.Context(), bson.M{"Username": user.Username})
        if result.Err() != nil {
            http.Error(w, `{"message": "user incorrect"}`, http.StatusConflict)
            return
        }
        var foundUser User
        err = result.Decode(&foundUser)
        if err != nil {
            http.Error(w, `{"message": "user incorrect"}`, http.StatusConflict)
            return
        }

        err = bcrypt.CompareHashAndPassword([]byte(foundUser.Password), []byte(user.Password))
        if err != nil {
            fmt.Println("Mot de passe incorrect")
            w.Write([]byte(`{"message": "Mot de passe incorrect"}`))
            return
        }

        w.WriteHeader(http.StatusOK)
        fmt.Fprint(w, "True")
    }
}

func winOrLooseHandler(client *mongo.Client) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        var handler http.HandlerFunc
        
        switch r.Method {
        case http.MethodPost:
            handler = AddWinOrLooseHandler(client)
           
            
        case http.MethodGet:
            handler = getWinsOrLoosesHandler(client)
            
            
        case http.MethodDelete:
            handler = deleteWinsOrLoosesHandler(client)
            
            
        default:
            http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
            return
        }
        handler(w, r)
    }
}


func AddWinOrLooseHandler(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
        
		var winOrLoose WinOrLoose
		err := json.NewDecoder(r.Body).Decode(&winOrLoose)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
        
        loc, errT := time.LoadLocation("Europe/Paris")
        if errT != nil {
            panic(errT)
        }
		winOrLoose.Contenu = ""
        now := time.Now().In(loc)
        
		collection := client.Database("LolGambling").Collection("WinOrLoose")
        _, errr := collection.InsertOne(context.Background(), bson.M{
            "username": winOrLoose.Username,
            "contenu": winOrLoose.Contenu,
            "lcoins": winOrLoose.LCoins,
            "winorloose": winOrLoose.WinOrLoose,
            "img": winOrLoose.Img,
            "CreatedAt": now,
        })

        
        if errr != nil {
            return 
        }

		w.WriteHeader(http.StatusOK)
	}
}


func deleteWinsOrLoosesHandler(client *mongo.Client) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        
        collection := client.Database("LolGambling").Collection("WinOrLoose")
        _, err := collection.DeleteMany(context.Background(), bson.M{})
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        w.WriteHeader(http.StatusOK)
        return
        
        
    }
}

func getWinOrLooseByUserHandler(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		vars := mux.Vars(r)
		username := vars["id"]

		collection := client.Database("LolGambling").Collection("WinOrLoose")

		options := options.Find().SetSort(bson.M{"createdAt": -1})

		cursor, err := collection.Find(context.Background(), bson.M{"username": username}, options)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer cursor.Close(context.Background())

		var winOrLooseList []WinOrLoose
		for cursor.Next(context.Background()) {
			var winOrLoose WinOrLoose
			if err := cursor.Decode(&winOrLoose); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			winOrLooseList = append(winOrLooseList, winOrLoose)
		}

		// Convertir la liste en JSON et envoyer la réponse
		json.NewEncoder(w).Encode(winOrLooseList)
	}
}

func getWinsOrLoosesHandler(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		// Récupère tous les éléments de la collection "WinOrLoose"
		collection := client.Database("LolGambling").Collection("WinOrLoose")
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		cursor, err := collection.Find(ctx, bson.M{})
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer cursor.Close(ctx)

		var wins []WinOrLoose
		for cursor.Next(ctx) {
			var win WinOrLoose
			err := cursor.Decode(&win)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			wins = append(wins, win)
		}

		if err := cursor.Err(); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Envoie les éléments en réponse
		jsonBytes, err := json.Marshal(wins)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write(jsonBytes)
	}
}


/* ----------------------------------------------------------- MESSAGE -------------------------------------------- */ 

func messageHandler(client *mongo.Client) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        var handler http.HandlerFunc
        switch r.Method {
        case http.MethodPost:
            handler = addMessageHandler(client)
        case http.MethodGet:
            handler = getAllMessagesHandler(client)
        case http.MethodDelete:
            handler = deleteMessagesHandler(client)
        default:
            http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
            return
        }
        handler(w, r)
    }
}



func addMessageHandler(client *mongo.Client) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        var message Message
        err := json.NewDecoder(r.Body).Decode(&message)
        if err != nil {
            http.Error(w, err.Error(), http.StatusBadRequest)
            return
        }
        collection := client.Database("LolGambling").Collection("Message")
        loc, errT := time.LoadLocation("Europe/Paris")
        if errT != nil {
            panic(errT)
        }
		
        now := time.Now().In(loc)
        message.CreatedAt = now
        _, errr := collection.InsertOne(context.Background(), message)
        if errr != nil {
            return 
        }
        w.WriteHeader(http.StatusCreated)
    }
}

func deleteMessagesHandler(client *mongo.Client) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        
        collection := client.Database("LolGambling").Collection("Messages")
        _, err := collection.DeleteMany(context.Background(), bson.M{})
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        w.WriteHeader(http.StatusOK)
        return
        
    }
}

func getMessageByLobbyNameHandler(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
        
		collection := client.Database("LolGambling").Collection("Message")

        vars := mux.Vars(r)
        profilName := vars["id"]
		opts := options.Find().SetSort(bson.M{"createdAt": -1})

		cursor, err := collection.Find(context.Background(),  bson.M{"profilname": profilName}, opts)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer cursor.Close(context.Background())

		messages := []Message{}
		for cursor.Next(context.Background()) {
			var message Message
			err := cursor.Decode(&message)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			messages = append(messages, message)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(messages)
	}
}

func getAllMessagesHandler(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		collection := client.Database("LolGambling").Collection("Message")

		opts := options.Find().SetSort(bson.M{"createdat": -1})

		cursor, err := collection.Find(context.Background(), bson.M{}, opts)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer cursor.Close(context.Background())

		messages := []Message{}
		for cursor.Next(context.Background()) {
			var message Message
			err := cursor.Decode(&message)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			messages = append(messages, message)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(messages)
	}
}



func fetchSummonerInfo(name string, apiKey string) (*ProPlayer, error) {
    url := fmt.Sprintf("https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/%s?api_key=%s", name, apiKey)

    client := &http.Client{}
    req, err := http.NewRequest("GET", url, nil)
    if err != nil {
        return nil, err
    }

    resp, err := client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()
    
    var proPlayer ProPlayer
    if err := json.NewDecoder(resp.Body).Decode(&proPlayer); err != nil {
        return nil, err
    }

    return &proPlayer, nil
}




func addPlayersToDB(client *mongo.Client, usernames []string, apiKey string) error {
    for _, name := range usernames {
        // Vérifier si le joueur existe déjà dans la base de données
        result := client.Database("LolGambling").Collection("ProPlayer").FindOne(context.Background(), bson.M{"username": name})
        if result.Err() == nil {
            return nil
        }


        // Récupérer les informations du joueur depuis l'API Riot
        data, err := fetchSummonerInfo(name, apiKey)
        if err != nil {
            return nil
        }
        
        _, err = client.Database("LolGambling").Collection("ProPlayer").InsertOne(context.Background(), data)
        if err != nil {
            return nil
        }
        fmt.Printf("Le joueur %s a été ajouté à la base de données.\n", name)

    }
    return nil
}

func getProPlayerHandler(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		// Récupère tous les éléments de la collection "ProPlayer"
		collection := client.Database("LolGambling").Collection("ProPlayer")
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		cursor, err := collection.Find(ctx, bson.M{})
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer cursor.Close(ctx)

		var players []ProPlayer
		for cursor.Next(ctx) {
			var player ProPlayer
			err := cursor.Decode(&player)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			players = append(players, player)
		}

		if err := cursor.Err(); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Envoie les joueurs en réponse
		jsonBytes, err := json.Marshal(players)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write(jsonBytes)
	}
}


func getUserByName(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {


        vars := mux.Vars(r)
        username := vars["id"]
		collection := client.Database("LolGambling").Collection("User")
		

		cur, err := collection.Find(context.Background(), bson.M{"Username": username})
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer cur.Close(context.Background())

		// Convertir les données du curseur en une tranche de User
		var users []User
		err = cur.All(context.Background(), &users)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Encoder les données de la tranche en tant que réponse JSON
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(users[0])
	}
}

func setUserLcoinsByName(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {


        vars := mux.Vars(r)
        username := vars["id"]
        lCoins := vars["lcoins"]
		collection := client.Database("LolGambling").Collection("User")
		

		cur, err := collection.Find(context.Background(), bson.M{"Username": username})
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer cur.Close(context.Background())

        
		// Convertir les données du curseur en une tranche de User
		var users []User
		err = cur.All(context.Background(), &users)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

        value, err := strconv.Atoi(lCoins)
        if err != nil {
            fmt.Println("Erreur lors de la conversion :", err)
            return
        }
        
        newvalue := value + users[0].LCoins
        update := bson.M{}
        if(newvalue < 0){
            update = bson.M{
                "$set": bson.M{
                    "LCoins": 0,
                },
            }
        }else {
            update = bson.M{
                "$set": bson.M{
                    "LCoins": newvalue,
                },
            }
        }
        
        
        _, errr := collection.UpdateOne(context.Background(), bson.M{"Username": username}, update)
        if errr != nil {
            http.Error(w, errr.Error(), http.StatusInternalServerError)
            return 
        }

		// Encoder les données de la tranche en tant que réponse JSON
		w.Header().Set("Content-Type", "application/json")
        
		json.NewEncoder(w).Encode(newvalue)
	}
}



func getTop25UserHandler(client *mongo.Client) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "application/json")
        // Récupère les 25 premiers utilisateurs ayant le plus de LCoins
        collection := client.Database("LolGambling").Collection("User")
        ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
        defer cancel()
        options := options.Find().SetSort(bson.M{"LCoins": -1}).SetLimit(25)
        cursor, err := collection.Find(ctx, bson.M{}, options)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        defer cursor.Close(ctx)
        
        var users []User
        
        for cursor.Next(ctx) {
            var user User
            err := cursor.Decode(&user)
            if err != nil {
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }
            users = append(users, user)
        }

        
        if err := cursor.Err(); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        
        jsonBytes, err := json.Marshal(users)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        
        w.WriteHeader(http.StatusOK)
        w.Write(jsonBytes)
    }
}

