"use client";

export function PrivacySettingsButton({ label }: { label: string }) {
  function openSettings() {
    window.dispatchEvent(new CustomEvent("regex-workbench:privacy-settings"));
    document.getElementById("privacy-settings-panel")?.showPopover?.();
  }
  return <button type="button" className="link-button" onClick={openSettings}>{label}</button>;
}
