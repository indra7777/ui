# Posthog Analytics Integration

This document explains how to integrate Posthog Analytics across all pages of the website.

## What's Been Done

1. A dedicated partial file has been created at `views/partials/analytics.ejs` containing the Posthog Analytics script.

## How to Use

To include Posthog Analytics on any page, add the following line in the `<head>` section of your EJS file:

```ejs
<%- include('partials/analytics') %>
```

If your EJS file is in a subdirectory, adjust the path accordingly:

```ejs
<%- include('../partials/analytics') %>
```

## Already Implemented

The Posthog Analytics script has already been added to:

- `views/partials/header.ejs` (affects all pages that include this header)
- `views/index.ejs`
- `views/blogs.ejs`
- `views/try.ejs`

## Benefits of This Approach

1. **Centralized Management**: Any updates to the Posthog configuration only need to be made in one place.
2. **Consistency**: Ensures the same tracking code is used across all pages.
3. **Minimal Changes**: Doesn't require modifying every file in the codebase.
4. **Easy to Maintain**: New pages automatically get analytics by including the partial.

## Verification

To verify that Posthog Analytics is working correctly:

1. Visit your Posthog dashboard at https://us.posthog.com/
2. Check that events are being recorded from your website
3. Verify that user sessions are being tracked correctly

## Troubleshooting

If analytics data isn't appearing:

1. Make sure the partial is correctly included in the `<head>` section
2. Check browser console for any JavaScript errors
3. Verify that the Posthog project key is correct
4. Ensure there are no content security policies blocking the script
