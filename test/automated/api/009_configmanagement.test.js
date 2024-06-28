var request = require('supertest');
var bcrypt = require('bcrypt');

const sendAdminRequest = require('./lib/admin').sendAdminRequest;
const failAdminRequest = require('./lib/admin').failAdminRequest;
const getAdminResponse = require('./lib/admin').getAdminResponse;
const randomString = require('./lib/rand').randomString;
const randomNumber = require('./lib/rand').randomNumber;

request = request('http://127.0.0.1:8080');

// initial configuration of server
const defaultServerName = 'New Owncast Server';
const defaultStreamTitle = undefined;
const defaultLogo = '/logo';
const defaultOfflineMessage = '';
const defaultServerSummary =
	'This is a new live video streaming server powered by Owncast.';
const defaultAdminPassword = 'abc123';
const defaultStreamKeys = [
	{ key: defaultAdminPassword, comment: 'Default stream key' },
];
const defaultTags = ['owncast', 'streaming'];
const defaultYPConfig = {
	enabled: false,
	instanceUrl: '',
};
const defaultS3Config = {
	enabled: false,
	forcePathStyle: false,
};
const defaultFederationConfig = {
	enabled: false,
	isPrivate: false,
	showEngagement: true,
	goLiveMessage: "I've gone live!",
	username: 'streamer',
	blockedDomains: [],
};
const defaultHideViewerCount = false;
const defaultDisableSearchIndexing = false;

const defaultSocialHandles = [
	{
		icon: '/img/platformlogos/github.svg',
		platform: 'github',
		url: 'https://github.com/owncast/owncast',
	},
];
const defaultSocialHandlesAdmin = [
	{
		platform: 'github',
		url: 'https://github.com/owncast/owncast',
	},
];
const defaultForbiddenUsernames = ['owncast', 'operator', 'admin', 'system'];
const defaultPageContent = `<h1>Welcome to Owncast!</h1>
<ul>
<li>
<p>This is a live stream powered by <a href="https://owncast.online">Owncast</a>, a free and open source live streaming server.</p>
</li>
<li>
<p>To discover more examples of streams, visit <a href="https://directory.owncast.online">Owncast's directory</a>.</p>
</li>
<li>
<p>If you're the owner of this server you should visit the admin and customize the content on this page.</p>
</li>
</ul>
<hr/>
<video id="video" controls preload="metadata" style="width: 60vw; max-width: 600px; min-width: 200px;" poster="https://videos.owncast.online/t/xaJ3xNn9Y6pWTdB25m9ai3">
  <source src="https://assets.owncast.tv/video/owncast-embed.mp4" type="video/mp4" />
</video>`;

// new configuration for testing
const newServerName = randomString();
const newStreamTitle = randomString();
const newServerSummary = randomString();
const newOfflineMessage = randomString();
const newPageContent = `<p>${randomString()}</p>`;
const newTags = [randomString(), randomString(), randomString()];
const newStreamKeys = [
	{ key: randomString(), comment: 'test key 1' },
	{ key: randomString(), comment: 'test key 2' },
	{ key: randomString(), comment: 'test key 3' },
];
const newAdminPassword = randomString();

const latencyLevel = randomNumber(4);
const appearanceValues = {
	variable1: randomString(),
	variable2: randomString(),
	variable3: randomString(),
};

const streamOutputVariants = {
	videoBitrate: randomNumber() * 100,
	framerate: 42,
	cpuUsageLevel: randomNumber(4, 0),
	scaledHeight: randomNumber() * 100,
	scaledWidth: randomNumber() * 100,
};
const newSocialHandles = [
	{
		url: 'http://facebook.org/' + randomString(),
		platform: randomString(),
	},
];

const newS3Config = {
	enabled: !defaultS3Config.enabled,
	endpoint: 'http://' + randomString() + '.tld',
	accessKey: randomString(),
	secret: randomString(),
	bucket: randomString(),
	region: randomString(),
	forcePathStyle: !defaultS3Config.forcePathStyle,
};

const newForbiddenUsernames = [randomString(), randomString(), randomString()];

const newYPConfig = {
	enabled: !defaultYPConfig.enabled,
	instanceUrl: 'http://' + randomString() + '.tld',
};

