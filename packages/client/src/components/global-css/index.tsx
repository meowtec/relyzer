import createEmotionCache from '@emotion/cache';
import { CacheProvider, Global, GlobalProps } from '@emotion/react';

const emotionGlobalCache = createEmotionCache({
  key: 'emg',
});

export default function GlobalCss(props: GlobalProps) {
  return (
    <CacheProvider
      value={emotionGlobalCache}
    >
      <Global
        {...props}
      />
    </CacheProvider>
  );
}
