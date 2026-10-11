import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles';

export default function Screen({ children, fullBleed = false, onScroll = undefined, onScrollBeginDrag = undefined, onWheel = undefined, onLayout = undefined, contentContainerStyle = undefined }) {
  return (
    <SafeAreaView style={styles.screen} edges={fullBleed ? ['left', 'right'] : ['left', 'right', 'bottom']}>
      <ScrollView
        contentContainerStyle={[styles.content, fullBleed && localStyles.fullBleed, contentContainerStyle]}
        onScroll={onScroll}
        onScrollBeginDrag={onScrollBeginDrag}
        {...(onWheel ? { onWheel } : {})}
        onLayout={onLayout}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  fullBleed: { paddingHorizontal: 0, paddingTop: 0, paddingBottom: 24, gap: 0 },
});
