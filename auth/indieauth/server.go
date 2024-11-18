package indieauth

import (
	"fmt"
	"time"

	"github.com/owncast/owncast/persistence/configrepository"
	"github.com/pkg/errors"
	"github.com/teris-io/shortid"
)

// ServerAuthRequest is n inbound request to authenticate against
// this Owncast instance.
type ServerAuthRequest struct {
	Timestamp     time.Time
	ClientID      string
	RedirectURI   string
	CodeChallenge string
	State         string
	Me            string
	Code          string
}

// ServerProfile represents basic user-provided data about this Owncast instance.
type ServerProfile struct {
	Name  string `json:"name"`
	URL   string `json:"url"`
	Photo string `json:"photo"`
}

// ServerProfileResponse is returned when an auth flow requests the final
// confirmation of the IndieAuth flow.
type ServerProfileResponse struct {
	Me      string        `json:"me,omitempty"`
	Profile ServerProfile `json:"profile,omitempty"`
	// Error keys need to match the OAuth spec.
	Error            string `json:"error,omitempty"`
	ErrorDescription string `json:"error_description,omitempty"`
}

var pendingServerAuthRequests = map[string]ServerAuthRequest{}

const maxPendingRequests = 100

// StartServerAuth will handle the authentication for the admin user of this
// Owncast server. Initiated via a GET of the auth endpoint.
// https://indieweb.org/authorization-endpoint
func StartServerAuth(clientID, redirectURI, codeChallenge, state, me string) (*ServerAuthRequest, error) {
	if len(pendingServerAuthRequests)+1 >= maxPendingRequests {
		return nil, errors.New("Please try again later. Too many pending requests.")
	}

	code := shortid.MustGenerate()

	r := ServerAuthRequest{
		ClientID:      clientID,
		RedirectURI:   redirectURI,
		CodeChallenge: codeChallenge,
		State:         state,
		Me:            me,
		Code:          code,
		Timestamp:     time.Now(),
	}

	pendingServerAuthRequests[code] = r

	return &r, nil
}

// CompleteServerAuth will verify that the values provided in the final step
// of the IndieAuth flow are correct, and return some basic profile info.
func CompleteServerAuth(code, redirectURI, clientID string, codeVerifier string) (*ServerProfileResponse, error) {
	configRepository := configrepository.Get()

	request, pending := pendingServerAuthRequests[code]
	if !pending {
		return nil, errors.New("no pending authentication request")
	}

	if request.RedirectURI != redirectURI {
		return nil, errors.New("redirect URI does not match")
	}

	if request.ClientID != clientID {
		return nil, errors.New("client ID does not match")
	}

	codeChallengeFromRequest := createCodeChallenge(codeVerifier)
	if request.CodeChallenge != codeChallengeFromRequest {
		return nil, errors.New("code verifier is incorrect")
	}

	response := ServerProfileResponse{
		Me: configRepository.GetServerURL(),
		Profile: ServerProfile{
			Name:  configRepository.GetServerName(),
			URL:   configRepository.GetServerURL(),
			Photo: fmt.Sprintf("%s/%s", configRepository.GetServerURL(), configRepository.GetLogoPath()),
		},
	}

	return &response, nil
}
