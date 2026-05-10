const AUTH_COOKIE_NAME = 'mothers_day_access';
const AUTH_COOKIE_TTL_SECONDS = 60 * 60 * 24 * 7;
const LOGIN_PATH = '/__family-login';
const ENCODER = new TextEncoder();
const REQUIRED_ENV_KEYS = ['MOTHERS_DAY_PASSWORD', 'MOTHERS_DAY_AUTH_SECRET'];
const TOKEN_MESSAGE = 'mothers-day-family-access-v1';

function getNetlifyEnv() {
  if (
    typeof Netlify === 'undefined' ||
    !Netlify.env ||
    typeof Netlify.env.get !== 'function'
  ) {
    return null;
  }

  return Netlify.env;
}

function getEnvValue(name) {
  const env = getNetlifyEnv();

  if (!env) {
    return '';
  }

  const value = Netlify.env.get(name);

  return typeof value === 'string' ? value : '';
}

function getMissingEnvKeys() {
  const env = getNetlifyEnv();

  if (!env) {
    return REQUIRED_ENV_KEYS;
  }

  return REQUIRED_ENV_KEYS.filter((key) => !Netlify.env.get(key));
}

function getEnvDiagnostics(missingKeys) {
  const env = getNetlifyEnv();

  if (!env) {
    return 'Netlify.env API is unavailable in this runtime invocation';
  }

  const keyStates = REQUIRED_ENV_KEYS.map((key) => {
    const value = Netlify.env.get(key);
    const exists =
      typeof Netlify.env.has === 'function' ? Netlify.env.has(key) : typeof value === 'string';
    const state = typeof value === 'string' && value.length > 0 ? 'present' : exists ? 'empty' : 'missing';

    return `${key}:${state}`;
  }).join(' ');

  return `envApi="get:${typeof Netlify.env.get} has:${typeof Netlify.env.has} toObject:${typeof Netlify.env.toObject}" envKeyStates="${keyStates}" missing="${missingKeys.join(',') || 'none'}"`;
}

function logMissingEnv({ context, missingKeys }) {
  const siteName = context?.site?.name || 'unknown-site';
  const deployId = context?.deploy?.id || 'unknown-deploy';
  const deployContext = context?.deploy?.context || 'unknown-context';
  const region = context?.server?.region || 'unknown-region';
  const requestId = context?.requestId || 'unknown-request';

  console.warn(
    `[family-auth] Missing required Netlify Edge environment variable(s): ${missingKeys.join(
      ', ',
    )}. Edge functions can only read variables whose scope includes Functions and whose deploy context matches this deploy. site=${siteName} deploy=${deployId} deployContext=${deployContext} region=${region} requestId=${requestId} ${getEnvDiagnostics(missingKeys)}`,
  );
}

