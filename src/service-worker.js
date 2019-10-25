const offlineHTML = getOfflineHtml();

self.addEventListener('fetch', event => {
    // We only want to call event.respondWith() if this is a navigation request
    // for an HTML page.
    // request.mode of 'navigate' is unfortunately not supported in Chrome
    // versions older than 49, so we need to include a less precise fallback,
    // which checks for a GET request with an Accept: text/html header.
    if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {

        event.respondWith(
            fetch(event.request).catch(error => {
                // The catch is only triggered if fetch() throws an exception, which will most likely
                // happen due to the server being unreachable.
                // If fetch() returns a valid HTTP response with an response code in the 4xx or 5xx
                // range, the catch() will NOT be called. If you need custom handling for 4xx or 5xx
                // errors, see https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker/fallback-response
                return new Response(offlineHTML, {headers: {'Content-Type': 'text/html'}});
            })
        );
    }

    // If our if() condition is false, then this fetch handler won't intercept the request.
    // If there are any other fetch handlers registered, they will get a chance to call
    // event.respondWith(). If no fetch handlers call event.respondWith(), the request will be
    // handled by the browser as if there were no service worker involvement.
});

// Asks the user to install the service worker (mobile primarily)
self.addEventListener('beforeinstallprompt', (e) => {
    prompt();
});

// The ServiceWorker.skipWaiting() ensures that any new versions of a service worker will take over the page and become activated immediately.
self.skipWaiting();

function getOfflineHtml() {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Offline page</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex" />
    <meta name="robots" content="nofollow" />    
    <style>
    body {
        margin: 0px;
      }
      
      * {
        font-family: poppins, sans-serif;
      }
      
      header {
        background-color: #333; 
        position: fixed;
        top: 0;
        width: 100%;
        box-sizing: border-box;
        padding: 0px;
        margin: 0px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      main {
        text-align: center;
        margin: 0 auto;
        max-width: 1000px;
      }
      #nav-bar {
        @media screen and (max-width: 600px) 
      }
      .nav-links {
        list-style: none;
      }
      .nav-link {
        display: inline-block;
        padding: 0px 60px 0px 0px;
      }
      .nav-link a {
        transition: all 0.3s ease 0s;
        text-decoration: none;
        font-size: 24px;
        color: white;;
      }
      a:hover {
        color: red;
      }
      .logo {
        width: 10%;
        padding-left: 60px;
      }
      h1 {
        text-align: center;
        padding-top: 10%;
      }
      .subtext {
        text-align: center;
        font-size: 25px;
        padding-top: 0px;
      }
      
      h3 {
        text-align: center;
      }
      
    </style>

</head>
<body>    
<header id="header">      
  <nav id="nav-bar">
    <ul class="nav-links">
      <li class="nav-link"><a href="#video">Stuff</a></li>
      <li class="nav-link"><a href="#video">Other stuff</a></li>
      <li class="nav-link"><a href="#email">Hidden stuff</a></li>
  </ul>
  </nav>
</header>
<main>
  <h1>Service workers are awesome!</h1>
  <p class="subtext">Ohh noes! This page is offline</p>
  <a class="subtext" href="" onclick="window.location.reload();">Reconnect</a>
</main>    
</section>  
</body>
</html>
`
}
