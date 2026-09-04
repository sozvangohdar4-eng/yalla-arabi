package com.yallaarabi.app;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Vibrator;
import android.os.VibrationEffect;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

public class MainActivity extends AppCompatActivity {

    private static final String PREFS_NAME = "YallaArabiPrefs";
    private static final String KEY_SERVER_URL = "server_url";
    
    // Default server URLs: Production HTTPS and Local Wi-Fi development
    private static final String DEFAULT_SERVER_URL = "http://192.168.100.224:8080";
    private static final String OFFLINE_FALLBACK_URL = "file:///android_asset/www/index.html";

    private WebView webView;
    private SwipeRefreshLayout swipeRefresh;
    private TextView offlineBanner;
    private SharedPreferences prefs;
    private boolean isOfflineFallbackActive = false;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);

        webView = findViewById(R.id.webView);
        swipeRefresh = findViewById(R.id.swipeRefreshLayout);
        offlineBanner = findViewById(R.id.offlineBanner);

        setupWebViewSettings();
        setupSwipeRefresh();
        loadApp();
    }

    private void setupWebViewSettings() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        
        // Unblock audio autoplay without user gesture on Android
        settings.setMediaPlaybackRequiresUserGesture(false);

        // Responsive viewport settings for Samsung S23 Ultra AMOLED display
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);

        // Cache mode: Live server updates with offline cache capability
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        // Inject Native Android Bridge
        webView.addJavascriptInterface(new AndroidBridge(), "Android");

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (newProgress == 100) {
                    swipeRefresh.setRefreshing(false);
                }
            }
        });

        webView.setWebViewClient(new CustomWebViewClient());
    }

    private void setupSwipeRefresh() {
        swipeRefresh.setColorSchemeResources(R.color.primary_sky, R.color.accent_emerald);
        swipeRefresh.setOnRefreshListener(() -> {
            if (isOfflineFallbackActive && isNetworkAvailable()) {
                // Retry connecting to live server
                isOfflineFallbackActive = false;
                loadApp();
            } else {
                webView.reload();
            }
        });
    }

    private String getTargetServerUrl() {
        return prefs.getString(KEY_SERVER_URL, DEFAULT_SERVER_URL);
    }

    private void loadApp() {
        if (isNetworkAvailable()) {
            String serverUrl = getTargetServerUrl();
            webView.loadUrl(serverUrl);
        } else {
            switchToOfflineFallback();
        }
    }

    private void switchToOfflineFallback() {
        isOfflineFallbackActive = true;
        webView.loadUrl(OFFLINE_FALLBACK_URL);

        // Display brief notification that app is running in offline mode
        offlineBanner.setVisibility(View.VISIBLE);
        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            offlineBanner.setVisibility(View.GONE);
        }, 4000);
    }

    private boolean isNetworkAvailable() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        if (cm != null) {
            NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
            return activeNetwork != null && activeNetwork.isConnected();
        }
        return false;
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    // --- Custom WebView Client with Automatic Server Failover ---
    private class CustomWebViewClient extends WebViewClient {

        @Override
        public void onPageStarted(WebView view, String url, Bitmap favicon) {
            super.onPageStarted(view, url, favicon);
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);
            swipeRefresh.setRefreshing(false);
        }

        @Override
        public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
            super.onReceivedError(view, request, error);
            // If the main page fails to connect to the server, seamlessly switch to offline bundle!
            if (request.isForMainFrame() && !isOfflineFallbackActive) {
                switchToOfflineFallback();
            }
        }

        @Override
        public void onReceivedHttpError(WebView view, WebResourceRequest request, WebResourceResponse errorResponse) {
            super.onReceivedHttpError(view, request, errorResponse);
            if (request.isForMainFrame() && errorResponse.getStatusCode() >= 500 && !isOfflineFallbackActive) {
                switchToOfflineFallback();
            }
        }
    }

    // --- JavaScript Native Bridge for Web-Android Communication ---
    public class AndroidBridge {

        @JavascriptInterface
        public String getServerUrl() {
            return getTargetServerUrl();
        }

        @JavascriptInterface
        public void setServerUrl(String newUrl) {
            if (newUrl != null && !newUrl.trim().isEmpty()) {
                prefs.edit().putString(KEY_SERVER_URL, newUrl.trim()).apply();
                runOnUiThread(() -> {
                    Toast.makeText(MainActivity.this, "سێرڤەر گۆڕدرا بۆ: " + newUrl, Toast.LENGTH_SHORT).show();
                    loadApp();
                });
            }
        }

        @JavascriptInterface
        public void triggerHaptic(int ms) {
            Vibrator v = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
            if (v != null && v.hasVibrator()) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    v.vibrate(VibrationEffect.createOneShot(ms, VibrationEffect.DEFAULT_AMPLITUDE));
                } else {
                    v.vibrate(ms);
                }
            }
        }

        @JavascriptInterface
        public boolean isOffline() {
            return isOfflineFallbackActive;
        }
    }
}
