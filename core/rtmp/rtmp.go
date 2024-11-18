package rtmp

import (
	"fmt"
	"io"
	"net"
	"time"

	"github.com/nareix/joy5/format/flv"
	"github.com/nareix/joy5/format/flv/flvio"
	log "github.com/sirupsen/logrus"

	"github.com/nareix/joy5/format/rtmp"
	"github.com/owncast/owncast/config"
	"github.com/owncast/owncast/models"
	"github.com/owncast/owncast/persistence/configrepository"
)

var _hasInboundRTMPConnection = false

var (
	_pipe           *io.PipeWriter
	_rtmpConnection net.Conn
)

var (
	_setStreamAsConnected func(*io.PipeReader)
	_setBroadcaster       func(models.Broadcaster)
)

// Start starts the rtmp service, listening on specified RTMP port.
func Start(setStreamAsConnected func(*io.PipeReader), setBroadcaster func(models.Broadcaster)) {
	_setStreamAsConnected = setStreamAsConnected
	_setBroadcaster = setBroadcaster

	configRepository := configrepository.Get()

	port := configRepository.GetRTMPPortNumber()
	s := rtmp.NewServer()
	var lis net.Listener
	var err error
	if lis, err = net.Listen("tcp", fmt.Sprintf(":%d", port)); err != nil {
		log.Fatal(err)
	}

	s.LogEvent = func(c *rtmp.Conn, nc net.Conn, e int) {
		es := rtmp.EventString[e]
		log.Traceln("RTMP", nc.LocalAddr(), nc.RemoteAddr(), es)
	}

	s.HandleConn = HandleConn

	if err != nil {
		log.Panicln(err)
	}
	log.Tracef("RTMP server is listening for incoming stream on port: %d", port)

	for {
		nc, err := lis.Accept()
		if err != nil {
			time.Sleep(time.Second)
			continue
		}
		go s.HandleNetConn(nc)
	}
}

// HandleConn is fired when an inbound RTMP connection takes place.
func HandleConn(c *rtmp.Conn, nc net.Conn) {
	c.LogTagEvent = func(isRead bool, t flvio.Tag) {
		if t.Type == flvio.TAG_AMF0 {
			log.Tracef("%+v\n", t.DebugFields())
			setCurrentBroadcasterInfo(t, nc.RemoteAddr().String())
		}
	}

	if _hasInboundRTMPConnection {
		log.Errorln("stream already running; can not overtake an existing stream from", nc.RemoteAddr().String())
		_ = nc.Close()
		return
	}

	configRepository := configrepository.Get()

	accessGranted := false
	validStreamingKeys := configRepository.GetStreamKeys()

	// If a stream key override was specified then use that instead.
	if config.TemporaryStreamKey != "" {
		validStreamingKeys = []models.StreamKey{{Key: config.TemporaryStreamKey}}
	}

	for _, key := range validStreamingKeys {
		if secretMatch(key.Key, c.URL.Path) {
			accessGranted = true
			break
		}
	}

	if !accessGranted {
		log.Errorln("invalid streaming key; rejecting incoming stream from", nc.RemoteAddr().String())
		_ = nc.Close()
		return
	}

	rtmpOut, rtmpIn := io.Pipe()
	_pipe = rtmpIn
	log.Infoln("Inbound stream connected from", nc.RemoteAddr().String())
	_setStreamAsConnected(rtmpOut)

	_hasInboundRTMPConnection = true
	_rtmpConnection = nc

	w := flv.NewMuxer(rtmpIn)

	for {
		if !_hasInboundRTMPConnection {
			break
		}

		// If we don't get a readable packet in 10 seconds give up and disconnect
		if err := _rtmpConnection.SetReadDeadline(time.Now().Add(10 * time.Second)); err != nil {
			log.Debugln(err)
		}

		pkt, err := c.ReadPacket()

		// Broadcaster disconnected
		if err == io.EOF {
			handleDisconnect(nc)
			return
		}

		// Read timeout.  Disconnect.
		if neterr, ok := err.(net.Error); ok && neterr.Timeout() {
			log.Debugln("Timeout reading the inbound stream from the broadcaster.  Assuming that they disconnected and ending the stream.")
			handleDisconnect(nc)
			return
		}

		if err := w.WritePacket(pkt); err != nil {
			log.Errorln("unable to write rtmp packet", err)
			handleDisconnect(nc)
			return
		}
	}
}

func handleDisconnect(conn net.Conn) {
	if !_hasInboundRTMPConnection {
		return
	}

	log.Infoln("Inbound stream disconnected.")
	_ = conn.Close()
	_ = _pipe.Close()
	_hasInboundRTMPConnection = false
}

// Disconnect will force disconnect the current inbound RTMP connection.
func Disconnect() {
	if _rtmpConnection == nil {
		return
	}

	log.Traceln("Inbound stream disconnect requested.")
	handleDisconnect(_rtmpConnection)
}
