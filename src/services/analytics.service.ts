const ANALYTICS_ENABLED = process.env.ANALYTICS_ENABLED === 'true';

export const trackEvent = (eventName: string, properties: any) => {
  if (!ANALYTICS_ENABLED) {
    console.log(`Analytics Disabled: ${eventName}`, properties);
    return;
  }
  console.log(`Analytics Event: ${eventName}`, properties);
  // TODO: Integrate with actual analytics platform (e.g., Google Analytics, Mixpanel)
};