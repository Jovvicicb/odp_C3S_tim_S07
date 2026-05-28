export const SidebarEvents = {
  myCommunitiesChanged: "my-communities-changed",
} as const;

const dispatchMyCommunitiesChanged = () => {
  window.dispatchEvent(new Event(SidebarEvents.myCommunitiesChanged));
};

export const notifyMyCommunitiesChanged = (delayMs = 500) => {
  window.setTimeout(() => {
    dispatchMyCommunitiesChanged();
  }, delayMs);
};