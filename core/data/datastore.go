package data

import (
	"bytes"
	"database/sql"
	"encoding/gob"
	"sync"

	// sqlite requires a blank import.
	_ "github.com/mattn/go-sqlite3"
	"github.com/owncast/owncast/db"
	"github.com/owncast/owncast/models"
	log "github.com/sirupsen/logrus"
)

// Datastore is the global key/value store for configuration values.
type Datastore struct {
	DB     *sql.DB
	cache  map[string][]byte
	DbLock *sync.Mutex
}

// WarmCache pre-caches all configuration values in memory.
func (ds *Datastore) WarmCache() {
	log.Traceln("Warming config value cache")

	res, err := ds.DB.Query("SELECT key, value FROM datastore")
	if err != nil || res.Err() != nil {
		log.Errorln("error warming config cache", err, res.Err())
	}
	defer res.Close()

	for res.Next() {
		var rowKey string
		var rowValue []byte
		if err := res.Scan(&rowKey, &rowValue); err != nil {
			log.Errorln("error pre-caching config row", err)
		}
		ds.cache[rowKey] = rowValue
	}
}

// GetQueries will return the shared instance of the SQL query generator.
func (ds *Datastore) GetQueries() *db.Queries {
	return db.New(ds.DB)
}

// Get will query the database for the key and return the entry.
func (ds *Datastore) Get(key string) (models.ConfigEntry, error) {
	cachedValue, err := ds.GetCachedValue(key)
	if err == nil {
		return models.ConfigEntry{
			Key:   key,
			Value: cachedValue,
		}, nil
	}

	var resultKey string
	var resultValue []byte

	row := ds.DB.QueryRow("SELECT key, value FROM datastore WHERE key = ? LIMIT 1", key)
	if err := row.Scan(&resultKey, &resultValue); err != nil {
		return models.ConfigEntry{}, err
	}

	result := models.ConfigEntry{
		Key:   resultKey,
		Value: resultValue,
	}
	ds.SetCachedValue(resultKey, resultValue)

	return result, nil
}

// Save will save the ConfigEntry to the database.
func (ds *Datastore) Save(e models.ConfigEntry) error {
	ds.DbLock.Lock()
	defer ds.DbLock.Unlock()

	var dataGob bytes.Buffer
	enc := gob.NewEncoder(&dataGob)
	if err := enc.Encode(e.Value); err != nil {
		return err
	}

	tx, err := ds.DB.Begin()
	if err != nil {
		return err
	}
	var stmt *sql.Stmt
	stmt, err = tx.Prepare("INSERT INTO datastore (key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value")
	if err != nil {
		return err
	}
	_, err = stmt.Exec(e.Key, dataGob.Bytes())
	if err != nil {
		return err
	}
	defer stmt.Close()

	if err = tx.Commit(); err != nil {
		log.Fatalln(err)
	}

	ds.SetCachedValue(e.Key, dataGob.Bytes())

	return nil
}

// Setup will create the datastore table and perform initial initialization.
func (ds *Datastore) Setup() {
	ds.cache = make(map[string][]byte)
	ds.DB = GetDatabase()
	ds.DbLock = &sync.Mutex{}

	createTableSQL := `CREATE TABLE IF NOT EXISTS datastore (
		"key" string NOT NULL PRIMARY KEY,
		"value" BLOB,
		"timestamp" DATE DEFAULT CURRENT_TIMESTAMP NOT NULL
	);`

	ds.MustExec(createTableSQL)
}

// Reset will delete all config entries in the datastore and start over.
func (ds *Datastore) Reset() {
	sql := "DELETE FROM datastore"
	stmt, err := ds.DB.Prepare(sql)
	if err != nil {
		log.Fatalln(err)
	}

	defer stmt.Close()

	if _, err = stmt.Exec(); err != nil {
		log.Fatalln(err)
	}
}

// GetDatastore returns the shared instance of the owncast datastore.
func GetDatastore() *Datastore {
	return _datastore
}

// MustExec will execute a SQL statement on a provided database instance.
func (ds *Datastore) MustExec(s string) {
	stmt, err := ds.DB.Prepare(s)
	if err != nil {
		log.Panic(err)
	}
	defer stmt.Close()
	_, err = stmt.Exec()
	if err != nil {
		log.Warnln(err)
	}
}
