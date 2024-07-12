// DEFAULT VALUES
import { fetchData, SERVER_CONFIG_UPDATE_URL } from './apis';
import { ApiPostArgs, VideoVariant, SocialHandle } from '../types/config-section';
import { DEFAULT_TEXTFIELD_URL_PATTERN } from './validators';

const TEXT_MAXLENGTH = 255;

export const RESET_TIMEOUT = 3000;

// CONFIG API ENDPOINTS
export const API_CUSTOM_CONTENT = '/pagecontent';
export const API_CUSTOM_CSS_STYLES = '/customstyles';
export const API_CUSTOM_JAVASCRIPT = '/customjavascript';
export const API_S3_INFO = '/s3';
export const API_SERVER_OFFLINE_MESSAGE = '/offlinemessage';
export const API_SOCIAL_HANDLES = '/socialhandles';
export const API_VIDEO_SEGMENTS = '/video/streamlatencylevel';
export const API_VIDEO_VARIANTS = '/video/streamoutputvariants';
export const API_YP_SWITCH = '/directoryenabled';
export const API_CHAT_FORBIDDEN_USERNAMES = '/chat/forbiddenusernames';
export const API_CHAT_SUGGESTED_USERNAMES = '/chat/suggestedusernames';
export const API_EXTERNAL_ACTIONS = '/externalactions';
export const API_VIDEO_CODEC = '/video/codec';

const API_FFMPEG = '/ffmpegpath';
const API_INSTANCE_URL = '/serverurl';
const API_LOGO = '/logo';
const API_NSFW_SWITCH = '/nsfw';
const API_RTMP_PORT = '/rtmpserverport';
const API_SERVER_SUMMARY = '/serversummary';
const API_SERVER_WELCOME_MESSAGE = '/welcomemessage';
const API_SERVER_NAME = '/name';
const API_STREAM_KEY = '/adminpass';
const API_STREAM_TITLE = '/streamtitle';
const API_TAGS = '/tags';
const API_WEB_PORT = '/webserverport';
const API_HIDE_VIEWER_COUNT = '/hideviewercount';
const API_CHAT_DISABLE = '/chat/disable';
const API_CHAT_JOIN_MESSAGES_ENABLED = '/chat/joinmessagesenabled';
const API_CHAT_ESTABLISHED_MODE = '/chat/establishedusermode';
const API_CHAT_SPAM_PROTECTION_ENABLED = '/chat/spamprotectionenabled';
const API_CHAT_SLUR_FILTER_ENABLED = '/chat/slurfilterenabled';
const API_DISABLE_SEARCH_INDEXING = '/disablesearchindexing';
const API_SOCKET_HOST_OVERRIDE = '/sockethostoverride';
const API_VIDEO_SERVING_ENDPOINT = '/videoservingendpoint';

// Federation
const API_FEDERATION_ENABLED = '/federation/enable';
const API_FEDERATION_PRIVATE = '/federation/private';
const API_FEDERATION_USERNAME = '/federation/username';
const API_FEDERATION_GOLIVE_MESSAGE = '/federation/livemessage';
const API_FEDERATION_SHOW_ENGAGEMENT = '/federation/showengagement';
export const API_FEDERATION_BLOCKED_DOMAINS = '/federation/blockdomains';

const TEXTFIELD_TYPE_URL = 'url';

export async function postConfigUpdateToAPI(args: ApiPostArgs) {
  const { apiPath, data, onSuccess, onError } = args;
  try {
    const result = await fetchData(`${SERVER_CONFIG_UPDATE_URL}${apiPath}`, {
      data,
      method: 'POST',
      auth: true,
    });
    if (result.success && onSuccess) {
      onSuccess(result.message);
    } else if (onError) {
      onError(result.message);
    }
  } catch (e) {
    if (onError) {
      onError(e.message);
    }
  }
}

