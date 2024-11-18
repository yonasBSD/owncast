package activitypub

import (
	"github.com/owncast/owncast/activitypub/crypto"
	"github.com/owncast/owncast/activitypub/inbox"
	"github.com/owncast/owncast/activitypub/outbox"
	"github.com/owncast/owncast/activitypub/persistence"
	"github.com/owncast/owncast/activitypub/workerpool"
	"github.com/owncast/owncast/persistence/configrepository"

	"github.com/owncast/owncast/core/data"
	"github.com/owncast/owncast/models"
	log "github.com/sirupsen/logrus"
)

// Start will initialize and start the federation support.
func Start(datastore *data.Datastore) {
	configRepository := configrepository.Get()
	persistence.Setup(datastore)
	workerpool.InitOutboundWorkerPool()
	inbox.InitInboxWorkerPool()

	// Generate the keys for signing federated activity if needed.
	if configRepository.GetPrivateKey() == "" {
		privateKey, publicKey, err := crypto.GenerateKeys()
		_ = configRepository.SetPrivateKey(string(privateKey))
		_ = configRepository.SetPublicKey(string(publicKey))
		if err != nil {
			log.Errorln("Unable to get private key", err)
		}
	}
}

// SendLive will send a "Go Live" message to followers.
func SendLive() error {
	return outbox.SendLive()
}

// SendPublicFederatedMessage will send an arbitrary provided message to followers.
func SendPublicFederatedMessage(message string) error {
	return outbox.SendPublicMessage(message)
}

// SendDirectFederatedMessage will send a direct message to a single account.
func SendDirectFederatedMessage(message, account string) error {
	return outbox.SendDirectMessageToAccount(message, account)
}

// GetFollowerCount will return the local tracked follower count.
func GetFollowerCount() (int64, error) {
	return persistence.GetFollowerCount()
}

// GetPendingFollowRequests will return the pending follow requests.
func GetPendingFollowRequests() ([]models.Follower, error) {
	return persistence.GetPendingFollowRequests()
}