const newFederationConfig = {
	enabled: !defaultFederationConfig.enabled,
	isPrivate: !defaultFederationConfig.isPrivate,
	username: randomString(),
	goLiveMessage: randomString(),
	showEngagement: !defaultFederationConfig.showEngagement,
	blockedDomains: [randomString() + '.tld', randomString() + '.tld'],
};

const newHideViewerCount = !defaultHideViewerCount;
const newDisableSearchIndexing = !defaultDisableSearchIndexing;

const overriddenWebsocketHost = 'ws://lolcalhost.biz';
const customCSS = randomString();
const customJavascript = randomString();

test('verify default config values', async (done) => {
	const res = await request.get('/api/config');
	expect(res.body.name).toBe(defaultServerName);
	expect(res.body.streamTitle).toBe(defaultStreamTitle);
	expect(res.body.summary).toBe(`${defaultServerSummary}`);
	expect(res.body.extraPageContent).toBe(defaultPageContent);
	expect(res.body.offlineMessage).toBe(defaultOfflineMessage);
	expect(res.body.logo).toBe(defaultLogo);
	expect(res.body.socialHandles).toStrictEqual(defaultSocialHandles);
	done();
});

test('verify default admin configuration', async (done) => {
	const res = await getAdminResponse('serverconfig');

	expect(res.body.instanceDetails.name).toBe(defaultServerName);
	expect(res.body.instanceDetails.summary).toBe(defaultServerSummary);
	expect(res.body.instanceDetails.offlineMessage).toBe(defaultOfflineMessage);
	expect(res.body.instanceDetails.tags).toStrictEqual(defaultTags);
	expect(res.body.instanceDetails.socialHandles).toStrictEqual(
		defaultSocialHandlesAdmin
	);
	expect(res.body.forbiddenUsernames).toStrictEqual(defaultForbiddenUsernames);
	expect(res.body.streamKeys).toStrictEqual(defaultStreamKeys);

	expect(res.body.yp.enabled).toBe(defaultYPConfig.enabled);
	// expect(res.body.yp.instanceUrl).toBe(defaultYPConfig.instanceUrl);

	bcrypt.compare(defaultAdminPassword, res.body.adminPassword, function (err, result) {
		expect(result).toBe(true);
	});

	expect(res.body.s3.enabled).toBe(defaultS3Config.enabled);
	expect(res.body.s3.forcePathStyle).toBe(defaultS3Config.forcePathStyle);
	expect(res.body.hideViewerCount).toBe(defaultHideViewerCount);

	// expect(res.body.federation.enabled).toBe(defaultFederationConfig.enabled);
	expect(res.body.federation.username).toBe(defaultFederationConfig.username);
	expect(res.body.federation.isPrivate).toBe(defaultFederationConfig.isPrivate);
	expect(res.body.federation.showEngagement).toBe(
		defaultFederationConfig.showEngagement
	);
	expect(res.body.federation.goLiveMessage).toBe(
		defaultFederationConfig.goLiveMessage
	);
	expect(res.body.federation.blockedDomains).toStrictEqual(
		defaultFederationConfig.blockedDomains
	);
	done();
});

test('verify stream key validation', async (done) => {
	const badPayload = { id: 'zz', comment: 'ouch' };
	const url = '/api/admin/config/streamkeys';
	const res = await request
		.post(url)
		.auth('admin', defaultAdminPassword)
		.send(badPayload)
		.expect(400);

	done();
});

test('set server name', async (done) => {
	const res = await sendAdminRequest('config/name', newServerName);
	done();
});

test('set stream title', async (done) => {
	const res = await sendAdminRequest('config/streamtitle', newStreamTitle);
	done();
});

test('set server summary', async (done) => {
	const res = await sendAdminRequest('config/serversummary', newServerSummary);
	done();
});

test('set extra page content', async (done) => {
	const res = await sendAdminRequest('config/pagecontent', newPageContent);
	done();
});

test('set tags', async (done) => {
	const res = await sendAdminRequest('config/tags', newTags);
	done();
});

test('set stream keys', async (done) => {
	const res = await sendAdminRequest('config/streamkeys', newStreamKeys);
	done();
});

test('set latency level', async (done) => {
	const res = await sendAdminRequest(
		'config/video/streamlatencylevel',
		latencyLevel
	);
	done();
});