// Some default props to help build out a TextField
export const TEXTFIELD_PROPS_SERVER_NAME = {
  apiPath: API_SERVER_NAME,
  configPath: 'instanceDetails',
  maxLength: TEXT_MAXLENGTH,
  placeholder: 'Owncast site name', // like "gothland"
  label: 'Name',
  tip: 'The name of your Owncast server',
  required: true,
  useTrimLead: true,
};
export const TEXTFIELD_PROPS_STREAM_TITLE = {
  apiPath: API_STREAM_TITLE,
  configPath: 'instanceDetails',
  maxLength: 100,
  placeholder: 'Doing cool things...',
  label: 'Stream Title',
  tip: 'What is your stream about today?',
};
export const TEXTFIELD_PROPS_SERVER_SUMMARY = {
  apiPath: API_SERVER_SUMMARY,
  configPath: 'instanceDetails',
  maxLength: 500,
  placeholder: '',
  label: 'About',
  tip: 'A brief blurb about you, your server, or what your stream is about.',
};
export const TEXTFIELD_PROPS_SERVER_OFFLINE_MESSAGE = {
  apiPath: API_SERVER_OFFLINE_MESSAGE,
  configPath: 'instanceDetails',
  maxLength: 2500,
  placeholder: 'An optional message you can leave people when your stream is not live.',
  label: 'Offline Message',
  tip: 'An optional message you can leave people when your stream is not live.',
};
export const TEXTFIELD_PROPS_SERVER_WELCOME_MESSAGE = {
  apiPath: API_SERVER_WELCOME_MESSAGE,
  configPath: 'instanceDetails',
  maxLength: 2500,
  placeholder: '',
  label: 'Welcome Message',
  tip: 'A system chat message sent to viewers when they first connect to chat. Leave blank to disable.',
};
export const TEXTFIELD_PROPS_LOGO = {
  apiPath: API_LOGO,
  configPath: 'instanceDetails',
  maxLength: 255,
  placeholder: '/img/mylogo.png',
  label: 'Logo',
  tip: 'Upload your logo if you have one (max size 2 MB). We recommend that you use a square image that is at least 256x256. SVGs are discouraged as they cannot be displayed on all social media platforms.',
};
export const TEXTFIELD_PROPS_ADMIN_PASSWORD = {
  apiPath: API_STREAM_KEY,
  configPath: '',
  maxLength: TEXT_MAXLENGTH,
  placeholder: 'abc123',
  label: 'Admin Password',
  tip: 'Save this password somewhere safe, you will need it to login to the admin dashboard!',
  required: true,
  hasComplexityRequirements: true,
};
export const TEXTFIELD_PROPS_FFMPEG = {
  apiPath: API_FFMPEG,
  configPath: '',
  maxLength: TEXT_MAXLENGTH,
  placeholder: '/usr/local/bin/ffmpeg',
  label: 'FFmpeg Path',
  tip: 'Absolute file path of the FFMPEG application on your server',
  required: true,
  hasComplexityRequirements: false,
};
export const TEXTFIELD_PROPS_WEB_PORT = {
  apiPath: API_WEB_PORT,
  configPath: '',
  maxLength: 6,
  placeholder: '8080',
  label: 'Owncast port',
  tip: 'What port is your Owncast web server listening? Default is 8080',
  required: true,
  hasComplexityRequirements: false,
};
export const TEXTFIELD_PROPS_RTMP_PORT = {
  apiPath: API_RTMP_PORT,
  configPath: '',
  maxLength: 6,
  placeholder: '1935',
  label: 'RTMP port',
  tip: 'What port should accept inbound broadcasts? Default is 1935',
  required: true,
  hasComplexityRequirements: false,
};
export const TEXTFIELD_PROPS_INSTANCE_URL = {
  apiPath: API_INSTANCE_URL,
  configPath: 'yp',
  maxLength: 255,
  placeholder: 'https://owncast.mysite.com',
  label: 'Server URL',
  tip: 'The full url to your Owncast server.',
  type: TEXTFIELD_TYPE_URL,
  pattern: DEFAULT_TEXTFIELD_URL_PATTERN,
  useTrim: true,
};