function escapeHtml(value = '') {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function base64UrlEncode(bytes) {
  const binary = String.fromCharCode(...new Uint8Array(bytes));

  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

async function createAccessToken() {
  const secret = getEnvValue('MOTHERS_DAY_AUTH_SECRET');

  if (!secret) {
    return '';
  }

  const key = await crypto.subtle.importKey(
    'raw',
    ENCODER.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, ENCODER.encode(TOKEN_MESSAGE));

  return base64UrlEncode(signature);
}

function getCookie({ request, context }, name) {
  const contextCookie = context?.cookies?.get?.(name);

  if (typeof contextCookie === 'string') {
    return contextCookie;
  }

  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
  const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.slice(name.length + 1)) : '';
}

function isSafeReturnPath(value) {
  return Boolean(value && value.startsWith('/') && !value.startsWith('//'));
}

function getReturnPath(request) {
  const url = new URL(request.url);
  const returnTo = url.searchParams.get('returnTo');

  if (isSafeReturnPath(returnTo)) {
    return returnTo;
  }

  if (url.pathname === LOGIN_PATH) {
    return '/';
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

function createCookie(token) {
  return `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=${AUTH_COOKIE_TTL_SECONDS}; HttpOnly; Secure; SameSite=Lax`;
}

function renderLoginPage({ request, error = '', isMissingConfig = false }) {
  const returnPath = getReturnPath(request);
  const action = `${LOGIN_PATH}?returnTo=${encodeURIComponent(returnPath)}`;

  return new Response(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Private Family Memories</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=Jost:wght@200;300;400&display=swap');
      * { box-sizing: border-box; }
      body {
        min-height: 100vh;
        margin: 0;
        display: grid;
        place-items: center;
        padding: 2rem 1rem;
        color: #f0e6d8;
        background:
          radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124, 180, 210, 0.14) 0%, transparent 70%),
          radial-gradient(ellipse 60% 50% at 80% 100%, rgba(184, 115, 138, 0.12) 0%, transparent 70%),
          radial-gradient(circle at 18% 20%, rgba(214, 185, 104, 0.13), transparent 30%),
          #06030d;
        font-family: 'Jost', system-ui, sans-serif;
        overflow: hidden;
      }
      body::before {
        position: fixed;
        inset: -20%;
        background:
          radial-gradient(circle at 25% 25%, rgba(124, 180, 210, 0.12), transparent 18%),
          radial-gradient(circle at 70% 65%, rgba(194, 149, 106, 0.12), transparent 20%);
        filter: blur(45px);
        animation: drift 18s ease-in-out infinite alternate;
        content: '';
      }
      @keyframes drift {
        from { transform: translate3d(-1.5rem, -1rem, 0) scale(1); }
        to { transform: translate3d(1.5rem, 1rem, 0) scale(1.04); }
      }
      .card {
        position: relative;
        width: min(100%, 31rem);
        padding: clamp(2rem, 7vw, 3rem);
        border: 1px solid rgba(240, 230, 216, 0.11);
        border-radius: 1.5rem;
        background: rgba(240, 230, 216, 0.045);
        box-shadow: 0 26px 90px rgba(0, 0, 0, 0.34), 0 0 95px rgba(124, 180, 210, 0.1);
        backdrop-filter: blur(22px);
        text-align: center;
        animation: rise 0.9s cubic-bezier(.25,.46,.45,.94) both;
      }
      @keyframes rise {
        from { opacity: 0; transform: translateY(28px); filter: blur(14px); }
        to { opacity: 1; transform: translateY(0); filter: blur(0); }
      }
      .label {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 1rem;
        color: #d9bd6c;
        font-size: 11px;
        font-weight: 300;
        letter-spacing: 0.3em;
        text-transform: uppercase;
      }
      .label::before,
      .label::after {
        width: 3rem;
        height: 1px;
        background: linear-gradient(90deg, transparent, #d9bd6c);
        content: '';
      }
      .label::after { background: linear-gradient(90deg, #d9bd6c, transparent); }
      h1 {
        margin: 0;
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: clamp(2.3rem, 9vw, 4rem);
        font-weight: 300;
        line-height: 1;
      }
      h1 span {
        background: linear-gradient(135deg, #9cc9dd, #f0e6d8, #d9bd6c);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      p {
        max-width: 24rem;
        margin: 1.25rem auto 2rem;
        color: #c8bfb4;
        font-weight: 300;
        line-height: 1.8;
      }
      label {
        display: block;
        margin-bottom: 0.55rem;
        color: #d9bd6c;
        font-size: 11px;
        letter-spacing: 0.26em;
        text-align: left;
        text-transform: uppercase;
      }
      input {
        width: 100%;
        padding: 1rem 1.05rem;
        color: #f0e6d8;
        background: rgba(6, 3, 13, 0.55);
        border: 1px solid rgba(240, 230, 216, 0.14);
        border-radius: 999px;
        outline: none;
      }
      input:focus {
        border-color: rgba(124, 180, 210, 0.54);
        box-shadow: 0 0 0 4px rgba(124, 180, 210, 0.1);
      }
      .error {
        min-height: 1.3rem;
        margin: 0.85rem 0 0;
        color: #d4a0b5;
        font-size: 0.85rem;
      }
      button {
        width: 100%;
        margin-top: 1.1rem;
        padding: 1rem 1.25rem;
        color: #fff8f2;
        background: linear-gradient(135deg, #7cb4d2 0%, #b8738a 48%, #d9bd6c 100%);
        border: 0;
        border-radius: 999px;
        box-shadow: 0 16px 38px rgba(124, 180, 210, 0.16);
        cursor: pointer;
        font: inherit;
        font-size: 0.75rem;
        letter-spacing: 0.24em;
        text-transform: uppercase;
      }
    </style>
  </head>
  <body>
    <form class="card" method="POST" action="${escapeHtml(action)}">
      <div class="label">Private tribute</div>
      <h1><span>A private family</span><br />memory collection</h1>
      <p>${isMissingConfig ? 'The private access password has not been configured yet.' : 'A quiet place for the photos, stories, and little pieces of love meant just for family.'}</p>
      <label for="password">Password</label>
      <input id="password" name="password" type="password" autocomplete="current-password" autofocus />
      <div class="error">${escapeHtml(error)}</div>
      <button type="submit">Enter</button>
    </form>
  </body>
</html>`,
    {
      status: isMissingConfig ? 500 : 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store',
      },
    },
  );
}

export default async function familyAuth(request, context) {
  const password = getEnvValue('MOTHERS_DAY_PASSWORD');
  const missingKeys = getMissingEnvKeys();
  const token = await createAccessToken();

  if (missingKeys.length > 0 || !password || !token) {
    logMissingEnv({ context, missingKeys: missingKeys.length > 0 ? missingKeys : REQUIRED_ENV_KEYS });

    return renderLoginPage({ request, isMissingConfig: true });
  }

  if (getCookie({ request, context }, AUTH_COOKIE_NAME) === token) {
    return context.next();
  }

  const url = new URL(request.url);

  if (url.pathname === LOGIN_PATH && request.method === 'POST') {
    const formData = await request.formData();
    const submittedPassword = String(formData.get('password') || '');

    if (submittedPassword === password) {
      return new Response(null, {
        status: 303,
        headers: {
          location: new URL(getReturnPath(request), url.origin).toString(),
          'set-cookie': createCookie(token),
          'cache-control': 'no-store',
        },
      });
    }

    return renderLoginPage({
      request,
      error: 'That is not quite it. Try the family password again.',
    });
  }

  return renderLoginPage({ request });
}