test('set video stream output variants', async (done) => {
	const res = await sendAdminRequest('config/video/streamoutputvariants', [
		streamOutputVariants,
	]);
	done();
});

test('set social handles', async (done) => {
	const res = await sendAdminRequest('config/socialhandles', newSocialHandles);
	done();
});

test('set s3 configuration', async (done) => {
	const res = await sendAdminRequest('config/s3', newS3Config);
	done();
});

test('set forbidden usernames', async (done) => {
	const res = await sendAdminRequest(
		'config/chat/forbiddenusernames',
		newForbiddenUsernames
	);
	done();
});

test('set server url', async (done) => {
	const resBadURL = await failAdminRequest('config/serverurl', 'not.valid.url');
	const res = await sendAdminRequest(
		'config/serverurl',
		newYPConfig.instanceUrl
	);
	done();
});

test('set federation username', async (done) => {
	const res = await sendAdminRequest(
		'config/federation/username',
		newFederationConfig.username
	);
	done();
});

test('set federation goLiveMessage', async (done) => {
	const res = await sendAdminRequest(
		'config/federation/livemessage',
		newFederationConfig.goLiveMessage
	);
	done();
});

test('toggle private federation mode', async (done) => {
	const res = await sendAdminRequest(
		'config/federation/private',
		newFederationConfig.isPrivate
	);
	done();
});

test('toggle federation engagement', async (done) => {
	const res = await sendAdminRequest(
		'config/federation/showengagement',
		newFederationConfig.showEngagement
	);
	done();
});

test('set federation blocked domains', async (done) => {
	const res = await sendAdminRequest(
		'config/federation/blockdomains',
		newFederationConfig.blockedDomains
	);
	done();
});

test('set offline message', async (done) => {
	const res = await sendAdminRequest(
		'config/offlinemessage',
		newOfflineMessage
	);
	done();
});

test('set hide viewer count', async (done) => {
	const res = await sendAdminRequest(
		'config/hideviewercount',
		newHideViewerCount
	);
	done();
});

test('set custom style values', async (done) => {
	const res = await sendAdminRequest('config/appearance', appearanceValues);
	done();
});

test('set custom css', async (done) => {
	await sendAdminRequest('config/customstyles', customCSS);
	done();
});

test('set custom javascript', async (done) => {
	await sendAdminRequest('config/customjavascript', customJavascript);
	done();
});

test('enable directory', async (done) => {
	const res = await sendAdminRequest('config/directoryenabled', true);
	done();
});

test('enable federation', async (done) => {
	const res = await sendAdminRequest(
		'config/federation/enable',
		newFederationConfig.enabled
	);
	done();
});

test('disable search indexing', async (done) => {
	await sendAdminRequest(
		'config/disablesearchindexing',
		newDisableSearchIndexing
	);
	done();
});

test('change admin password', async (done) => {
	const res = await sendAdminRequest('config/adminpass', newAdminPassword);
	done();
});

test('verify admin password change', async (done) => {
	const res = await getAdminResponse(
		'serverconfig',
		(adminPassword = newAdminPassword)
	);

	bcrypt.compare(newAdminPassword, res.body.adminPassword, function(err, result) {
		expect(result).toBe(true);
	});
	done();
});

test('reset admin password', async (done) => {
	const res = await sendAdminRequest(
		'config/adminpass',
		defaultAdminPassword,
		(adminPassword = newAdminPassword)
	);
	done();
});

test('set override websocket host', async (done) => {
	await sendAdminRequest('config/sockethostoverride', overriddenWebsocketHost);
	done();
});

test('verify updated config values', async (done) => {
	const res = await request.get('/api/config');

	expect(res.body.name).toBe(newServerName);
	expect(res.body.streamTitle).toBe(newStreamTitle);
	expect(res.body.summary).toBe(`${newServerSummary}`);
	expect(res.body.extraPageContent).toBe(newPageContent);
	expect(res.body.offlineMessage).toBe(`<p>${newOfflineMessage}</p>`);
	expect(res.body.logo).toBe('/logo');
	expect(res.body.socialHandles).toStrictEqual(newSocialHandles);
	expect(res.body.socketHostOverride).toBe(overriddenWebsocketHost);
	expect(res.body.customStyles).toBe(customCSS);
	done();
});