export const TEXTFIELD_PROPS_SOCKET_HOST_OVERRIDE = {
  apiPath: API_SOCKET_HOST_OVERRIDE,
  configPath: '',
  maxLength: 255,
  placeholder: 'https://owncast.mysite.com',
  label: 'Websocket host override',
  tip: 'The direct URL of your Owncast server.',
  type: TEXTFIELD_TYPE_URL,
  pattern: DEFAULT_TEXTFIELD_URL_PATTERN,
  useTrim: true,
};

export const TEXTFIELD_PROPS_VIDEO_SERVING_ENDPOINT = {
  apiPath: API_VIDEO_SERVING_ENDPOINT,
  fieldName: 'videoServingEndpoint',
  label: 'Serving Endpoint',
  maxLength: 255,
  placeholder: 'http://cdn.provider.endpoint.com',
  tip: 'Optional URL that video content should be accessed from instead of the default.  Used with CDNs and specific storage providers. Generally not required.',
  type: TEXTFIELD_TYPE_URL,
  pattern: DEFAULT_TEXTFIELD_URL_PATTERN,
  useTrim: true,
};

// MISC FIELDS
export const FIELD_PROPS_TAGS = {
  apiPath: API_TAGS,
  configPath: 'instanceDetails',
  maxLength: 24,
  placeholder: 'Add a new tag',
  required: true,
  label: '',
  tip: '',
};

export const FIELD_PROPS_NSFW = {
  apiPath: API_NSFW_SWITCH,
  configPath: 'instanceDetails',
  label: 'NSFW?',
  tip: "Turn this ON if you plan to stream explicit or adult content. Please respectfully set this flag so unexpected eyes won't accidentally see it in the Directory.",
};

export const FIELD_PROPS_YP = {
  apiPath: API_YP_SWITCH,
  configPath: 'yp',
  label: 'Enable directory',
  tip: 'Turn this ON to request to show up in the directory.',
};

export const FIELD_PROPS_HIDE_VIEWER_COUNT = {
  apiPath: API_HIDE_VIEWER_COUNT,
  configPath: '',
  label: 'Hide viewer count',
  tip: 'Turn this ON to hide the viewer count on the web page.',
};

export const FIELD_PROPS_DISABLE_SEARCH_INDEXING = {
  apiPath: API_DISABLE_SEARCH_INDEXING,
  configPath: '',
  label: 'Disable search engine indexing',
  tip: 'Turn this ON to ask search engines to not index this site.',
};

export const DEFAULT_VARIANT_STATE: VideoVariant = {
  framerate: 24,
  videoPassthrough: false,
  videoBitrate: 1200,
  audioPassthrough: true, // if false, then CAN set audiobitrate
  audioBitrate: 0,
  cpuUsageLevel: 2,
  scaledHeight: null,
  scaledWidth: null,
  name: '',
};

export const FIELD_PROPS_DISABLE_CHAT = {
  apiPath: API_CHAT_DISABLE,
  configPath: '',
  label: 'Chat',
  tip: 'Turn the chat functionality on/off on your Owncast server.',
  useSubmit: true,
};

export const FIELD_PROPS_ENABLE_SPAM_PROTECTION = {
  apiPath: API_CHAT_SPAM_PROTECTION_ENABLED,
  configPath: '',
  label: 'Spam Protection',
  tip: 'Limits how quickly messages can be sent to prevent spamming.',
  useSubmit: true,
};

export const FIELD_PROPS_CHAT_JOIN_MESSAGES_ENABLED = {
  apiPath: API_CHAT_JOIN_MESSAGES_ENABLED,
  configPath: '',
  label: 'Join Messages',
  tip: 'Show when a viewer joins the chat.',
  useSubmit: true,
};

export const FIELD_PROPS_ENABLE_CHAT_SLUR_FILTER = {
  apiPath: API_CHAT_SLUR_FILTER_ENABLED,
  configPath: '',
  label: 'Chat language filter',
  tip: 'Filters out messages that contain offensive language.',
  useSubmit: true,
};

export const CHAT_ESTABLISHED_USER_MODE = {
  apiPath: API_CHAT_ESTABLISHED_MODE,
  configPath: '',
  label: 'Established users only',
  tip: 'Only users who have previously been established for some time may chat.',
  useSubmit: true,
};

