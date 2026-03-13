# Phase 1 Component Integration Examples

This document shows how to integrate the new Phase 1 components into existing and new tools.

## 1. Global Tool Search

### Already Integrated
The search is globally available in the Navbar. Users can:
- Click the search button in the navbar
- Press `Cmd+K` (Mac) or `Ctrl+K` (Windows) anywhere in the app

### Custom Integration (Optional)
If you want to trigger search from a custom button:

```jsx
import { useState } from "react";
import ToolSearch from "@/components/common/ToolSearch";

function MyComponent() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsSearchOpen(true)}>
        Search Tools
      </button>
      
      <ToolSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
}
```

---

## 2. Loading Spinner Integration

### Example 1: API Tester - Replace Button Text

**Before:**
```jsx
<button onClick={onSend} disabled={isSending}>
  {isSending ? "Sending..." : "Send"}
</button>
```

**After:**
```jsx
import { InlineSpinner } from "@/components/UI/LoadingSpinner";

<button onClick={onSend} disabled={isSending} className="btn-cta-green flex items-center gap-2">
  {isSending && <InlineSpinner />}
  {isSending ? "Sending..." : "Send"}
</button>
```

### Example 2: JSON Formatter - Processing State

**Before:**
```jsx
{isProcessing && <span>Processing...</span>}
```

**After:**
```jsx
import LoadingSpinner from "@/components/UI/LoadingSpinner";

{isProcessing && (
  <LoadingSpinner 
    size="sm" 
    message="Formatting JSON..." 
  />
)}
```

### Example 3: Dashboard - Initial Load

**Before:**
```jsx
{isLoading && <p>Loading dashboard...</p>}
```

**After:**
```jsx
import { LoadingOverlay } from "@/components/UI/LoadingSpinner";

{isLoading && <LoadingOverlay message="Loading dashboard..." />}
```

### Example 4: Tool History - Data Fetching

```jsx
import LoadingSpinner from "@/components/UI/LoadingSpinner";

function ToolHistory() {
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function loadHistory() {
      setIsLoading(true);
      const data = await fetchHistory();
      setHistory(data);
      setIsLoading(false);
    }
    loadHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="api-history-panel">
        <LoadingSpinner size="md" message="Loading history..." />
      </div>
    );
  }

  return (
    <div className="api-history-panel">
      {/* History content */}
    </div>
  );
}
```

---

## 3. Error Alert Integration

### Example 1: API Tester - Request Errors

**Before:**
```jsx
{requestError && <p className="tool-error">{requestError}</p>}
```

**After:**
```jsx
import ErrorAlert from "@/components/UI/ErrorAlert";

{requestError && (
  <ErrorAlert
    type="error"
    message={requestError}
    onDismiss={() => setRequestError("")}
    action={{
      label: "Retry",
      onClick: onSend
    }}
  />
)}
```

### Example 2: JSON Formatter - Parse Errors

**Before:**
```jsx
{parseError && (
  <p className="tool-error">
    {parseError.message}
    {parseError.line && ` at line ${parseError.line}`}
  </p>
)}
```

**After:**
```jsx
import ErrorAlert from "@/components/UI/ErrorAlert";

{parseError && (
  <ErrorAlert
    type="error"
    title="JSON Parse Error"
    message={`${parseError.message}${parseError.line ? ` at line ${parseError.line}, column ${parseError.column}` : ""}`}
    onDismiss={() => setParseError(null)}
    action={parseError.line ? {
      label: `Jump to line ${parseError.line}`,
      onClick: () => jumpToLine(parseError.line)
    } : undefined}
  />
)}
```

### Example 3: Form Validation

```jsx
import { InlineError } from "@/components/UI/ErrorAlert";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  function validateEmail() {
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    if (!email.includes("@")) {
      setEmailError("Invalid email format");
      return false;
    }
    setEmailError("");
    return true;
  }

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={validateEmail}
        className={emailError ? "border-red-500" : ""}
      />
      {emailError && <InlineError message={emailError} />}
    </div>
  );
}
```

### Example 4: Network Errors with Toast

```jsx
import { useState, useEffect } from "react";
import { ErrorToast } from "@/components/UI/ErrorAlert";

function MyComponent() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  async function saveData() {
    try {
      await api.save(data);
    } catch (error) {
      setToastMessage(error.message);
      setShowToast(true);
      
      // Auto-dismiss after 5 seconds
      setTimeout(() => setShowToast(false), 5000);
    }
  }

  return (
    <>
      <button onClick={saveData}>Save</button>
      
      {showToast && (
        <ErrorToast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}
```

### Example 5: Warning Messages