// Test that the raw video details being broadcasted are coming through
test('verify admin stream details', async (done) => {
	const res = await getAdminResponse('status');

	expect(res.body.broadcaster.streamDetails.width).toBe(1280);
	expect(res.body.broadcaster.streamDetails.height).toBe(720);
	expect(res.body.broadcaster.streamDetails.framerate).toBe(60);
	expect(res.body.broadcaster.streamDetails.videoCodec).toBe('H.264');
	expect(res.body.broadcaster.streamDetails.audioCodec).toBe('AAC');
	expect(res.body.online).toBe(true);
	done();
});

test('verify updated admin configuration', async (done) => {
	const res = await getAdminResponse('serverconfig');

	expect(res.body.instanceDetails.name).toBe(newServerName);
	expect(res.body.instanceDetails.summary).toBe(newServerSummary);
	expect(res.body.instanceDetails.offlineMessage).toBe(newOfflineMessage);
	expect(res.body.instanceDetails.tags).toStrictEqual(newTags);
	expect(res.body.instanceDetails.socialHandles).toStrictEqual(
		newSocialHandles
	);
	expect(res.body.instanceDetails.customStyles).toBe(customCSS);
	expect(res.body.instanceDetails.customJavascript).toBe(customJavascript);

	expect(res.body.forbiddenUsernames).toStrictEqual(newForbiddenUsernames);
	expect(res.body.streamKeys).toStrictEqual(newStreamKeys);
	expect(res.body.socketHostOverride).toBe(overriddenWebsocketHost);

	expect(res.body.videoSettings.latencyLevel).toBe(latencyLevel);
	expect(res.body.videoSettings.videoQualityVariants[0].framerate).toBe(
		streamOutputVariants.framerate
	);
	expect(res.body.videoSettings.videoQualityVariants[0].cpuUsageLevel).toBe(
		streamOutputVariants.cpuUsageLevel
	);

	expect(res.body.yp.enabled).toBe(newYPConfig.enabled);
	// expect(res.body.yp.instanceUrl).toBe(newYPConfig.instanceUrl);

	bcrypt.compare(defaultAdminPassword, res.body.adminPassword, function(err, result) {
		expect(result).toBe(true);
	})

	expect(res.body.s3.enabled).toBe(newS3Config.enabled);
	expect(res.body.s3.endpoint).toBe(newS3Config.endpoint);
	expect(res.body.s3.accessKey).toBe(newS3Config.accessKey);
	expect(res.body.s3.secret).toBe(newS3Config.secret);
	expect(res.body.s3.bucket).toBe(newS3Config.bucket);
	expect(res.body.s3.region).toBe(newS3Config.region);
	expect(res.body.s3.forcePathStyle).toBe(newS3Config.forcePathStyle);
	expect(res.body.hideViewerCount).toBe(newHideViewerCount);

	expect(res.body.federation.enabled).toBe(newFederationConfig.enabled);
	expect(res.body.federation.isPrivate).toBe(newFederationConfig.isPrivate);
	expect(res.body.federation.username).toBe(newFederationConfig.username);
	expect(res.body.federation.goLiveMessage).toBe(
		newFederationConfig.goLiveMessage
	);
	expect(res.body.federation.showEngagement).toBe(
		newFederationConfig.showEngagement
	);
	expect(res.body.federation.blockedDomains).toStrictEqual(
		newFederationConfig.blockedDomains
	);
	done();
});

test('verify updated frontend configuration', (done) => {
	request
		.get('/api/config')
		.expect(200)
		.then((res) => {
			expect(res.body.name).toBe(newServerName);
			expect(res.body.logo).toBe('/logo');
			expect(res.body.socialHandles).toStrictEqual(newSocialHandles);
			done();
		});
});

test('verify frontend status', (done) => {
	request
		.get('/api/status')
		.expect(200)
		.then((res) => {
			expect(res.body.viewerCount).toBe(undefined);
			done();
		});
});

test('verify robots.txt is correct after disabling search indexing', (done) => {
	const expected = `User-agent: *
Disallow: /admin
Disallow: /api
Disallow: /`;

	request
		.get('/robots.txt')
		.expect(200)
		.then((res) => {
			expect(res.text).toBe(expected);
			done();
		});
});