export const TEXTFIELD_PROPS_CHAT_FORBIDDEN_USERNAMES = {
  apiPath: API_CHAT_FORBIDDEN_USERNAMES,
  placeholder: 'username',
  label: 'Forbidden usernames',
  tip: 'A list of words in chat usernames you disallow.',
};

export const TEXTFIELD_PROPS_CHAT_SUGGESTED_USERNAMES = {
  apiPath: API_CHAT_SUGGESTED_USERNAMES,
  placeholder: 'username',
  label: 'Default usernames',
  tip: 'An optional list of chat usernames that new users get assigned. If the list holds less then 10 items, random names will be generated.  Users can change their usernames afterwards and the same username may be given out multple times.',
  min_not_reached: 'At least 10 items are required for this feature.',
  no_entries: 'The default name generator is used.',
};

export const FIELD_PROPS_ENABLE_FEDERATION = {
  apiPath: API_FEDERATION_ENABLED,
  configPath: 'federation',
  label: 'Enable Social Features',
  tip: 'Send and receive activities on the Fediverse.',
  useSubmit: true,
};

export const FIELD_PROPS_FEDERATION_IS_PRIVATE = {
  apiPath: API_FEDERATION_PRIVATE,
  configPath: 'federation',
  label: 'Private',
  tip: 'Follow requests will require approval and only followers will see your activity.',
  useSubmit: true,
};

export const FIELD_PROPS_SHOW_FEDERATION_ENGAGEMENT = {
  apiPath: API_FEDERATION_SHOW_ENGAGEMENT,
  configPath: 'showEngagement',
  label: 'Show engagement',
  tip: 'Following, liking and sharing will appear in the chat feed.',
  useSubmit: true,
};

export const TEXTFIELD_PROPS_FEDERATION_LIVE_MESSAGE = {
  apiPath: API_FEDERATION_GOLIVE_MESSAGE,
  configPath: 'federation',
  maxLength: 500,
  placeholder: 'My stream has started, tune in!',
  label: 'Now Live message',
  tip: 'The message sent announcing that your live stream has begun. Tags will be automatically added. Leave blank to disable.',
};

export const TEXTFIELD_PROPS_FEDERATION_DEFAULT_USER = {
  apiPath: API_FEDERATION_USERNAME,
  configPath: 'federation',
  maxLength: 10,
  placeholder: 'owncast',
  default: 'owncast',
  label: 'Username',
  tip: 'The username used for sending and receiving activities from the Fediverse. For example, if you use "bob" as a username you would send messages to the fediverse from @bob@yourserver. Once people start following your instance you should not change this.\nNote: Username cannot have special characters. ',
};

export const TEXTFIELD_PROPS_FEDERATION_INSTANCE_URL = {
  apiPath: API_INSTANCE_URL,
  configPath: 'yp',
  maxLength: 255,
  placeholder: 'https://owncast.mysite.com',
  label: 'Server URL',
  tip: 'The full url to your Owncast server is required to enable social features. Must use SSL (https). Once people start following your instance you should not change this.',
  type: TEXTFIELD_TYPE_URL,
  pattern: DEFAULT_TEXTFIELD_URL_PATTERN,
  useTrim: true,
};

export const FIELD_PROPS_FEDERATION_NSFW = {
  apiPath: API_NSFW_SWITCH,
  configPath: 'instanceDetails',
  label: 'Potentially NSFW',
  tip: 'Turn this ON if you plan to stream explicit or adult content so previews of your stream can be marked as potentially sensitive.',
};

export const FIELD_PROPS_FEDERATION_BLOCKED_DOMAINS = {
  apiPath: API_FEDERATION_BLOCKED_DOMAINS,
  configPath: 'federation',
  label: 'Blocked domains',
  placeholder: 'bad.domain.biz',
  tip: 'You can block specific domains from interacting with you.',
};