```jsx
import ErrorAlert from "@/components/UI/ErrorAlert";

{quotaInfo?.remaining < 10 && (
  <ErrorAlert
    type="warning"
    title="Low Quota Warning"
    message={`You have ${quotaInfo.remaining} requests remaining. Quota resets at ${new Date(quotaInfo.resetAt).toLocaleTimeString()}.`}
  />
)}
```

### Example 6: Info Messages

```jsx
import ErrorAlert from "@/components/UI/ErrorAlert";

{isFirstVisit && (
  <ErrorAlert
    type="info"
    title="Welcome to API Tester"
    message="Try the sample request to get started, or enter your own API endpoint."
    onDismiss={() => setIsFirstVisit(false)}
    action={{
      label: "Load Sample",
      onClick: onLoadSample
    }}
  />
)}
```

---

## 4. Complete Tool Integration Example

Here's a complete example showing all three components in a new tool:

```jsx
"use client";

import { useState } from "react";
import LoadingSpinner, { InlineSpinner } from "@/components/UI/LoadingSpinner";
import ErrorAlert from "@/components/UI/ErrorAlert";

export default function MyNewTool() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function handleProcess() {
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await processData();
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <section className="tool-page">
      <header className="tool-header">
        <div>
          <h1>My New Tool</h1>
          <p>Description of what this tool does.</p>
        </div>
      </header>

      <div className="tool-actions">
        <button 
          onClick={handleProcess} 
          disabled={isProcessing}
          className="btn-cta-green flex items-center gap-2"
        >
          {isProcessing && <InlineSpinner />}
          {isProcessing ? "Processing..." : "Process"}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <ErrorAlert
          type="error"
          message={error}
          onDismiss={() => setError(null)}
          action={{
            label: "Try Again",
            onClick: handleProcess
          }}
        />
      )}

      {/* Loading State */}
      {isProcessing && (
        <div className="tool-block">
          <LoadingSpinner 
            size="md" 
            message="Processing your data..." 
          />
        </div>
      )}

      {/* Result Display */}
      {result && !isProcessing && (
        <div className="tool-block">
          <h2>Result</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </section>
  );
}
```

---

## 5. Migration Checklist

When updating an existing tool to use Phase 1 components:

### Loading States
- [ ] Replace text-only loading indicators with `<LoadingSpinner />`
- [ ] Add `<InlineSpinner />` to buttons during async operations
- [ ] Use `<LoadingOverlay />` for full-page loading states
- [ ] Add loading messages that describe what's happening

### Error Handling
- [ ] Replace `<p className="tool-error">` with `<ErrorAlert />`
- [ ] Add dismiss functionality to errors
- [ ] Add retry actions where appropriate
- [ ] Use `type="warning"` for non-critical issues
- [ ] Use `type="info"` for informational messages
- [ ] Add `<InlineError />` for form validation

### Search
- [ ] Verify tool is registered in tool registry
- [ ] Add keywords to tool config for better searchability
- [ ] Test that tool appears in search results

---

## 6. Best Practices

### Loading States
✅ **DO:**
- Show loading state immediately when action starts
- Provide descriptive messages ("Formatting JSON..." not just "Loading...")
- Disable interactive elements during loading
- Use appropriate size for context (sm for inline, md for panels, lg for full page)

❌ **DON'T:**
- Leave users without feedback during async operations
- Use generic "Loading..." for everything
- Forget to clear loading state on error

### Error Handling
✅ **DO:**
- Provide clear, actionable error messages
- Offer retry or alternative actions when possible
- Use appropriate error types (error/warning/info)
- Make errors dismissible
- Log errors for debugging

❌ **DON'T:**
- Show technical error messages to users
- Leave errors without context
- Forget to clear errors when retrying
- Use errors for success messages

### Search
✅ **DO:**
- Add descriptive tool names
- Write clear, concise descriptions
- Include relevant keywords in tool config
- Keep tool names consistent with UI

❌ **DON'T:**
- Use overly technical names
- Forget to update tool registry when adding tools
- Use generic descriptions

---

## 7. Testing Your Integration

After integrating Phase 1 components, test:

1. **Loading States:**
   - Verify spinner appears immediately
   - Check message is descriptive
   - Confirm spinner disappears on completion/error
   - Test button disabled state

2. **Error Handling:**
   - Trigger error conditions
   - Verify error displays correctly
   - Test dismiss functionality
   - Test retry action (if applicable)
   - Check error clears on success

3. **Search:**
   - Open search with Cmd+K
   - Search for your tool by name
   - Search by keywords
   - Verify navigation works
   - Test on mobile

---

## Need Help?

If you encounter issues integrating Phase 1 components:

1. Check this document for examples
2. Review `PHASE1_IMPLEMENTATION.md` for technical details
3. Look at existing tool implementations
4. Check component prop types in source files

---

## Next: Phase 2 Components

Coming soon:
- Favorites button component
- Recent tools tracker
- Analytics widgets
- Usage tracking hooks
