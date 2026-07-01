# Google AdSense setup

## Approval-stage settings

Keep these values until the site is approved:

```env
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-9328837907414732
NEXT_PUBLIC_ADSENSE_SCRIPT_ENABLED=false
NEXT_PUBLIC_ADSENSE_MANUAL_ADS_ENABLED=false
NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS=false
NEXT_PUBLIC_GOOGLE_CMP_ENABLED=false
```

The `google-adsense-account` meta tag and `ads.txt` remain present even while the ad script is disabled. There are no empty ad containers or placeholder gaps.

## After approval

1. Configure Google's Privacy & Messaging flow or another Google-certified CMP for regions that require consent.
2. Set `NEXT_PUBLIC_GOOGLE_CMP_ENABLED=true` when Google CMP is active. Do not add a second advertising-cookie banner.
3. Set `NEXT_PUBLIC_ADSENSE_SCRIPT_ENABLED=true`.
4. Add approved slot IDs.
5. Set `NEXT_PUBLIC_ADSENSE_MANUAL_ADS_ENABLED=true` only after slots exist.
6. Rebuild and redeploy; these values are embedded at build time.

Recommended placements are between substantial home sections, once in the middle and once at the bottom of a long guide, or after all explanatory content on a tool page. Do not place ads inside editors, uploads, match results, error panels, modals, sticky action bars, or beside Run, Replace, Copy, and Download controls.

Exclude interactive editor routes from aggressive Auto ads, including all locale versions of `/tester/`, `/replace/`, `/extract/`, `/file-filter/`, and `/explainer/`.
