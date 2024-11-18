package yp

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/url"
	"time"

	"github.com/owncast/owncast/config"
	"github.com/owncast/owncast/models"
	"github.com/owncast/owncast/persistence/configrepository"

	log "github.com/sirupsen/logrus"
)

const pingInterval = 4 * time.Minute

var (
	getStatus     func() models.Status
	_inErrorState = false
)

// YP is a service for handling listing in the Owncast directory.
type YP struct {
	timer *time.Ticker
}

type ypPingResponse struct {
	Key       string `json:"key"`
	Error     string `json:"error"`
	ErrorCode int    `json:"errorCode"`
	Success   bool   `json:"success"`
}

type ypPingRequest struct {
	Key string `json:"key"`
	URL string `json:"url"`
}

// NewYP creates a new instance of the YP service handler.
func NewYP(getStatusFunc func() models.Status) *YP {
	getStatus = getStatusFunc
	return &YP{}
}

// Start is run when a live stream begins to start pinging YP.
func (yp *YP) Start() {
	yp.timer = time.NewTicker(pingInterval)
	for range yp.timer.C {
		yp.ping()
	}

	yp.ping()
}

// Stop stops the pinging of YP.
func (yp *YP) Stop() {
	yp.timer.Stop()
}

func (yp *YP) ping() {
	configRepository := configrepository.Get()

	if !configRepository.GetDirectoryEnabled() {
		return
	}

	// Hack: Don't allow ping'ing when offline.
	// It shouldn't even be trying to, but on some instances the ping timer isn't stopping.
	if !getStatus().Online {
		return
	}

	myInstanceURL := configRepository.GetServerURL()
	if myInstanceURL == "" {
		log.Warnln("Server URL not set in the configuration. Directory access is disabled until this is set.")
		return
	}
	isValidInstanceURL := isURL(myInstanceURL)
	if myInstanceURL == "" || !isValidInstanceURL {
		if !_inErrorState {
			log.Warnln("YP Error: unable to use", myInstanceURL, "as a public instance URL. Fix this value in your configuration.")
		}
		_inErrorState = true
		return
	}

	key := configRepository.GetDirectoryRegistrationKey()

	log.Traceln("Pinging YP as: ", configRepository.GetServerName(), "with key", key)

	request := ypPingRequest{
		Key: key,
		URL: myInstanceURL,
	}

	req, err := json.Marshal(request)
	if err != nil {
		log.Errorln(err)
		return
	}

	pingURL := config.GetDefaults().YPServer + "/api/ping"
	resp, err := http.Post(pingURL, "application/json", bytes.NewBuffer(req)) //nolint
	if err != nil {
		log.Errorln(err)
		return
	}

	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Errorln(err)
	}

	pingResponse := ypPingResponse{}
	if err := json.Unmarshal(body, &pingResponse); err != nil {
		log.Errorln(err)
	}

	if !pingResponse.Success {
		if !_inErrorState {
			log.Warnln("YP Ping error returned from service:", pingResponse.Error)
		}
		_inErrorState = true
		return
	}

	_inErrorState = false

	if pingResponse.Key != key {
		if err := configRepository.SetDirectoryRegistrationKey(key); err != nil {
			log.Errorln("unable to save directory key:", err)
		}
	}
}

func isURL(str string) bool {
	u, err := url.Parse(str)
	return err == nil && u.Scheme != "" && u.Host != ""
}