export const VIDEO_VARIANT_SETTING_DEFAULTS = {
  // this one is currently unused
  audioBitrate: {
    min: 600,
    max: 1200,
    defaultValue: 800,
    unit: 'kbps',
    incrementBy: 100,
    tip: 'nothing to see here',
  },
  videoPassthrough: {
    tip: 'If enabled, all other settings will be disabled. Otherwise configure as desired.',
  },
  audioPassthrough: {
    tip: 'If No is selected, then you should set your desired Audio Bitrate.',
  },
  scaledWidth: {
    fieldName: 'scaledWidth',
    label: 'Resized Width',
    maxLength: 4,
    placeholder: '1280',
    tip: "Optionally resize this content's width.",
  },
  scaledHeight: {
    fieldName: 'scaledHeight',
    label: 'Resized Height',
    maxLength: 4,
    placeholder: '720',
    tip: "Optionally resize this content's height.",
  },
};

// VIDEO VARIANT FORM - framerate
export const FRAMERATE_DEFAULTS = {
  min: 24,
  max: 120,
  defaultValue: 24,
  unit: 'fps',
  incrementBy: null,
  tip: 'Reducing your framerate will decrease the amount of video that needs to be encoded and sent to your viewers, saving CPU and bandwidth at the expense of smoothness.  A lower value is generally is fine for most content.',
};
export const FRAMERATE_SLIDER_MARKS = {
  [FRAMERATE_DEFAULTS.min]: `${FRAMERATE_DEFAULTS.min} ${FRAMERATE_DEFAULTS.unit}`,
  25: ' ',
  30: ' ',
  50: ' ',
  60: ' ',
  90: ' ',
  [FRAMERATE_DEFAULTS.max]: `${FRAMERATE_DEFAULTS.max} ${FRAMERATE_DEFAULTS.unit}`,
};
export const FRAMERATE_TOOLTIPS = {
  [FRAMERATE_DEFAULTS.min]: `${FRAMERATE_DEFAULTS.min}fps - Good for film, presentations, music, low power/bandwidth servers.`,
  25: '25fps - Good for film, presentations, music, low power/bandwidth servers.',
  30: '30fps - Good for slow/casual games, chat, general purpose.',
  50: '50fps - Good for fast/action games, sports, HD video.',
  60: '60fps - Good for fast/action games, sports, HD video.',
  90: '90fps - Good for newer fast games and hardware.',
  [FRAMERATE_DEFAULTS.max]: `${FRAMERATE_DEFAULTS.max}fps - Experimental, use at your own risk!`,
};
// VIDEO VARIANT FORM - bitrate
export const VIDEO_BITRATE_DEFAULTS = {
  min: 400,
  max: 6000,
  defaultValue: 1200,
  unit: 'kbps',
  incrementBy: 100,
  tip: 'The overall quality of your stream is generally impacted most by bitrate.',
};

export const VIDEO_NAME_DEFAULTS = {
  fieldName: 'name',
  label: 'Name',
  maxLength: 15,
  placeholder: 'HD or Low',
  tip: 'Human-readable name for for displaying in the player.',
};

export const VIDEO_BITRATE_SLIDER_MARKS = {
  [VIDEO_BITRATE_DEFAULTS.min]: {
    style: {
      marginLeft: '24px',
    },
    label: `${VIDEO_BITRATE_DEFAULTS.min} ${VIDEO_BITRATE_DEFAULTS.unit}`,
  },
  3000: 3000,
  4500: 4500,
  [VIDEO_BITRATE_DEFAULTS.max]: {
    style: {
      marginLeft: '-10px',
    },
    label: `${VIDEO_BITRATE_DEFAULTS.max} ${VIDEO_BITRATE_DEFAULTS.unit}`,
  },
};
// VIDEO VARIANT FORM - encoder preset
// CPU
export const ENCODER_PRESET_SLIDER_MARKS = {
  0: {
    style: {
      marginLeft: '15px',
    },
    label: 'lowest',
  },
  1: ' ',
  2: ' ',
  3: ' ',
  4: {
    style: {
      marginLeft: '-15px',
    },
    label: 'highest',
  },
};
export const ENCODER_PRESET_TOOLTIPS = {
  0: 'Lowest hardware usage - lowest quality video',
  1: 'Low hardware usage - low quality video',
  2: 'Medium hardware usage - average quality video',
  3: 'High hardware usage - high quality video',
  4: 'Highest hardware usage - higher quality video',
};

