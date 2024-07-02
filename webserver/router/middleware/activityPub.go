package middleware

import (
	"net/http"
	"strings"

	"github.com/owncast/owncast/core/data"
	"github.com/owncast/owncast/utils"
)

// RequireActivityPubOrRedirect will validate the requested content types and
// redirect to the main Owncast page if it doesn't match.
func RequireActivityPubOrRedirect(handler http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !data.GetFederationEnabled() {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}

		handleAccepted := func() {
			handler(w, r)
		}

		acceptedContentTypes := []string{"application/json", "application/json+ld", "application/activity+json", `application/ld+json; profile="https://www.w3.org/ns/activitystreams"`}
		var accept []string
		for _, a := range r.Header.Values("Accept") {
			accept = append(accept, strings.Split(a, ",")...)
		}

		for _, singleType := range accept {
			if _, accepted := utils.FindInSlice(acceptedContentTypes, strings.TrimSpace(singleType)); accepted {
				handleAccepted()
				return
			}
		}

		contentTypeString := r.Header.Get("Content-Type")
		contentTypes := strings.Split(contentTypeString, ",")
		for _, singleType := range contentTypes {
			if _, accepted := utils.FindInSlice(acceptedContentTypes, strings.TrimSpace(singleType)); accepted {
				handleAccepted()
				return
			}
		}

		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
	})
}
