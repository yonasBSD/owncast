package admin

import (
	"encoding/json"
	"net/http"

	"github.com/owncast/owncast/core/data"
	"github.com/owncast/owncast/models"
	webutils "github.com/owncast/owncast/webserver/utils"
)

// SetDiscordNotificationConfiguration will set the discord notification configuration.
func SetDiscordNotificationConfiguration(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	type request struct {
		Value models.DiscordConfiguration `json:"value"`
	}

	decoder := json.NewDecoder(r.Body)
	var config request
	if err := decoder.Decode(&config); err != nil {
		webutils.WriteSimpleResponse(w, false, "unable to update discord config with provided values")
		return
	}

	if err := data.SetDiscordConfig(config.Value); err != nil {
		webutils.WriteSimpleResponse(w, false, "unable to update discord config with provided values")
		return
	}

	webutils.WriteSimpleResponse(w, true, "updated discord config with provided values")
}

// SetBrowserNotificationConfiguration will set the browser notification configuration.
func SetBrowserNotificationConfiguration(w http.ResponseWriter, r *http.Request) {
	if !requirePOST(w, r) {
		return
	}

	type request struct {
		Value models.BrowserNotificationConfiguration `json:"value"`
	}

	decoder := json.NewDecoder(r.Body)
	var config request
	if err := decoder.Decode(&config); err != nil {
		webutils.WriteSimpleResponse(w, false, "unable to update browser push config with provided values")
		return
	}

	if err := data.SetBrowserPushConfig(config.Value); err != nil {
		webutils.WriteSimpleResponse(w, false, "unable to update browser push config with provided values")
		return
	}

	webutils.WriteSimpleResponse(w, true, "updated browser push config with provided values")
}