export const ENCODER_RECOMMENDATION_THRESHOLD = {
  VIDEO_HEIGHT: 1080,
  VIDEO_BITRATE: 3000,
  HELP_TEXT:
    'You have only set one video quality variant. If your server has the computing resources, consider adding another, lower-quality variant, so more people can view your content!',
};

export const DEFAULT_SOCIAL_HANDLE: SocialHandle = {
  url: '',
  platform: '',
};

export const OTHER_SOCIAL_HANDLE_OPTION = 'OTHER_SOCIAL_HANDLE_OPTION';

export const S3_TEXT_FIELDS_INFO = {
  accessKey: {
    fieldName: 'accessKey',
    label: 'Access Key',
    maxLength: 255,
    placeholder: 'access key 123',
    tip: '',
  },
  acl: {
    fieldName: 'acl',
    label: 'ACL',
    maxLength: 255,
    placeholder: '',
    tip: 'Optional specific access control value to add to your content.  Generally not required.',
  },
  bucket: {
    fieldName: 'bucket',
    label: 'Bucket',
    maxLength: 255,
    placeholder: 'bucket 123',
    tip: 'Create a new bucket for each Owncast instance you may be running.',
  },
  endpoint: {
    fieldName: 'endpoint',
    label: 'Endpoint',
    maxLength: 255,
    placeholder: 'https://your.s3.provider.endpoint.com',
    tip: 'The full URL (with "https://") endpoint from your storage provider.',
    useTrim: true,
    type: TEXTFIELD_TYPE_URL,
    pattern: DEFAULT_TEXTFIELD_URL_PATTERN,
  },
  region: {
    fieldName: 'region',
    label: 'Region',
    maxLength: 255,
    placeholder: 'region 123',
    tip: '',
  },
  secret: {
    fieldName: 'secret',
    label: 'Secret key',
    type: 'password',
    maxLength: 255,
    placeholder: 'your secret key',
    tip: '',
  },
  pathPrefix: {
    fieldName: 'pathPrefix',
    label: 'Path prefix',
    maxLength: 255,
    placeholder: '/my/custom/path',
    tip: 'Optionally prepend a custom path for the final URL',
  },
  forcePathStyle: {
    fieldName: 'forcePathStyle',
    label: 'Force path-style',
    tip: "If your S3 provider doesn't support virtual-hosted-style URLs set this to ON (i.e. Oracle Cloud Object Storage)",
  },
};

export const DISCORD_CONFIG_FIELDS = {
  webhookUrl: {
    fieldName: 'webhook',
    label: 'Webhook URL',
    maxLength: 255,
    placeholder: 'https://discord.com/api/webhooks/837/jf38-6iNEv',
    tip: 'The webhook assigned to your channel.',
    type: TEXTFIELD_TYPE_URL,
    pattern: DEFAULT_TEXTFIELD_URL_PATTERN,
    useTrim: true,
  },
  goLiveMessage: {
    fieldName: 'goLiveMessage',
    label: 'Go Live Text',
    maxLength: 300,
    tip: 'The text to send when you go live.',
    placeholder: `I've gone live! Come watch!`,
  },
};

export const BROWSER_PUSH_CONFIG_FIELDS = {
  goLiveMessage: {
    fieldName: 'goLiveMessage',
    label: 'Go Live Text',
    maxLength: 200,
    tip: 'The text to send when you go live.',
    placeholder: `I've gone live! Come watch!`,
  },
};

export const PASSWORD_COMPLEXITY_RULES = [
  { min: 8, message: '- minimum 8 characters' },
  { max: 192, message: '- maximum 192 characters' },
  {
    pattern: /^(?=.*[a-z])/,
    message: '- at least one lowercase letter',
  },
  {
    pattern: /^(?=.*[A-Z])/,
    message: '- at least one uppercase letter',
  },
  {
    pattern: /\d/,
    message: '- at least one digit',
  },
  {
    pattern: /^(?=.*?[#?!@$%^&*-])/,
    message: '- at least one special character: !@#$%^&*',
  },
];

export const REGEX_PASSWORD = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*]).{8,192}$/;
