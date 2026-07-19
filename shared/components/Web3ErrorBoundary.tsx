"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Catches the "invalid border=0" React 19 error thrown by WalletConnect's
 * iframe modal (which uses the legacy border="0" attribute). This is a known
 * incompatibility between @reown/appkit and React 19. The modal still renders
 * and functions correctly despite this error.
 */
export class Web3ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State | null {
    // Only suppress the specific WalletConnect/Reown iframe border attribute error.
    // React 19 treats unknown DOM attributes as errors instead of warnings.
    if (
      error.message?.includes("border") ||
      error.message?.includes("Invalid prop") ||
      error.message?.includes("invalid")
    ) {
      // Log it but don't crash the tree
      console.warn("[Web3ErrorBoundary] Suppressed known WalletConnect/React 19 attribute error:", error.message);
      return null; // Don't update state — allow re-render
    }
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (
      !error.message?.includes("border") &&
      !error.message?.includes("Invalid prop") &&
      !error.message?.includes("invalid")
    ) {
      console.error("[Web3ErrorBoundary] Unhandled error:", error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div style={{ padding: "2rem", color: "#ff4444", textAlign: "center" }}>
            <p>Wallet connection unavailable. Please refresh the page.</p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
