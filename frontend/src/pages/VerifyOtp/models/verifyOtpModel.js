export function extractOtpSessionParams(locationState = {}, searchParams) {
  return {
    userId: locationState.userId || searchParams.get('userId') || '',
    purpose: locationState.purpose || searchParams.get('purpose') || 'REGISTER_VERIFY',
    channel: locationState.channel || searchParams.get('channel') || 'EMAIL',
    target: locationState.target || searchParams.get('target') || '',
    cooldownSeconds: Number(locationState.cooldownSeconds || searchParams.get('cooldown') || 60),
    devCode: locationState.devCode || '',
  };
}
