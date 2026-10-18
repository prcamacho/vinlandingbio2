const HOST = "bio2.vinsalta.com";
// Public ingestion token, shared with vinsalta.com. This is not a personal API key.
const PROJECT_TOKEN = "phc_pNsCUuVFBmKYvezsXetntZ79hNzsqrcBuJRuz864MBM5";

export function analyticsAllowed(location, navigator) {
  return location.protocol === "https:" && location.hostname === HOST &&
    ["/", "/index.html"].includes(location.pathname) &&
    navigator.doNotTrack !== "1" && !navigator.globalPrivacyControl;
}

export function sanitizeCapture(event) {
  if (!event || event.event !== "$pageview") return null;
  const properties = {};
  // Keep only opaque SDK identifiers; never send query strings, referrers or user data.
  for (const key of ["token", "distinct_id", "$device_id", "$session_id", "$window_id", "$pageview_id", "$insert_id", "$lib", "$lib_version"]) {
    if (typeof event.properties?.[key] === "string") properties[key] = event.properties[key];
  }
  Object.assign(properties, {
    site: "bio2", environment: "production", path: "/", section: "landing",
    $current_url: `https://${HOST}/`, $pathname: "/", $host: HOST,
    $process_person_profile: false, $is_identified: false, $geoip_disable: true,
  });
  return {
    uuid: event.uuid, event: "$pageview", properties,
    ...(event.timestamp instanceof Date ? { timestamp: event.timestamp } : {}),
  };
}

async function startAnalytics() {
  const allowed = () => analyticsAllowed(window.location, navigator);
  if (!allowed()) return;
  try {
    const { default: posthog } = await import("./assets/posthog-1.434.14.js");
    if (!allowed()) return;
    posthog.init(PROJECT_TOKEN, {
      api_host: "https://us.i.posthog.com",
      autocapture: false, capture_pageview: false, capture_pageleave: false,
      disable_session_recording: true, capture_exceptions: false, capture_performance: false,
      advanced_disable_flags: true, advanced_disable_feature_flags: true,
      disable_surveys: true, disable_conversations: true, disable_product_tours: true,
      disable_web_experiments: true, disable_external_dependency_loading: true,
      person_profiles: "never", persistence: "localStorage", cross_subdomain_cookie: false,
      save_campaign_params: false, save_referrer: false, respect_dnt: true,
      rageclick: false, request_batching: true,
      before_send: (event) => allowed() ? sanitizeCapture(event) : null,
    });
    posthog.capture("$pageview", {}, { send_instantly: true });
  } catch { /* Analytics must never prevent the landing or its link from working. */ }
}

if (typeof window !== "undefined") void startAnalytics();
