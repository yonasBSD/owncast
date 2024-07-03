package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"

	"github.com/owncast/owncast/activitypub"
	"github.com/owncast/owncast/config"
	"github.com/owncast/owncast/core/data"
	"github.com/owncast/owncast/models"
	"github.com/owncast/owncast/utils"
	"github.com/owncast/owncast/webserver/router/middleware"
	webutils "github.com/owncast/owncast/webserver/utils"
	log "github.com/sirupsen/logrus"
)

type webConfigResponse struct {
	AppearanceVariables        map[string]string            `json:"appearanceVariables"`
	Name                       string                       `json:"name"`
	CustomStyles               string                       `json:"customStyles"`
	StreamTitle                string                       `json:"streamTitle,omitempty"` // What's going on with the current stream
	OfflineMessage             string                       `json:"offlineMessage"`
	Logo                       string                       `json:"logo"`
	Version                    string                       `json:"version"`
	SocketHostOverride         string                       `json:"socketHostOverride,omitempty"`
	ExtraPageContent           string                       `json:"extraPageContent"`
	Summary                    string                       `json:"summary"`
	Tags                       []string                     `json:"tags"`
	SocialHandles              []models.SocialHandle        `json:"socialHandles"`
	ExternalActions            []models.ExternalAction      `json:"externalActions"`
	Notifications              notificationsConfigResponse  `json:"notifications"`
	Federation                 federationConfigResponse     `json:"federation"`
	MaxSocketPayloadSize       int                          `json:"maxSocketPayloadSize"`
	HideViewerCount            bool                         `json:"hideViewerCount"`
	ChatDisabled               bool                         `json:"chatDisabled"`
	ChatSpamProtectionDisabled bool                         `json:"chatSpamProtectionDisabled"`
	NSFW                       bool                         `json:"nsfw"`
	Authentication             authenticationConfigResponse `json:"authentication"`
}

type federationConfigResponse struct {
	Account       string `json:"account,omitempty"`
	FollowerCount int    `json:"followerCount,omitempty"`
	Enabled       bool   `json:"enabled"`
}

type browserNotificationsConfigResponse struct {
	PublicKey string `json:"publicKey,omitempty"`
	Enabled   bool   `json:"enabled"`
}

type notificationsConfigResponse struct {
	Browser browserNotificationsConfigResponse `json:"browser"`
}

type authenticationConfigResponse struct {
	IndieAuthEnabled bool `json:"indieAuthEnabled"`
}

// GetWebConfig gets the status of the server.
func GetWebConfig(w http.ResponseWriter, r *http.Request) {
	middleware.EnableCors(w)
	middleware.DisableCache(w)
	w.Header().Set("Content-Type", "application/json")

	configuration := getConfigResponse()

	if err := json.NewEncoder(w).Encode(configuration); err != nil {
		webutils.BadRequestHandler(w, err)
	}
}

func getConfigResponse() webConfigResponse {
	pageContent := utils.RenderPageContentMarkdown(data.GetExtraPageBodyContent())
	offlineMessage := utils.RenderSimpleMarkdown(data.GetCustomOfflineMessage())
	socialHandles := data.GetSocialHandles()
	for i, handle := range socialHandles {
		platform := models.GetSocialHandle(handle.Platform)
		if platform != nil {
			handle.Icon = platform.Icon
			socialHandles[i] = handle
		}
	}

	serverSummary := data.GetServerSummary()

	var federationResponse federationConfigResponse
	federationEnabled := data.GetFederationEnabled()

	followerCount, _ := activitypub.GetFollowerCount()
	if federationEnabled {
		serverURLString := data.GetServerURL()
		serverURL, _ := url.Parse(serverURLString)
		account := fmt.Sprintf("%s@%s", data.GetDefaultFederationUsername(), serverURL.Host)
		federationResponse = federationConfigResponse{
			Enabled:       federationEnabled,
			FollowerCount: int(followerCount),
			Account:       account,
		}
	}

	browserPushEnabled := data.GetBrowserPushConfig().Enabled
	browserPushPublicKey, err := data.GetBrowserPushPublicKey()
	if err != nil {
		log.Errorln("unable to fetch browser push notifications public key", err)
		browserPushEnabled = false
	}

	notificationsResponse := notificationsConfigResponse{
		Browser: browserNotificationsConfigResponse{
			Enabled:   browserPushEnabled,
			PublicKey: browserPushPublicKey,
		},
	}

	authenticationResponse := authenticationConfigResponse{
		IndieAuthEnabled: data.GetServerURL() != "",
	}

	return webConfigResponse{
		Name:                       data.GetServerName(),
		Summary:                    serverSummary,
		OfflineMessage:             offlineMessage,
		Logo:                       "/logo",
		Tags:                       data.GetServerMetadataTags(),
		Version:                    config.GetReleaseString(),
		NSFW:                       data.GetNSFW(),
		SocketHostOverride:         data.GetWebsocketOverrideHost(),
		ExtraPageContent:           pageContent,
		StreamTitle:                data.GetStreamTitle(),
		SocialHandles:              socialHandles,
		ChatDisabled:               data.GetChatDisabled(),
		ChatSpamProtectionDisabled: data.GetChatSpamProtectionEnabled(),
		ExternalActions:            data.GetExternalActions(),
		CustomStyles:               data.GetCustomStyles(),
		MaxSocketPayloadSize:       config.MaxSocketPayloadSize,
		Federation:                 federationResponse,
		Notifications:              notificationsResponse,
		Authentication:             authenticationResponse,
		AppearanceVariables:        data.GetCustomColorVariableValues(),
		HideViewerCount:            data.GetHideViewerCount(),
	}
}

// GetAllSocialPlatforms will return a list of all social platform types.
func GetAllSocialPlatforms(w http.ResponseWriter, r *http.Request) {
	middleware.EnableCors(w)
	w.Header().Set("Content-Type", "application/json")

	platforms := models.GetAllSocialHandles()
	if err := json.NewEncoder(w).Encode(platforms); err != nil {
		webutils.InternalErrorHandler(w, err)
	}
}
